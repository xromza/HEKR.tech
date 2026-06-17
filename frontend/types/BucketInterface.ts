import { BucketCardInterface } from "./BucketCardInterface";

export interface BucketInterface{
    items: BucketCardInterface[],
    totalSum:number,
    sales:boolean,
    isReadyForOrder: boolean;
}