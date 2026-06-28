export interface ItemCardInterface {
    id: number,
    brand: string,
    title: string,
    categoryId: number,
    categoryName: string,
    mainVariantId: number,
    isActive: boolean,
    priceWholesale: number,
    priceRetail: number,
    mainImageUrl: string,
    wholesaleThreshold: number
}