import { Document, Types } from 'mongoose';

export interface Address {
  address?: string;
  city?: string;
  thana?: string;
  postal?: number | string; 
  country?: 'Bangladesh';
}

export interface ICompany extends Document {
  name: string;
  address: Address;
  phone: string;
  email: string;
  website: string;
  deliveredAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  userId: Types.ObjectId; 
  createdBy: Types.ObjectId;
  tradeLicensePic: string;
}
