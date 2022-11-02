export interface Pagination<T extends Record<string, any>> {
    readonly quantityPerPage: number
    readonly totalQuantity: number
    readonly currentPage: number
    readonly lastPage: number
    readonly data: Array<T>
}