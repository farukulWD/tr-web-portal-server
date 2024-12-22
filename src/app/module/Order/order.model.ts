import { Schema, model } from 'mongoose';
import { IOrder } from './order.interface';

const orderSchema = new Schema<IOrder>({
    dealerCode: {
        type: String,
        required: true
    },
    product: [
        {
            productCode: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
            },
        }
    ],
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
        default: false
    },

}, {
    timestamps: true,
})


export const Order = model<IOrder>('Order', orderSchema);