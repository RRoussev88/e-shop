import { User } from './types'

export const toDecimals = (num: number | string) =>
  parseFloat(num.toString()).toFixed(2)

export const isUser = (data: any): data is User =>
  data?.id && data?.email && data?.username
