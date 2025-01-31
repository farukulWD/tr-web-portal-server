import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import httpStatus from 'http-status';
import { DoServices } from './do.service';

const makeDo = catchAsync(async (req, res) => {
  const result = await DoServices.makeDoToDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Do Maked successfully',
    data: result,
  });
});

export const DoController = {
  makeDo,
};
