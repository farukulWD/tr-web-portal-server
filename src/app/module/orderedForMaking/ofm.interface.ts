import { Document, Types } from 'mongoose';

export interface IOrderedProduct {
  productId: Types.ObjectId;
  quantity: number;
}

export interface IOrderedForMaking extends Document {
  orderId: string;
  deliveredPartnerId: Types.ObjectId; // company ref
  products: IOrderedProduct[];
  status: 'pending' | 'in-progress' | 'completed';
  deliveryDate: Date;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
