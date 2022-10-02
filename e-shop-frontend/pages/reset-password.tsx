import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FormEvent, FormEventHandler, useContext,useState } from 'react'
import AuthContext from '../context/AuthContext'

const ResetPassword: NextPage = () => {
  const [password, setPassword] = useState<string>('')
  const [passwordConfirmation, setConfirmPass] = useState<string>('')
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const { resetPassword } = useContext(AuthContext)

  const router = useRouter()
  const { code } = router.query

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    if (code && password && password === passwordConfirmation) {
      setIsSubmitted(false)
      resetPassword(code.toString(), password, passwordConfirmation)
    } else {
      setIsSubmitted(true)
    }
  }

  return (
    <div>
      <Head>
        <title>Reset Password</title>
        <meta name="description" content="Enter your new password" />
      </Head>
      <h2>Reset Password</h2>
      <p>Enter your new password</p>
      <form onSubmit={handleSubmit}>
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
          value={passwordConfirmation}
          onChange={(event) => setConfirmPass(event.target.value)}
          placeholder="Confirm Password"
        />
        {isSubmitted && (
          <p className="message warning">
            Password and Confirm password doesn&apos;t match
          </p>
        )}
        <button type="submit" className="button">
          Reset Password
        </button>
      </form>
    </div>
  )
}

export default ResetPassword
