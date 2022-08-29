import Link from 'next/link'
import { useRouter } from 'next/router'

import styles from '../styles/Header.module.css'

export default () => {
  const router = useRouter()
  const isHome = router.pathname === '/'

  const goBack = (event: any) => {
    event.preventDefault()
    router.back()
  }

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
    </header>
  )
}
