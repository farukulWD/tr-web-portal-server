import mongoose, { model, Schema } from "mongoose";
import { IProduct } from "./product.interface";

const productSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    quantity: { type: Number, default: 0 },
    group: { type: String },
    productCode: { type: String },

}, {
    timestamps: true,
})

export const Product = model<IProduct>('Product', productSchema);