import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import styles from '../styles/Home.module.css'
import { toDecimals } from '../utils/format'
import { API_URL, fromImgToUrl } from '../utils/urls'
import { ApiResponse, Product } from './api/types'

type HomeProps = { products: Product[] }

const Home: NextPage<HomeProps> = ({ products }) => (
  <div className={styles.container}>
    <Head>
      <title>Linda Kunz eShop</title>
      <meta name="description" content="Creations of Art" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    {products?.map((product) => (
      <div key={product.id} className={styles.product}>
        <Link href={`/products/${product.attributes.slug}`}>
          <a>
            <div className={styles.product__Row}>
              <div className={styles.product__ColImg}>
                <Image
                  src={fromImgToUrl(product.attributes.image)}
                  alt={product.attributes.meta_title}
                  width={50}
                  height={50}
                />
              </div>
              <div className={styles.product__Col}>
                <span>{product.attributes.name}</span>
                <span>&euro;&nbsp;{toDecimals(product.attributes.price)}</span>
              </div>
            </div>
          </a>
        </Link>
      </div>
    ))}
  </div>
)

export default Home

export const getStaticProps = async () => {
  const productResponse = await fetch(`${API_URL}/api/products/?populate=*`, {
    credentials: 'include',
  })
  const products: ApiResponse<Product[]> = await productResponse.json()

  return { props: { products: products.data } }
}
