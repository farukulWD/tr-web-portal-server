import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BalanceServices } from './balance.service';
import httpStatus from 'http-status';

const addBalanceController = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  data.addedBy = req?.user?.userId;
  const result = await BalanceServices.addBalanceService(data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Balance Added successfully',
    success: true,
    data: result,
  });
});
const getBalanceController = catchAsync(async (req: Request, res: Response) => {
  const result = await BalanceServices.getBalanceServices();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Balance Gets successfully',
    success: true,
    data: result,
  });
});

export const BalanceControllers = {
  addBalanceController,
  getBalanceController,
};
