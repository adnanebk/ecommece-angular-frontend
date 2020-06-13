import {Product} from './product';
import {CartItem} from './cart-item';

export class Order {
  id = 0;
  firstName: string;
  lastName: string;
  dateCreated: string;
  email: string;
  country: number;
  city: string;
  street: boolean;
  quantity = 1;
  totalPrice = 0;
  orderItems: CartItem[];
}
