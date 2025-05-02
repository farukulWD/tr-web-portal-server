import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Order } from '../Order/order.model';
import { Dealer } from '../dealer/dealer.model';
import { IDo } from './do,interface';
import { ObjectId } from 'mongoose';
import { Do, UndeliveredProducts } from './do.model';
import { get } from 'http';

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
      sp: p?.sp,
      np: p?.np,
      total: p?.total,
    };
  });

  if (products?.length <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Products not found');
  }

  const dealer = await Dealer.findById({ _id: order?.dealer });

  if (!dealer) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Dealer Not Found');
  }

  if (order?.total > dealer?.money) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You have not enough Mony');
  }

  const OrderData = {
    total: order?.total,
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

  const updateDealerAmount = await Dealer.findByIdAndUpdate(
    { _id: dealer?._id },
    {
      money: dealer?.money - order?.total,
    },
    { new: true }
  );

  return result;
};

const rejectDo = async (id: string) => {
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Do id Required');
  }
  const getDo = await Do.findById({ _id: id }).populate('product.product');

  if (!getDo) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Do not Found');
  }
  if (getDo.status === 'rejected') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Do already rejected');
  }
  const dealer = await Dealer.findById({ _id: getDo.dealer });
  if (!dealer) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Dealer not Found');
  }

  const total =
    Math.round(
      getDo.product.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
      ) * 100
    ) / 100;
  const updateOrder = await Do.findByIdAndUpdate(
    { _id: getDo._id },
    { status: 'canceled' },
    { new: true }
  );
  const updateDealerAmount = await Dealer.findByIdAndUpdate(
    { _id: dealer?._id },
    {
      money: dealer?.money + total,
    },
    { new: true }
  );
  return updateOrder;
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

  const getDo = await Do.findById({ _id: id }).populate('product.product');

  if (!getDo) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Do not Found');
  }

  if (getDo.status === 'approved') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Do already approved');
  }
  const dealer = await Dealer.findById({ _id: getDo.dealer });
  if (!dealer) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Dealer not Found');
  }

  const newProducts = getDo.product.map((p: any) => {
    return {
      price: p.price,
      quantity: p.quantity,
      product: p?.product,
      total: p.price * p.quantity,
      orderCode: getDo.orderCode,
      doDate: p.createdAt,
      productCode: p.product?.productCode,
    };
  });

  // Calculate total of new products
  const newTotalAmount = newProducts.reduce((acc, curr) => acc + curr.total, 0);

  // Check if undelivered entry exists for the dealer
  const existingUndelivered = await UndeliveredProducts.findOne({
    dealer: getDo.dealer,
  });

  let result;

  if (existingUndelivered) {
    // Push new products and update total amount
    existingUndelivered.products.push(...newProducts);
    existingUndelivered.totalUndeliveredAmount =
      (existingUndelivered.totalUndeliveredAmount || 0) + newTotalAmount;

    result = await existingUndelivered.save();
  } else {
    // Create new undelivered entry
    const undeliveredData = {
      dealer: getDo.dealer,
      products: newProducts,
      totalUndeliveredAmount: newTotalAmount,
      dealerCode: dealer.code,
    };
    result = await UndeliveredProducts.create(undeliveredData);
  }

  // Update DO status
  await Do.findByIdAndUpdate(
    { _id: getDo._id },
    { status: 'approved', approved: true }
  );

  // Update Order approved status
  await Order.findOneAndUpdate(
    { orderCode: getDo.orderCode },
    { approved: true }
  );

  return result;
};

const getAllUndeliveredProducts = async () => {
  const result = await UndeliveredProducts.find({}).populate(
    'dealer products.product'
  );

  return result;
};
const getSingleUndeliveredProducts = async (undeliveredId: string) => {
  if (!undeliveredId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Undelivered id Required');
  }

  const result = await UndeliveredProducts.findById({
    _id: undeliveredId,
  }).populate('dealer products.product');

  return result;
};

const getUndeliveredProductsByDealer = async (dealerCode: string) => {
  if (!dealerCode) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Dealer dealer Code Required');
  }

  const dealer = await Dealer.findOne({ code: dealerCode });
  if (!dealer) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Dealer not Found');
  }
  const result = await UndeliveredProducts.findOne({
    dealerCode: dealerCode,
  }).populate('dealer products.product');
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Undelivered not Found');
  }
  return result;
};

export const DoServices = {
  makeDoToDb,
  rejectDo,
  getAllDoFromDb,
  getSingleDoFromDb,
  approvedDo,
  getAllUndeliveredProducts,
  getSingleUndeliveredProducts,
  getUndeliveredProductsByDealer,
};
