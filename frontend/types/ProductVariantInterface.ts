import { ImagesInterface } from "./ImagesInterface";
import { StockInterface } from "./StockInterface";

export interface ProductVariantInterface {
    id: number,
    productId: number,
    sku: string,
    size: string,
    color: string,
    weight: number,
    stock: StockInterface[],
    isActive: boolean,
    images: ImagesInterface[]
}