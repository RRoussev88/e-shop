import { Image } from './types'

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:1337'

export const STRIPE_PK =
  process.env.NEXT_PUBLIC_STRPIE_PK ||
  'pk_test_51LkaR2AyYVbxEXUDafkM3yVN97OfalnouD4pkSLdOJ6PD8v8n38hNB8bk5xEYQ02Wjei1BU2Z5XSFoGjg2oxtPH500zAXP5U3H'

export const cookieNames = {
  userData: 'eShopUserData',
  userSession: 'eShopUserSession',
}

export const fromImgToUrl = (image?: Image) => {
  if (!image) {
    return '/vercel.svg'
  }
  if (image.data.attributes.url.startsWith('/')) {
    return `${API_URL}${image.data.attributes.url}`
  }
  return image.data.attributes.url
}
