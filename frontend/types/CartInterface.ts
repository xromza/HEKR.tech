import { CartItemInterface } from "./CartItemInterface"

export interface CartInterface {
    items: CartItemInterface[]
    total_price: number,
    discount_applied: boolean,
    can_checkout: boolean
}