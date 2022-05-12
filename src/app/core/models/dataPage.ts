export interface DataPage {
    searchValue?: string;
    page : number;
    pageSize : number;
    totalSize? : number;
    sort? : string;
    direction?: string;
}
