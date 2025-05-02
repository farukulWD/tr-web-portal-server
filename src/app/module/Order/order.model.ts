import mongoose, { Schema, model } from 'mongoose';
import { IOrder } from './order.interface';

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
    sp: {
      type: Number,
    },
    np:{
      type:Number
    },
    total: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const orderSchema = new Schema<IOrder>(
  {
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dealer',
      required: true,
    },
    product: [productSubSchema],
    total: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'canceled'],
      default: 'pending',
    },
    approved: {
      type: Boolean,
      default: false,
    },
    orderType: {
      type: String,
      enum: ['confirm', 'draft'],
    },
    orderCode: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook
orderSchema.pre('save', async function (next) {
  if (!this.isNew || this.orderCode) {
    // If it's not a new document or productCode is already set, skip
    return next();
  }

  let isUnique = false;
  while (!isUnique) {
    // Generate a random 6-digit number
    const code = Math.floor(100000 + Math.random() * 900000);

    // Check if the code already exists in the database
    const existingProduct = await mongoose.models.Order.findOne({
      productCode: code,
    });

    if (!existingProduct) {
      // If no existing product has this code, assign it and exit the loop
      this.orderCode = code.toString();
      isUnique = true;
    }
  }
  next();
});

export const Order = model<IOrder>('Order', orderSchema);
