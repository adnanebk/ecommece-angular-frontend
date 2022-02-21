import {ProductCategory} from './product-category';
import {Field} from '../Shared/editable-table/editable-table.component';

export class Product {
  static fields: Field[] = [{name: 'sku'}, {name: 'name'}, {name: 'description', type: 'textArea'}, {name: 'unitPrice', type: 'decimal'},
    {name: 'image', type: 'image'}, {name: 'active', type: 'bool'}, {name: 'unitsInStock', type: 'number'},
    {name: 'category', type: 'select'}, {name: 'dateCreated', type: 'date', readOnly: true},
    {name: 'lastUpdated', type: 'date', readOnly: true}];
  static headers = ['sku', 'name', 'description', 'Price', 'image',
    'active', 'Quantity', 'category', 'date Created', 'date Updated'];


  id = 0;
  sku = '';
  name = '';
  description = '';
  unitPrice = 0;
  image = '';
  active = false;
  unitsInStock = 0;
  category = new ProductCategory();
  dateCreated = new Date();
  lastUpdated = new Date();
}
