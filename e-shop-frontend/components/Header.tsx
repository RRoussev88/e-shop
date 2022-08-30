import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import styles from '../styles/Header.module.css'

const Header: FC = () => {
  const router = useRouter()
  const isHome = router.pathname === '/'

  const goBack = (event: any) => {
    event.preventDefault()
    router.back()
  }

  const { user } = useContext(AuthContext)

  return (
    <header className={styles.nav}>
      {!isHome && (
        <div className={styles.back}>
          <a href="#" onClick={goBack}>
            &lt;&nbsp;Back
          </a>
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
          <Link href="/login">
            <a>Login</a>
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header
