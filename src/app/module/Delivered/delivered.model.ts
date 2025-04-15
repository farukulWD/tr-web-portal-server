import { time } from 'console';
import mongoose, { Schema } from 'mongoose';
import { IDeliveredDoc, IDeliveredProductDoc } from './delivered.interface';

const deliveredProductSubSchema = new Schema<IDeliveredProductDoc>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    orderCode: {
      type: String,
      required: true,
    },
    doDate: {
      type: Date,
      required: true,
    },
    productCode: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const deliveredSchema = new Schema<IDeliveredDoc>(
  {
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dealer',
      required: true,
    },
    dealerCode: {
      type: Number,
      required: true,
    },
    totalDeliveredAmount: {
      type: Number,
      default: 0,
    },
    products: [deliveredProductSubSchema],
  },
  {
    timestamps: true,
  }
);

export const DeliveredProducts = mongoose.model<IDeliveredDoc>('DeliveredProduct', deliveredSchema);
