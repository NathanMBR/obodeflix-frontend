import { GenericObject } from "./GenericObject";

export interface Pagination<T extends GenericObject> {
    readonly quantityPerPage: number
    readonly totalQuantity: number
    readonly currentPage: number
    readonly lastPage: number
    readonly data: Array<T>
}

export class PaginationBuilder<T extends GenericObject> implements Pagination<T> {
    public readonly quantityPerPage: Pagination<T>["quantityPerPage"];
    public readonly totalQuantity: Pagination<T>["totalQuantity"];
    public readonly currentPage: Pagination<T>["currentPage"];
    public readonly lastPage: Pagination<T>["lastPage"];
    public readonly data: Pagination<T>["data"];

    constructor(
        private readonly paginationData: Pagination<T>
    ) {
        this.quantityPerPage = paginationData.quantityPerPage;
        this.totalQuantity = paginationData.totalQuantity;
        this.currentPage = paginationData.currentPage;
        this.lastPage = paginationData.lastPage;
        this.data = paginationData.data;
    }
}