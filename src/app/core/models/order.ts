import {CartItem} from './cart-item';
import {CreditCard} from './CreditCard';

export interface Order{
  id: number;
  fullName: string;
  dateCreated: string;
  country: number;
  city: string;
  street: boolean;
  quantity: number;
  totalPrice: number;
  orderItems: CartItem[];
  creditCard: CreditCard;
}


