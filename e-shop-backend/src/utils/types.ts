export type StripeAPIResponse<T = {id: number}> = {
  results: T[]
  pagination: {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }
}
