export interface OrderItemInterface {
    productId: number,
    variantId: number,
    brand: string,
    title: string,
    sku: string,
    size: string,
    color: string,
    mainImageUrl: string,
    quantity: number,
    appliedPrice: number,
    subtotal: number,
    priceType: string
}