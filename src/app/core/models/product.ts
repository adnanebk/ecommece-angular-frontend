import {Category} from "./category";

export interface Product {
    id: number;
    sku: string;
    name: string;
    description: string;
    unitPrice: number;
    images: string[];
    active: boolean;
    unitsInStock: number;
    category: Category;
    dateCreated: Date;
    lastUpdated: Date;
    imageFile?: File[];
}


