import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'

import { toDecimals } from '../../utils/format'
import { fromImgToUrl, API_URL } from '../../utils/urls'
import { ApiResponse, Order, User } from '../api/types'
import AuthContext from '../../context/AuthContext'

const useOrders = (user: User | null) => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          setIsLoading(true)
          const ordersResponse = await fetch(
            `${API_URL}/api/orders/?populate=*`,
            { credentials: 'include' }
          )
          const orders: ApiResponse<Order> = await ordersResponse.json()
          setOrders(orders.data)
        } catch {
          setOrders([])
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchOrders()
  }, [user])

  return { isLoading, orders }
}

const Orders: NextPage = () => {
  const { user } = useContext(AuthContext)
  const { isLoading, orders } = useOrders(user)

  return (
    <div>
      <Head>
        <title>User Orders</title>
        <meta name="description" content="User orders history" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h3>Orders History</h3>
      {isLoading && <p>Loading Orders ...</p>}
      {orders.length ? (
        orders.map((order) => (
          <div key={order.id}>
            <Link
              href={`/products/${order.attributes.product.data.attributes.slug}`}
            >
              <a>
                <span>
                  {new Date(order.attributes.createdAt).toLocaleDateString(
                    'en-EN'
                  )}
                </span>
                <span>{order.attributes.product.data.attributes.name}</span>
                <span>&euro;&nbsp;{toDecimals(order.attributes.total)}</span>
                <span>{order.attributes.status}</span>
              </a>
            </Link>
          </div>
        ))
      ) : (
        <p>No orders</p>
      )}
    </div>
  )
}

export default Orders
