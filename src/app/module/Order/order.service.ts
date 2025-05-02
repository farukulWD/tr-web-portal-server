import AppError from '../../errors/AppError';
import { Dealer } from '../dealer/dealer.model';
import { NP } from '../NP/np.model';
import { Product } from '../product/product.model';
import { User } from '../users/user.model';
import { IAddProduct, IOrder } from './order.interface';
import { Order } from './order.model';
import httpStatus from 'http-status';

// TODO Need to make type
const createOrder = async (payload: any) => {
  const dealer = await Dealer.findOne({ code: payload.dealer });
  if (!dealer) {
    throw new AppError(httpStatus.NOT_FOUND, 'Dealer not found');
  }

  const getOrder = await Order.findOne({
    dealer: dealer._id,
    orderType: 'confirm',
    status: 'pending',
  });

  if (getOrder) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Order found already');
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
  // Validation
  if (!payload?.productCode) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Product is required');
  }
  if (!payload?.orderId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Order ID is required');
  }
  if (!payload.quantity || payload.quantity < 1) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Quantity must be at least 1');
  }
  if (!payload?.dealerCode) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Dealer code is required');
  }

  // Fetch Dealer
  const dealer = await Dealer.findOne({ code: payload.dealerCode });
  if (!dealer) {
    throw new AppError(httpStatus.NOT_FOUND, 'Dealer not found');
  }

  // Fetch Product
  const product = await Product.findOne({ productCode: payload.productCode });
  if (!product) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Product not found');
  }

  // Fetch Order
  const findOrder = await Order.findOne({ _id: payload.orderId });
  if (!findOrder) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }

  // Dealer validation for this order
  if (dealer._id.toString() !== findOrder.dealer?.toString()) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to add product to this order'
    );
  }

  // Get National Percentage (np)
  const np = await NP.find({});
  const nationalPercentage = np?.[0]?.np ?? 0;
  const spPercentage = payload?.sp ?? 0;
  const totalPercentage = nationalPercentage + spPercentage;

  // Calculate price for new product
  const totalPriceForThisProduct = parseFloat(
    (product.price * payload.quantity).toFixed(2)
  );
  const spAmount = (totalPriceForThisProduct * totalPercentage) / 100;
  const totalAfterSP = totalPriceForThisProduct - spAmount;

  // Calculate existing order total (excluding SP)
  const preGrandTotal =
    findOrder?.product?.reduce((sum, row) => {
      const price = row?.price ?? 0;
      const quantity = row?.quantity ?? 0;
      const sp = row?.sp ?? 0; 
      const np = row?.np ?? nationalPercentage; 
      const gross = price * quantity;
      const commission = (gross * (sp + np)) / 100;
      return sum + (gross - commission);
    }, 0) ?? 0;

  // Final total after applying national commission
  const finalTotal = preGrandTotal + totalAfterSP;

  // Update the order with new product and updated total
  const updatedOrder = await Order.findOneAndUpdate(
    { _id: findOrder._id },
    {
      $set: { total: finalTotal },
      $push: {
        product: {
          product: product._id,
          price: product.price,
          quantity: payload.quantity,
          sp: payload.sp,
          total: totalAfterSP,
          np: nationalPercentage,
        },
      },
    },
    { new: true }
  );

  return updatedOrder;
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

  const updatedTotal = (order.total || 0) - productInOrder?.total;

  console.log(updatedTotal, order.total, productInOrder?.total);

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

  let getOrder = await Order.findOne({
    dealer: dealer._id,
    orderType: 'confirm',
    status: 'pending',
  })
    .populate('product.product')
    .sort({ createdAt: -1 });

  if (!getOrder) {
    const data = { orderType: 'confirm', dealer: dealerCode };
    await createOrder(data);

    // Try again after creating
    getOrder = await Order.findOne({
      dealer: dealer._id,
      orderType: 'confirm',
      status: 'pending',
    })
      .populate('product.product')
      .sort({ createdAt: -1 });

    if (!getOrder) {
      // Now it’s really a problem
      throw new AppError(httpStatus.NOT_FOUND, 'Order creation failed');
    }
  }

  // By here, TypeScript knows getOrder is not null
  getOrder.product =
    getOrder.product?.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ) || [];

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
