export interface ApiError {
    code?: string;
    message: string;
    errors?:FieldError[];
}
export  interface  FieldError{
    fieldName: string;
    message:string
}
