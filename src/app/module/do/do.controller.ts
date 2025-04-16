import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import httpStatus from 'http-status';
import { DoServices } from './do.service';

const makeDo = catchAsync(async (req, res) => {
  const { orderId } = req.body;

  const result = await DoServices.makeDoToDb(orderId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Do Maked successfully',
    data: result,
  });
});
const rejectDo = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await DoServices.rejectDo(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Do rejected successfully',
    data: result,
  });
});
const getAllDo = catchAsync(async (req, res) => {
  const result = await DoServices.getAllDoFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Do retrtive successfully',
    data: result,
  });
});
const getSingleDo = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await DoServices.getSingleDoFromDb(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Do retrtive successfully',
    data: result,
  });
});
const approvedDo = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await DoServices.approvedDo(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Do approved successfully',
    data: result,
  });
});

const getAllUndeliveredProducts = catchAsync(async (req, res) => {
  const result = await DoServices.getAllUndeliveredProducts();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Do retrtive successfully',
    data: result,
  });
})

const getSingleUndeliveredProducts = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await DoServices.getSingleUndeliveredProducts(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Do retrtive successfully',
    data: result,
  });
})

const getUndeliveredProductsByDealer = catchAsync(async (req, res) => {
  const dealerCode = req.params.dealerCode;
  const result = await DoServices.getUndeliveredProductsByDealer(dealerCode);
  sendResponse(res, { 
    statusCode: httpStatus.OK,
    success: true,
    message: 'Undelivered retrieve successfully',
    data: result,
  });
})



export const DoController = {
  makeDo,
  rejectDo,
  getAllDo,
  getSingleDo,
  approvedDo,
  getAllUndeliveredProducts,
  getSingleUndeliveredProducts,
  getUndeliveredProductsByDealer

};
