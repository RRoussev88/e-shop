export default () => {
  return async (ctx, next) => {
    const cookies = ctx.request.header.cookie || false
    if (cookies) {
      const token = cookies
        .split(';')
        .find((cookie) => cookie.trim().startsWith('userSession='))
        ?.split('=')?.[1]
      if (token) {
        ctx.request.header.authorization = `Bearer ${token}`
      }
    }
    await next()

    // For login path
    if (ctx.request.path === '/api/auth/local') {
      const { jwt, ...rest } = ctx.response.body
      // Remove the issued JWT from the response body
      ctx.response.body = { ...rest }
      // Put the JWT in a httpOnly cookie
      ctx.cookies.set('userSession', jwt, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 14, // 14 Day Age
        domain:
          process.env.NODE_ENV === 'development'
            ? 'localhost'
            : process.env.PRODUCTION_URL,
      })
    }
  }
}
