export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat("ru-RU").format(num);
}