import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { FormEvent, FormEventHandler, useContext, useState } from 'react'
import AuthContext from '../context/AuthContext'
import styles from '../styles/Auth.module.css'

const Login: NextPage = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const { loginUser } = useContext(AuthContext)

  const handleSubmit: FormEventHandler<HTMLFormElement> = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    loginUser(email, password)
  }

  return (
    <div>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login here to make your purchase" />
      </Head>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email Address"
        />
        <input
          className={styles.input}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
        />
        <Link href="/forgot-password">
          <a className={styles.link__Password}>Forgot password</a>
        </Link>
        <button type="submit" className={styles.button}>
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
