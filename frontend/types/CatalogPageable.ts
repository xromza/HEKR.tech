import { ItemCardInterface } from "./ItemCardInterface";

export interface CatalogPageable {
    content: ItemCardInterface[],
    empty: boolean,
    first: boolean,
    last: boolean,
    number: number,
    numberOfElements: number,
    size: number,
    totalElements: number,
    totalPages: number
}