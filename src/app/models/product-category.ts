import {Field} from '../Shared/editable-table/editable-table.component';

export class ProductCategory {

  static fields: Field[] = [{name: 'name'}];
  static headers = ['category Name'];

  id = 0;
  name = '';


}
