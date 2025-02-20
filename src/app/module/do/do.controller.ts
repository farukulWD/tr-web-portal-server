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

export const DoController = {
  makeDo,
  getAllDo,
  getSingleDo,
};
