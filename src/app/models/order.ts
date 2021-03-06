import {CartItem} from './cart-item';
import {CreditCard} from './CreditCard';

export class Order {
  id = 0;
  fullName: string;
  dateCreated: string;
  country: number;
  city: string;
  street: boolean;
  quantity = 1;
  totalPrice = 0;
  orderItems: CartItem[];
  creditCard: CreditCard;
}
