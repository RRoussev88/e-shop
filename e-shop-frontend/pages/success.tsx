import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Order } from './api/types'
import { API_URL } from '../utils/urls'

const useOrder = (sessionId: string) => {
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (sessionId) {
      const fetchOrder = async () => {
        setIsLoading(true)
        try {
          const orderResponse = await fetch(`${API_URL}/api/orders/confirm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ checkout_session: sessionId }),
          })

          const order: Order = await orderResponse.json()
          setOrder(order)
        } catch {
          setOrder(null)
        } finally {
          setIsLoading(false)
        }
      }

      fetchOrder()
    }
  }, [sessionId])

  return { isLoading, order }
}

const Success: NextPage = () => {
  const router = useRouter()
  const { session_id } = router.query

  const { isLoading, order } = useOrder(session_id?.toString() ?? '')
  return (
    <div>
      <Head>
        <title>Thank you for your purchase</title>
        <meta name="description" content="Thank you for your purchase" />
      </Head>
      <h2>Payment is successful</h2>
      {isLoading && <p>Loading...</p>}
      {order && <p>Order confirmed, with order number: {order.id}</p>}
    </div>
  )
}

export default Success
