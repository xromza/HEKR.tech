import { OrderItemInterface } from "./OrderItemInterface";
import { StatusHistoryInterface } from "./StatusHistoryInterface";

export interface VerboseOrderInterface {
        id: number,
        userId: number,
        warehouseId: number,
        totalPrice: number,
        address: string,
        paymentMethod: string,
        status: string,
        date: string,
        comment: string,
        items: OrderItemInterface[],
        statusHistory: StatusHistoryInterface[]
}