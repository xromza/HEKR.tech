import { CartItemInterface } from "./CartItemInterface"

export interface CartInterface {
    items: CartItemInterface[]
    totalPrice: number,
    discountApplied: boolean,
    canCheckout: boolean
}