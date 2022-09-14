export type Meta = {
  pagination: {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }
}

export type ApiResponse<T = object> = { data: T[]; meta: Meta }

export type Product = {
  id: number
  attributes: {
    name: string
    content: string
    meta_description: string
    meta_title: string
    price: number
    slug: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    image: Image
  }
}

export type Image = {
  data: {
    id: number
    attributes: {
      name: string
      alternativeText: string
      caption: string
      width: number
      height: number
      formats: Formats
      hash: string
      ext: string
      mime: string
      size: number
      url: string
      previewUrl?: any
      provider: string
      provider_metadata?: any
      createdAt: string
      updatedAt: string
    }
  }
}

type Formats = {
  large?: Format
  small: Format
  medium?: Format
  thumbnail: Format
}
type Format = {
  ext: string
  url: string
  hash: string
  mime: string
  name: string
  path?: any
  size: number
  width: number
  height: number
}

export type LoginPayload = {
  identifier: string
  password: string
}

export type User = {
  id: number
  blocked: boolean
  confirmed: boolean
  createdAt: string
  email: string
  provider: string
  updatedAt: string
  username: string
}

export type LoginResponse = {
  jwt: string
  user: User
}
