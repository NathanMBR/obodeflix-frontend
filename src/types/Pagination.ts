export interface Pagination<T extends Record<string, any>> {
    quantityPerPage: number
    totalQuantity: number
    currentPage: number
    lastPage: number
    data: Array<T>
}