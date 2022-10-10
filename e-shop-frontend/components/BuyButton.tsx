import { FC, useContext } from 'react'
import { useRouter } from 'next/router'
import { loadStripe } from '@stripe/stripe-js'
import styles from '../styles/BuyButton.module.css'
import AuthContext from '../context/AuthContext'
import { API_URL, STRIPE_PK } from '../utils/urls'
import { Product } from '../utils/types'

const stripePromise = loadStripe(STRIPE_PK)

const BuyButton: FC<{ product: Product }> = ({ product }) => {
  const { user } = useContext(AuthContext)
  const router = useRouter()

  const redirectToLogin = () => {
    router.push('/login')
  }

  const handleBuy = async () => {
    const stripe = await stripePromise
    const response = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ product }),
    })
    const session = await response.json()
    await stripe?.redirectToCheckout({ sessionId: session.id })
  }

  return (
    <>
      {user ? (
        <button className={styles.buy} onClick={handleBuy}>
          Buy
        </button>
      ) : (
        <button className={styles.buy} onClick={redirectToLogin}>
          Login to Buy
        </button>
      )}
    </>
  )
}

export default BuyButton
