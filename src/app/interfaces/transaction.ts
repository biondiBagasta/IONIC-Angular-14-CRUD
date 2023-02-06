import { Product } from './product';
export interface Transaction {
  id: number;
  transaction_date: Date;
  product_id: number;
  product: Product;
  amount: number;
  revenue: number;
  users: string;
}
