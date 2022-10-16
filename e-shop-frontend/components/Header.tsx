import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import styles from '../styles/Header.module.css'

const Header: FC = () => {
  const router = useRouter()
  const isHome = router.pathname === '/'
  const isLogin = router.pathname === '/login'
  const isSignup = router.pathname === '/signup'

  const goBack = (event: any) => {
    event.preventDefault()
    router.back()
  }

  const { user } = useContext(AuthContext)

  return (
    <header className={styles.nav}>
      {!isHome && (
        <div className={styles.back}>
          <Link href="">
            <a onClick={goBack}>&lt;&nbsp;Back</a>
          </Link>
        </div>
      )}
      <div className={styles.title}>
        <Link href="/">
          <a>
            <h1>The eShop</h1>
          </a>
        </Link>
      </div>
      <div className={styles.auth}>
        {user ? (
          <Link href="/account">
            <a>
              <Image
                src="/vercel.svg"
                width={25}
                height={25}
                alt={user.email}
              />
            </a>
          </Link>
        ) : (
          <>
            {!isLogin && (
              <Link href="/login">
                <a>Login</a>
              </Link>
            )}
            {!isSignup && (
              <Link href="/signup">
                <a>Signup</a>
              </Link>
            )}
          </>
        )}
      </div>
    </header>
  )
}

export default Header
