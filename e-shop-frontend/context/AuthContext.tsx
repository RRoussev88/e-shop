import { deleteCookie, getCookie, hasCookie, setCookie } from 'cookies-next'
import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/router'
import { isUser } from '../utils/format'
import { API_URL, cookieNames } from '../utils/urls'
import { AuthResponse, User } from '../pages/api/types'

type AuthContextValue = {
  user: User | null
  signup: (email: string, username: string, password: string) => Promise<void>
  loginUser: (email: string, password: string) => Promise<void>
  resetPassword: (
    ecode: string,
    password: string,
    passwordConfirmation: string
  ) => Promise<void>
  logoutUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  signup: async (email: string, username: string, password: string) => {},
  loginUser: async (email: string, password: string) => {},
  resetPassword: async (
    code: string,
    password: string,
    passwordConfirmation: string
  ) => {},
  logoutUser: async () => {},
})

const cookieOptions = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 30, // 30 days
} as const

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  const loginUser = async (email: string, password: string) => {
    try {
      const authentication = await fetch(`${API_URL}/api/auth/local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ identifier: email, password }),
      })

      const auth: AuthResponse = await authentication.json()
      setCookie(cookieNames.userData, auth.user, cookieOptions)
      setUser(auth.user)
      router.push('/')
    } catch (error) {
      setUser(null)
    }
  }

  const resetPassword = async (
    code: string,
    password: string,
    passwordConfirmation: string
  ) => {
    try {
      const authentication = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password, passwordConfirmation, code }),
      })

      const auth: AuthResponse = await authentication.json()
      setCookie(cookieNames.userData, auth.user, cookieOptions)
      setUser(auth.user)
      router.push('/')
    } catch (error) {
      setUser(null)
    }
  }

  const signup = async (email: string, username: string, password: string) => {
    try {
      const authentication = await fetch(`${API_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, email, password }),
      })

      const signup: AuthResponse = await authentication.json()
      setCookie(cookieNames.userData, signup.user, cookieOptions)
      setUser(signup.user)
      router.push('/')
    } catch (error) {
      setUser(null)
    }
  }

  const logoutUser = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      deleteCookie(cookieNames.userData)
      setUser(null)
      router.push('/login')
    } catch (error) {}
  }

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      if (!user && hasCookie(cookieNames.userData)) {
        const userCookie = getCookie(cookieNames.userData)
        if (typeof userCookie === 'string') {
          try {
            const savedUser = JSON.parse(userCookie as string)
            if (isUser(savedUser)) {
              setUser(savedUser)
            }
          } catch (err) {
            console.error('Error parsing user from cookie: ', err)
          }
        }
      }
    }
    checkUserLoggedIn()
  }, [user])

  return (
    <AuthContext.Provider
      value={{ user, signup, loginUser, logoutUser, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
