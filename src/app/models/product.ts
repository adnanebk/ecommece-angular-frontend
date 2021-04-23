export class Product {
  static fields = [{name: 'sku'}, {name: 'name'}, {name: 'description'}, {name: 'unitPrice', type: 'number'},
    {name: 'image', type: 'image'}, {name: 'active', type: 'bool'}, {name: 'unitsInStock', type: 'number'},
    {name: 'categoryName', type: 'select'}, {name: 'dateCreated', type: 'date', readOnly: true},
    {name: 'lastUpdated', type: 'date', readOnly: true}];
  static headers = ['sku', 'name', 'description', 'unit Price', 'image',
    'active', 'units In Stock', 'category Name', 'date Created', 'date Updated'];


  id = 0;
  sku = '';
  name = '';
  description = '';
  unitPrice = 0;
  image = '';
  active = false;
  unitsInStock = 0;
  categoryName = '';
  dateCreated = new Date();
  lastUpdated = new Date();
}
