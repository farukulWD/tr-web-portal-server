import AppError from '../../errors/AppError';
import { Dealer } from '../dealer/dealer.model';
import { UndeliveredProducts } from '../do/do.model';
import { IDelivered, IDeliveredProduct } from './delivered.interface';
import { DeliveredProducts } from './delivered.model';
import httpStatus from 'http-status';

const deliveredDo = async (undeliveredId: string, deliveredData: IDelivered) => {
  if (!undeliveredId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Undelivered ID is required');
  }

  // Find the undelivered record and populate the product details
  const undelivered = await UndeliveredProducts.findById(undeliveredId).populate('products.product');
  if (!undelivered) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Undelivered record not found');
  }

  if (undelivered.status === 'delivered') {
    throw new AppError(httpStatus.BAD_REQUEST, 'This has already been delivered');
  }

  // Find the associated dealer
  const dealer = await Dealer.findById(undelivered.dealer);
  if (!dealer) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Dealer not found');
  }

  // Prepare new delivered products array
  const newProducts: IDeliveredProduct[] = undelivered.products.map((p: any) => {
    return {
      price: p.price,
      quantity: p.quantity,
      product: p?.product,
      total: p.price * p.quantity,
      orderCode: p.orderCode,
      doDate: p.doDate,
      productCode: p.product?.productCode,
    };
  });

  // Calculate total amount for delivered products
  const newTotalAmount = deliveredData?.products?.reduce((acc, curr) => acc + curr.total, 0) || 0;

  // Update each product in the undelivered document
  const updatedProducts = undelivered.products.map((product: any) => {
    const deliveredProduct = deliveredData?.products?.find(
      (delivered: any) => delivered.product.toString() === product.product._id.toString()
    );

    if (deliveredProduct) {
      const updatedQty = product.quantity - deliveredProduct.quantity;
      const updatedTotal = product.total - deliveredProduct.total;

      return {
        ...product.toObject(), // ensure plain object
        quantity: updatedQty >= 0 ? updatedQty : 0,
        total: updatedTotal >= 0 ? updatedTotal : 0,
      };
    }

    return product.toObject();
  });

  // Create new DeliveredProducts record
  const newDelivered = await DeliveredProducts.create(deliveredData);

  // Update the UndeliveredProducts record directly
  console.log(updatedProducts);
  (undelivered.products as any[]) = updatedProducts;
  undelivered.totalUndeliveredAmount = undelivered.totalUndeliveredAmount - newTotalAmount;
  await undelivered.save();

  return newDelivered;
};


const getAllDelivered = async () => {
  const result = await DeliveredProducts.find({})
    .sort({ updatedAt: -1 })
    .populate('dealer product.product');

  return result;
};

export const DeliveredService = {
  deliveredDo,
  getAllDelivered,
};
