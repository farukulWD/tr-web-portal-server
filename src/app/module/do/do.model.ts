import mongoose, { model, Schema } from 'mongoose';
import { IDo, IProduct } from './do,interface';

const productSubSchema = new Schema(
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
    },
  },
  {
    timestamps: true,
  }
);

const doSchema = new Schema<IDo>(
  {
    dealer: {
      type: mongoose.Schema.Types.String,
      ref: 'Dealer',
      required: true,
    },
    product: [productSubSchema],
    total: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'canceled'],
      default: 'pending',
    },
    approved: {
      type: Boolean,
      default: false,
    },

    orderCode: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);

export const Do = model<IDo>('do', doSchema);
