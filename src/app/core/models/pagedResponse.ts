export interface PagedResponse {
  _embedded: any;
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  };
}
