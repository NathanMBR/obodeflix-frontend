import { GenericObject } from "./GenericObject";

export interface Pagination<T extends GenericObject> {
    readonly quantityPerPage: number
    readonly totalQuantity: number
    readonly currentPage: number
    readonly lastPage: number
    readonly data: Array<T>
}

export class Pagination<T extends GenericObject> implements Pagination<T> {
    constructor(
        public readonly quantityPerPage: number,
        public readonly totalQuantity: number,
        public readonly currentPage: number,
        public readonly lastPage: number,
        public readonly data: Array<T>
    ) { }
}