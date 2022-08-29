export const toDecimals = (num: number | string) =>
  parseFloat(num.toString()).toFixed(2)
