export interface ProductPage {
    categoryId?: number;
    searchValue?: string;
    pageNum? : number;
    pageSize? : number;
    totalSize? : number;
    sort? : string;
    direction?: string;
}
