import AppError from '../../errors/AppError';
import { Dealer } from '../dealer/dealer.model';
import { UndeliveredProducts } from '../do/do.model';
import { IDelivered, IDeliveredProduct } from './delivered.interface';
import { DeliveredProducts } from './delivered.model';
import httpStatus from 'http-status';

const deliveredDo = async (
  undeliveredId: string,
  deliveredData: IDelivered
) => {
  if (!undeliveredId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Undelivered ID is required');
  }

  // Fetch the undelivered record
  const undelivered = await UndeliveredProducts.findById(undeliveredId);
  if (!undelivered) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Undelivered record not found');
  }

  if (undelivered.status === 'delivered') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This has already been delivered'
    );
  }

  // Verify the associated dealer exists
  const dealer = await Dealer.findById(undelivered.dealer);
  if (!dealer) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Dealer not found');
  }

  // Calculate total amount of newly delivered products
  const newTotalAmount =
    deliveredData?.products?.reduce((acc, curr) => acc + curr.total, 0) || 0;

  const updatedProducts = undelivered.products.map((product: any) => {
    const matchedDelivered = deliveredData?.products?.find((delivered: any) => {
      return delivered.undeliveredPId.toString() === product?._id?.toString();
    });

    if (matchedDelivered) {
      const updatedQty = product.quantity - matchedDelivered.quantity;
      const updatedTotal = product.total - matchedDelivered.total;

      return {
        ...product.toObject(),
        quantity: Math.max(updatedQty, 0),
        total: Math.max(updatedTotal, 0),
      };
    }

    return product.toObject();
  });

  // Create new DeliveredProducts document
  const newDelivered = await DeliveredProducts.create(deliveredData);

  // Update the undelivered record
  const updatedUndelivered = await UndeliveredProducts.findByIdAndUpdate(
    undeliveredId,

    {
      products: updatedProducts,
      totalUndeliveredAmount:
        undelivered.totalUndeliveredAmount - newTotalAmount,
    },
    { new: true }
  );


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
