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

const undeliveredProductSubSchema = new Schema<any>(
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
const undeliveredSchema = new Schema(
  {
    dealer: {
      type: mongoose.Schema.Types.String,
      ref: 'Dealer',
      required: true,
    },
    totalUndeliveredAmount: {
      type: Number,
      default: 0,
    },

    products: [undeliveredProductSubSchema],
  },
  {
    timestamps: true,
  }
);

export const UndeliveredProducts = model(
  'undeliveredProduct',
  undeliveredSchema
);
export const Do = model<IDo>('do', doSchema);
