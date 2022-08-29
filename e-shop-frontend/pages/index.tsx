import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import styles from '../styles/Home.module.css'
import { toDecimals } from '../utils/format'
import { API_URL, fromImgToUrl } from '../utils/urls'
import { ApiResponse, Product } from './api/types'

type HomeProps = { products: Product[] }

const Home: NextPage<HomeProps> = ({ products }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Linda Ruseva eShop</title>
        <meta name="description" content="Creations of Art" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {products?.map((product) => (
        <div key={product.id} className={styles.product}>
          <Link href={`/products/${product.attributes.slug}`}>
            <a>
              <div className={styles.product__Row}>
                <div className={styles.product__ColImg}>
                  <img src={fromImgToUrl(product.attributes.image)} />
                </div>
                <div className={styles.product__Col}>
                  {product.attributes.name} &#8364;&nbsp;
                  {toDecimals(product.attributes.price)}
                </div>
              </div>
            </a>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default Home

export const getStaticProps = async () => {
  const productResponse = await fetch(`${API_URL}/api/products/?populate=*`)
  const products: ApiResponse<Product> = await productResponse.json()

  return { props: { products: products.data } }
}
