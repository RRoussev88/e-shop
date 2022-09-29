import { NextPage } from 'next'
import Head from 'next/head'
import { FormEvent, FormEventHandler, useState } from 'react'
import styles from '../styles/Auth.module.css'
import { API_URL } from '../utils/urls'

const ForgotPassword: NextPage = () => {
  const [email, setEmail] = useState<string>('')
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    if (email) {
      setIsSubmitted(false)
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      await response.json()
      setIsSubmitted(true)
    } else {
      setIsSubmitted(true)
    }
  }

  return (
    <div>
      <Head>
        <title>Forgot Password</title>
        <meta
          name="description"
          content="Send a reset link to your registered email"
        />
      </Head>
      <h2>Forgot Password</h2>
      <p>Send a reset link to your registered email</p>
      <form onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email Address"
        />
        {isSubmitted &&
          (!email ? (
            <p className={`${styles.message} ${styles.warning}`}>
              Please enter a valid email
            </p>
          ) : (
            <p className={`${styles.message} ${styles.success}`}>
              Please check your email for a reset link
            </p>
          ))}
        <button type="submit" className={styles.button}>
          {isSubmitted ? 'Resend' : 'Send'} Link
        </button>
      </form>
    </div>
  )
}

export default ForgotPassword
