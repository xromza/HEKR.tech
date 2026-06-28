import { OrderItemInterface } from "./OrderItemInterface";

export interface OrderInterface {
    id: number,
    userId: number,
    warehouseId: number,
    totalPrice: number,
    address: string,
    paymentMethod: string,
    status: string,
    date: string,
    items: OrderItemInterface[]
}