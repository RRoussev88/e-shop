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
import { AuthResponse, User } from '../utils/types'

type AuthContextValue = {
  user: User | null
  editProfile: (user: User) => void
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
  editProfile: (user: User) => {},
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
  secure: process.env.NODE_ENV === 'production' && API_URL.startsWith('https'),
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 30, // 30 days
} as const

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  const executeRequest = async (promise: Promise<Response>): Promise<void> => {
    try {
      const authentication = await promise
      const auth: AuthResponse | User = await authentication.json()
      const newUser: User = isUser(auth) ? auth : auth.user
      setCookie(cookieNames.userData, newUser, cookieOptions)
      setUser(newUser)
      router.push('/')
    } catch {
      setUser(null)
    }
  }

  const editProfile = async (data: User) => {
    executeRequest(
      fetch(`${API_URL}/api/users/${user?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })
    )
  }

  const loginUser = async (email: string, password: string) => {
    console.log('NEXT_PUBLIC_API_URL: ', process.env.NEXT_PUBLIC_API_URL)
    console.log('API_URL: ', API_URL)
    executeRequest(
      fetch(`${API_URL}/api/auth/local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ identifier: email, password }),
      })
    )
  }

  const resetPassword = async (
    code: string,
    password: string,
    passwordConfirmation: string
  ) => {
    executeRequest(
      fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password, passwordConfirmation, code }),
      })
    )
  }

  const signup = async (email: string, username: string, password: string) => {
    executeRequest(
      fetch(`${API_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, email, password }),
      })
    )
  }

  const logoutUser = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      deleteCookie(cookieNames.userData)
      router.push('/login')
    } catch {
    } finally {
      setUser(null)
    }
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
      value={{
        user,
        editProfile,
        signup,
        loginUser,
        logoutUser,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
