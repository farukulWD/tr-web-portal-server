import { Schema } from 'mongoose';

export interface IProduct {
  product: Schema.Types.ObjectId;
  price: number;
  quantity: number;
}
export interface IDo extends Document {
  _id?: string;
  orderCode: string;
  dealer: string;
  product: IProduct[];
  total: number;
  status: string;
  approved?: boolean;
}
