import mongoose, { model, mongo, Schema } from 'mongoose';
import { IOrderedForMaking } from './ofm.interface';

const orderedForMaking = new Schema<IOrderedForMaking>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    deliveredPartnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'company',
      required: true,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    deliveryDate: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { timestamps: true }
);

const OrderedForMaking = model<IOrderedForMaking>('OrderedForMaking', orderedForMaking);
export default OrderedForMaking;
