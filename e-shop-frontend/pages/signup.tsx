import { NextPage } from 'next'
import Head from 'next/head'
import { FormEvent, FormEventHandler, useContext, useState } from 'react'
import AuthContext from '../context/AuthContext'

const Signup: NextPage = () => {
  const [email, setEmail] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPass, setConfirmPass] = useState<string>('')
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const { signup } = useContext(AuthContext)

  const handleSubmit: FormEventHandler<HTMLFormElement> = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    if (email && username && password && password === confirmPass) {
      setIsSubmitted(false)
      signup(email, username, password)
    } else {
      setIsSubmitted(true)
    }
  }

  return (
    <div>
      <Head>
        <title>Signup</title>
        <meta name="description" content="Signup here to create an account" />
      </Head>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          autoFocus
          className="input"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="User Name"
        />
        <input
          className="input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email Address"
        />
        <input
          className="input"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
        />
        <input
          className="input"
          type="password"
          value={confirmPass}
          onChange={(event) => setConfirmPass(event.target.value)}
          placeholder="Confirm Password"
        />
        {isSubmitted && (
          <p className="message warning">
            Password and Confirm password doesn&apos;t match
          </p>
        )}
        <button type="submit" className="button">
          Signup
        </button>
      </form>
    </div>
  )
}

export default Signup
