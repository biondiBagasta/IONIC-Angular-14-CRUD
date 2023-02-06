import { Supplier } from './supplier';
import { Product } from './product';
export interface Restock {
  id: number;
  restock_date: Date;
  product_id: number;
  product: Product;
  supplier_id: number;
  supplier: Supplier;
  stock: number;
  amount: number;
  users: string;
}
