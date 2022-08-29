import { Image } from '../pages/api/types'

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'

export const fromImgToUrl = (image?: Image) => {
  if (!image) {
    return '/vercel.svg'
  }
  if (image.data.attributes.url.startsWith('/')) {
    return `${API_URL}${image.data.attributes.url}`
  }
  return image.data.attributes.url
}
