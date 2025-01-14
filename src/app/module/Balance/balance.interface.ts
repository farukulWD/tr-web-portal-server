import { Document, Schema } from 'mongoose';

export interface IBalance extends Document {
  _id: string;
  dealer: Schema.Types.ObjectId;
  amount: number;
  transactionNo: string;
  receivedBank: string;
  senderBank: string;
  addedBy: Schema.Types.ObjectId;
}
