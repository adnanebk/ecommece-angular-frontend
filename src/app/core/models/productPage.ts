export interface ProductPage {
    categoryId?: number;
    searchValue?: string;
    page : number;
    pageSize : number;
    totalSize? : number;
    sort? : string;
    direction?: string;
}
