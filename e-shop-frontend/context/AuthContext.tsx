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
import { LoginResponse, LoginPayload, User } from '../pages/api/types'

type AuthContextValue = {
  user: User | null
  loginUser: (email: string, password: string) => Promise<void>
  logoutUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loginUser: async (email: string, password: string) => {},
  logoutUser: async () => {},
})

const cookieOptions = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 14, // 14 days
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

      const auth: LoginResponse = await authentication.json()
      setCookie(cookieNames.userData, auth.user, cookieOptions)
      setUser(auth.user)
      router.push('/')
    } catch (error) {
      setUser(null)
    }
  }

  const logoutUser = async () => {
    try {
      deleteCookie(cookieNames.userData)
      setUser(null)
      router.push('/')
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
            console.error('Error parsing: ', err)
          }
        }
      }
    }
    checkUserLoggedIn()
  }, [user])

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
