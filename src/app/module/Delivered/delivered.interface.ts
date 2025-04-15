import { Types } from 'mongoose';

// Type for a single delivered product
export interface IDeliveredProduct {
  product: Types.ObjectId | string; 
  quantity: number;
  price: number;
  total: number;
  orderCode: string;
  doDate: Date;
  productCode: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Type for the delivered document
export interface IDelivered {
  dealer: Types.ObjectId | string;
  dealerCode: number;
  totalDeliveredAmount: number;
  products: IDeliveredProduct[];
  createdAt?: Date;
  updatedAt?: Date;
}


import { Document } from 'mongoose';

export interface IDeliveredProductDoc extends IDeliveredProduct, Document {}
export interface IDeliveredDoc extends IDelivered, Document {}
