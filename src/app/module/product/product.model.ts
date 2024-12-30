import mongoose, { model, Schema } from "mongoose";
import { IProduct } from "./product.interface";

const productSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    stock: { type: Number, default: 0 },
    group: { type: String },
    productCode: { type: String },
    isDeleted: { type: Boolean, default: false },

}, {
    timestamps: true,
})

// Pre-save hook
productSchema.pre('save', async function (next) {
    if (!this.isNew || this.productCode) {
        // If it's not a new document or productCode is already set, skip
        return next();
    }

    let isUnique = false;
    while (!isUnique) {
        // Generate a random 6-digit number
        const code = Math.floor(100000 + Math.random() * 900000);

        // Check if the code already exists in the database
        const existingProduct = await mongoose.models.Product.findOne({ productCode: code });

        if (!existingProduct) {
            // If no existing product has this code, assign it and exit the loop
            this.productCode = code.toString();
            isUnique = true;
        }
    }
    next();
});

export const Product = model<IProduct>('Product', productSchema);