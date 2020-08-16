import { Customer } from './customer';
import { Product } from './product';

export interface Order {
  id?: Number;
  customer?: Customer;
  products?: Map<Product, Number>;
  totalPrice?: Number;
  paid?: Boolean;
}
