import { ProductVariantInterface } from "./ProductVariantInterface";

export interface ProductInterface {
    id: number,
    brand: string,
    title: string,
    description: string,
    categoryId: number,
    categoryName: string,
    isActive: boolean,
    priceWholesale: number,
    priceRetail: number,
    wholesaleThreshold: number,
    variants: ProductVariantInterface[],
    mainImageUrl: string
}