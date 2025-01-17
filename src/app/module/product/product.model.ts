import mongoose, { model, Schema } from 'mongoose';
import { IProduct } from './product.interface';
const productStartCode = "4"

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    stock: { type: Number, default: 0 },
    group: { type: String },
    productCode: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook
productSchema.pre('save', async function (next) {
  if (!this.isNew || this.productCode) {
    return next();
  }

  let isUnique = false;
  while (!isUnique) {
    const code = Math.floor(10000 + Math.random() * 90000);

    const existingProduct = await mongoose.models.Product.findOne({
      productCode: code,
    });

    if (!existingProduct) {
      this.productCode = productStartCode + code.toString();
      isUnique = true;
    }
  }
  next();
});

export const Product = model<IProduct>('Product', productSchema);
