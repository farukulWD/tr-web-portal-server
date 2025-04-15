import AppError from '../../errors/AppError';
import { Dealer } from '../dealer/dealer.model';
import { UndeliveredProducts } from '../do/do.model';
import { IDeliveredProduct } from './delivered.interface';
import { DeliveredProducts } from './delivered.model';

const deliveredDo = async (undeliveredId: string) => {
  if (!undeliveredId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Undelivered id Required');
  }
  const undelivered = await UndeliveredProducts.findById({
    _id: undeliveredId,
  }).populate('product.product');
  if (!undelivered) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Undelivered not Found');
  }
  if (undelivered.status === 'delivered') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Undelivered already delivered');
  }
  const dealer = await Dealer.findById({ _id: undelivered.dealer });

  if (!dealer) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Dealer not Found');
  }
  const newProducts: IDeliveredProduct[] = undelivered.products.map(
    (p: any) => {
      return {
        price: p.price,
        quantity: p.quantity,
        product: p?.product,
        total: p.price * p.quantity,
        orderCode: p.orderCode,
        doDate: p.doDate,
        productCode: p.product?.productCode,
      };
    }
  );

  // Calculate total of new products
  const newTotalAmount = newProducts.reduce((acc, curr) => acc + curr.total, 0);

  // Create new delivered product
  const newDelivered = await DeliveredProducts.create({
    dealer: dealer._id,
    dealerCode: dealer.code,
    totalDeliveredAmount: newTotalAmount,
    products: newProducts,
  });

  // Update undelivered product status to delivered
  await UndeliveredProducts.findByIdAndUpdate(
    { _id: undeliveredId },
    {
      status: 'delivered',
      totalUndeliveredAmount:
        undelivered?.totalUndeliveredAmount - newTotalAmount,
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
