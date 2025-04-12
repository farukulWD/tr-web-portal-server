import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Order } from '../Order/order.model';
import { Dealer } from '../dealer/dealer.model';
import { IDo } from './do,interface';
import { ObjectId } from 'mongoose';
import { Do } from './do.model';

const makeDoToDb = async (orderId: string) => {
  if (!orderId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Order id Required');
  }

  const order = await Order.findById({ _id: orderId }).select(
    '-createdAt -updatedAt -__v'
  );

  if (!order) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Order not Found');
  }

  const products = order.product.map(p => {
    return {
      price: p?.price,
      quantity: p?.quantity,
      product: p?.product,
    };
  });

  console.log(products?.length);
  if (products?.length <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Products not found');
  }

  const dealer = await Dealer.findById({ _id: order?.dealer });

  if (!dealer) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Dealer Not Found');
  }

  const total =
    Math.round(
      products.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
      ) * 100
    ) / 100;

  if (total > dealer?.money) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You have not enough Mony');
  }

  const OrderData = {
    total,
    product: products,
    orderCode: order?.orderCode,
    dealer: dealer?._id,
  };

  const result = await Do.create(OrderData);

  if (!result?._id) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Do Maked Fialed');
  }

  const updateOrder = await Order.findByIdAndUpdate(
    { _id: order?._id },
    { status: 'active' }
  );

  return result;
};

const getAllDoFromDb = async () => {
  const result = await Do.find({})
    .sort({ updatedAt: -1 })
    .populate('dealer product.product');

  return result;
};
const getSingleDoFromDb = async (id: string) => {
  const result = await Do.findById({ _id: id }).populate(
    'dealer product.product'
  );

  return result;
};



const approvedDo = async (id: string) => {

if (!id) {
  throw new AppError(httpStatus.BAD_REQUEST, 'Do id Required');
  
}


   
}

export const DoServices = {
  makeDoToDb,
  getAllDoFromDb,
  getSingleDoFromDb,
};
