import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/router'
import { Magic } from 'magic-sdk'
import { MAGIC_PUBLIC_KEY } from '../utils/urls'

type AuthContextValue = {
  user: { email: string } | null
  loginUser: (email: string) => Promise<void>
  logoutUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loginUser: async (email: string) => {},
  logoutUser: async () => {},
})

let magic: Magic

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const router = useRouter()

  const loginUser = async (email: string) => {
    try {
      await magic.auth.loginWithMagicLink({ email })
      setUser({ email })
      router.push('/')
    } catch (error) {
      setUser(null)
    }
  }

  const logoutUser = async () => {
    try {
      await magic.user.logout()
      setUser(null)
      router.push('/')
    } catch (error) {}
  }

  const checkUserLoggedIn = async () => {
    try {
      const isLoggedIn = await magic.user.isLoggedIn()
      if (isLoggedIn) {
        const { email } = await magic.user.getMetadata()
        email && setUser({ email })
      }
    } catch {}
  }

  useEffect(() => {
    magic = new Magic(MAGIC_PUBLIC_KEY)
    checkUserLoggedIn()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
