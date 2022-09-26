import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import { toDecimals } from '../../utils/format'
import { fromImgToUrl, API_URL } from '../../utils/urls'
import { ApiResponse, Product } from '../api/types'
import BuyButton from '../../components/BuyButton'

type ProductDetailsProps = { product: Product }

const ProductDetails: NextPage<ProductDetailsProps> = ({ product }) => (
  <div>
    <Head>
      {product.attributes.meta_title && (
        <title>{product.attributes.meta_title}</title>
      )}
      {product.attributes.meta_description && (
        <meta
          name="description"
          content={product.attributes.meta_description}
        />
      )}
    </Head>
    <h3>{product.attributes.name}</h3>
    <Image
      src={fromImgToUrl(product.attributes.image)}
      alt={product.attributes.meta_title}
      width={250}
      height={250}
    />
    <h3>{product.attributes.name}</h3>
    <p>
      &#8364;&nbsp;{toDecimals(product.attributes.price)}&nbsp;
      <BuyButton product={product} />
    </p>
    <p>{product.attributes.content}</p>
  </div>
)

export default ProductDetails

export const getStaticProps: GetStaticProps<
  { product: Product },
  { slug: string }
> = async ({ params }) => {
  const productResponse = await fetch(
    `${API_URL}/api/products/?populate=*&filters[slug][$eq]=${params?.slug}`
  )
  const product = await productResponse.json()

  return { props: { product: product.data[0] } }
}

export const getStaticPaths = async () => {
  const productsResponse = await fetch(`${API_URL}/api/products/`)
  const products: ApiResponse<Product> = await productsResponse.json()

  return {
    paths: products.data.map((product: Product) => ({
      params: { slug: String(product.attributes.slug) },
    })),
    fallback: false,
  }
}
