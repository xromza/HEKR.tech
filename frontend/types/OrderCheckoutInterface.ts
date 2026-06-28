import { OrderItemRequest } from "./OrderItemRequest";

export interface OrderShippingInterface {
    items: OrderItemRequest[],
    warehouseId: number,
    address: string,
    payment: string,
    comment?: string | null
}