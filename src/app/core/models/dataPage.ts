export interface DataPage {
    search?: string;
    number : number;
    size : number;
    totalSize? : number;
    sortProperty? : string;
    sortDirection?: 'ASC' | 'DESC';
}
