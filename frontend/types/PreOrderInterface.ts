import { PreOrderItemInterface } from "./PreOrderItemInterface";
import { PreOrderWarehouseInterface } from "./PreOrderWarehouseInterface";

export interface PreOrderInterface {
    totalPrice: number,
    items: PreOrderItemInterface[],
    warehouses: PreOrderWarehouseInterface[]
}