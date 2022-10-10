import { cookieNames } from '../utils/cookies'

export default () => {
  return async (ctx, next) => {
    ctx.log.debug('that works?')
    const cookies = ctx.request.header.cookie || false
    if (cookies) {
      const token = cookies
        .split(';')
        .find((cookie) =>
          cookie.trim().startsWith(`${cookieNames.userSession}=`)
        )
        ?.split('=')?.[1]
      if (token) {
        ctx.request.header.authorization = `Bearer ${token}`
      }
    }

    console.log('PRODUCTION_URL: ', process.env.PRODUCTION_URL)

    await next()
    const cookieOptions = {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: false,
      // secure:
      //   process.env.NODE_ENV === 'production' &&
      //   process.env.PRODUCTION_URL?.startsWith('https'),
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 Day Age
      domain:
        process.env.NODE_ENV === 'development'
          ? 'localhost'
          : process.env.PRODUCTION_URL,
    }

    // For login and register paths
    if (
      [
        '/api/auth/local',
        '/api/auth/local/register',
        '/api/auth/reset-password',
      ].includes(ctx.request.path)
    ) {
      const { jwt, ...rest } = ctx.response.body
      // Remove the issued JWT from the response body
      ctx.response.body = { ...rest }
      // Put the JWT in a httpOnly cookie
      ctx.cookies.set(cookieNames.userSession, jwt, cookieOptions)
    }
    // For logout path
    if (ctx.request.path === '/api/auth/logout') {
      // Delete the session httpOnly cookie
      ctx.cookies.set(cookieNames.userSession, null, cookieOptions)
      return ctx.send({ message: 'Logout success' }, 200)
    }
  }
}
