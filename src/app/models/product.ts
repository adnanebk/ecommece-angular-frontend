export class Product {
  static fields = [{name: 'sku'} , {name: 'name'}, {name: 'description'}, {name: 'unitPrice', type : 'number'},
    {name: 'imageUrl', type : 'image'}, {name: 'active', type : 'bool'}, {name: 'unitsInStock', type : 'number'},
    {name: 'categoryName', type: 'select'}, {name: 'dateCreated', type : 'date'}, {name: 'dateUpdated', type : 'date'}];
  static headers = ['sku' , 'name', 'description', 'unit Price', 'image',
    'active', 'units In Stock', 'category Name', 'date Created', 'date Updated'];


  id = 0;
  sku = '';
  name = '';
  description = '';
  unitPrice = 0;
  imageUrl = '';
  active = false;
  unitsInStock = 0;
  categoryName = 0;
  dateCreated = new Date();
  dateUpdated = new Date();
}
