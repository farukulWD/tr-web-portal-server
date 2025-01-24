import AppError from '../../errors/AppError';
import { Dealer } from '../dealer/dealer.model';
import { Product } from '../product/product.model';
import { User } from '../users/user.model';
import { IAddProduct, IOrder } from './order.interface';
import { Order } from './order.model';
import httpStatus from 'http-status';

const createOrder = async (payload: IOrder) => {
  const dealer = await Dealer.findOne({ code: payload.dealer });
  if (!dealer) {
    throw new AppError(httpStatus.NOT_FOUND, 'Dealer not found');
  }

  const orderData = {
    ...payload,
    dealer: dealer._id,
    status: 'pending',
    approved: false,
  };

  try {
    const order = await Order.create(orderData);
    return order;
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error creating order'
    );
  }
};

const addProductOnOrder = async (payload: IAddProduct) => {
  if (!payload?.productCode) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Product is Required');
  }
  if (!payload?.orderId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Order id is required');
  }
  if (!payload.quantity || payload.quantity < 1) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Quantity must be at least 1');
  }

  if (!payload?.dealerCode) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Dealer code is requaired');
  }

  const dealer = await Dealer.findOne({ code: payload.dealerCode });
  if (!dealer) {
    throw new AppError(httpStatus.NOT_FOUND, 'Dealer not found');
  }

  const product = await Product.findOne({ productCode: payload.productCode });

  if (!product) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Product Not Found');
  }

  const findOrder = await Order.findOne({ _id: payload?.orderId });

  if (dealer._id.toString() !== findOrder?.dealer?.toString()) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'You are not right person to make the order'
    );
  }

  const totalPriceForThisProduct = parseFloat(
    (product.price * payload.quantity).toFixed(2)
  );

  const total = (findOrder.total || 0) + totalPriceForThisProduct;

  const result = await Order.findOneAndUpdate(
    { _id: findOrder?._id },
    {
      $set: { total },
      $push: {
        product: {
          product: product?._id,
          price: product?.price,
          quantity: payload?.quantity,
        },
      },
    },
    { new: true }
  );

  return result;
};

const deleteProductFromOrder = async (payload: {
  orderId: string;
  productId: string;
  dealerCode: string;
}) => {
  if (!payload?.orderId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Order ID is required');
  }
  if (!payload?.productId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Product id is required');
  }

  const order = await Order.findOne({ _id: payload.orderId });
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }

  const dealer = await Dealer.findOne({ code: payload.dealerCode });
  if (!dealer) {
    throw new AppError(httpStatus.NOT_FOUND, 'Dealer not found');
  }

  const productInOrder = order?.product?.find(
    (item: any) => item?._id?.toString() === payload?.productId?.toString()
  );

  if (!productInOrder) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Product not found in the order'
    );
  }

  if (dealer._id.toString() !== order?.dealer?.toString()) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'You are not right person to make the order'
    );
  }

  const productTotalPrice = productInOrder?.price * productInOrder?.quantity;
  const updatedTotal = (order.total || 0) - productTotalPrice;

  const updatedOrder = await Order.findOneAndUpdate(
    { _id: order._id },
    {
      $set: { total: updatedTotal },
      $pull: { product: { _id: payload.productId } },
    },
    { new: true }
  );

  return updatedOrder;
};

const getDealerOrder = async (dealerCode: string) => {
  const dealer = await Dealer.findOne({ code: dealerCode });
  if (!dealer) {
    throw new AppError(httpStatus.NOT_FOUND, 'Dealer not found');
  }

  const getOrder = await Order.findOne({
    dealer: dealer?._id,
    orderType: 'confirm',
  })
    .populate('product.product')
    .sort({ createdAt: -1 });

  if (!getOrder) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }
  getOrder.product = await getOrder?.product?.sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return getOrder;
};

const activeOrder = async (payload: any) => {
  try {
    let result = await Order.findOne({ _id: payload });
    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, `Order not found`);
    }

    const dealer = await Dealer.findOne({ _id: result.dealer });
    if (!dealer) {
      throw new AppError(httpStatus.NOT_FOUND, `Dealer not found`);
    }
    // Update the order status to "active"
    if (dealer.money >= result.total) {
      await result.updateOne({ $set: { status: 'active' } });
      // Optionally, deduct the dealer's money
      // user.money = user.money - total;
      // await user.save();
      dealer.money = dealer.money - result.total;
      await dealer.save();
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Dealer does not have enough money`
      );
    }

    return result;
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Error Active order');
  }
};

const getOrder = async (id: string) => {
  try {
    const order = await Order.find({ dealer: id }).populate(
      'product.product dealer'
    );
    return order;
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Error getting order');
  }
};

const getDraftOrder = async (id: string) => {
  try {
    const order = await Order.find({ orderType: 'draft', dealer: id }).populate(
      'product.product dealer'
    );
    return order;
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Error getting order');
  }
};

const cancelOrder = async (id: string) => {
  try {
    const order = await Order.findById(id);
    if (!order) {
      throw new AppError(httpStatus.NOT_FOUND, `Order not found`);
    }
    // Update the order status to "canceled"
    await order.updateOne({ $set: { status: 'canceled' } });

    let dealer = await Dealer.findById(order.dealer);
    if (!dealer) {
      throw new AppError(httpStatus.NOT_FOUND, `Dealer not found`);
    }
    dealer.money = dealer.money + order.total;
    await dealer.save();
    return order;
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Error cancel order');
  }
};

const getCancelOrder = async (id: string) => {
  try {
    const order = await Order.find({ status: 'canceled', dealer: id }).populate(
      'product.product dealer'
    );
    return order;
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Error getting order');
  }
};

const deleteOrder = async (id: string) => {
  try {
    const order = await Order.findById(id);
    if (!order) {
      throw new AppError(httpStatus.NOT_FOUND, `Order not found`);
    }
    // Delete the order
    await order.deleteOne();

    return order;
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Error delete order');
  }
};

export const OrderServices = {
  createOrder,
  addProductOnOrder,
  deleteProductFromOrder,
  getDealerOrder,
  activeOrder,
  getOrder,
  getDraftOrder,
  cancelOrder,
  getCancelOrder,
  deleteOrder,
};
