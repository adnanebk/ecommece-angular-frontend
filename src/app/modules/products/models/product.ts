import {Category} from "../../../core/models/category";

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  unitPrice: number;
  image: string;
  active: boolean;
  unitsInStock: number;
  category: Category;
  dateCreated: Date;
  lastUpdated: Date;
  imageFile?: any;
}


