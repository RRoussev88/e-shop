import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { FormEvent, FormEventHandler, useContext, useState } from 'react'
import AuthContext from '../context/AuthContext'

const EditProfile: NextPage = () => {
  const [username, setUsername] = useState<string>('')
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const { user, editProfile } = useContext(AuthContext)

  const handleSubmit: FormEventHandler<HTMLFormElement> = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    if (user && username && username !== user?.username) {
      setIsSubmitted(false)
      editProfile({ ...user, username })
    } else {
      setIsSubmitted(true)
    }
  }

  if (user) {
    return (
      <div>
        <Head>
          <title>Edit Profile</title>
          <meta name="description" content="Edit your account information" />
        </Head>
        <h2>Edit Profile</h2>
        <p>Logged in as: {user.username}</p>
        <p>With email: {user.email}</p>
        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            className="input"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="New user name"
          />
          {isSubmitted && (
            <p className="message warning">
              Enter different account information than the current user&apos;s
              one
            </p>
          )}
          <button type="submit" className="button">
            Edit
          </button>
        </form>
      </div>
    )
  }
  return (
    <div>
      <p>Please login or register</p>
      <Link href="/">
        <a>Go Back</a>
      </Link>
    </div>
  )
}

export default EditProfile
