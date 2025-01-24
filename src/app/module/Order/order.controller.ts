import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OrderServices } from './order.service';
import httpStatus from 'http-status';

const createOrder = catchAsync(async (req, res) => {
  const data = req.body;
  const code = req?.user?.code;
  const result = await OrderServices.createOrder({ ...data, dealer: code });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Order created successfully',
    success: true,
    data: result,
  });
});

const addProductOnOrder = catchAsync(async (req, res) => {
  const data = req.body;
  const user = req.user;
  const result = await OrderServices.addProductOnOrder({
    ...data,
    dealerCode: user?.code,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Added product successfully',
    success: true,
    data: result,
  });
});
const deleteProductFromOrder = catchAsync(async (req, res) => {
  const data = req.body;
  const user = req.user;
  const result = await OrderServices.deleteProductFromOrder({
    ...data,
    dealerCode: user?.code,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Delete product successfully',
    success: true,
    data: result,
  });
});

const getDealerOrder = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await OrderServices.getDealerOrder(user?.code);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'oreder found successfuly',
    success: true,
    data: result,
  });
});

const activeOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OrderServices.activeOrder(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Order activated successfully',
    success: true,
    data: result,
  });
});

const getOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OrderServices.getOrder(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Order Fetched successfully',
    success: true,
    data: result,
  });
});

const getDraftOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OrderServices.getDraftOrder(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Order Fetched successfully',
    success: true,
    data: result,
  });
});

const cancelOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OrderServices.cancelOrder(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Order cancelled successfully',
    success: true,
    data: result,
  });
});

const getCancelOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OrderServices.getCancelOrder(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Order cancelled successfully',
    success: true,
    data: result,
  });
});

const deleteOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OrderServices.deleteOrder(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Order deleted successfully',
    success: true,
    data: result,
  });
});

export const OrderController = {
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
