import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const Account: NextPage = () => {
  const { user, logoutUser } = useContext(AuthContext)

  if (user) {
    return (
      <div>
        <Head>
          <title>Account Page</title>
          <meta
            name="description"
            content="The account page, view your orders"
          />
        </Head>
        <h2>Account Page</h2>
        <p>Logged in as: {user.email}</p>
        <a href="#" onClick={logoutUser}>
          Logout
        </a>
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

export default Account
