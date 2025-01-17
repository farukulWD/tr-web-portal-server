export interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  stock: number;
  group: string;
  productCode?: string;
  isDeleted: boolean;
}
