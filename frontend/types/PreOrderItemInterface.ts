import { PreOrderPriceInterface } from "./PreOrderPriceInterface";
import { PreOrderWarehouseAvailabilityInterface } from "./PreOrderWarehouseAvailabilityInterface";

export interface PreOrderItemInterface {
    productId: number,
    variantId: number,
    brand: string,
    title: string,
    sku: string,
    size: string,
    color: string,
    mainImageUrl: string,
    quantity: number,
    maxAvailableQuantity: number,
    isAvailable: boolean,
    price: PreOrderPriceInterface,
    subtotal: number,
    availableAtWarehouses: PreOrderWarehouseAvailabilityInterface[]

}