import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DeliveredService } from './delivered.service';

const deliveredDo = catchAsync(async (req, res) => {
  const undeliveredId = req.params.undeliveredId;

  const result = await DeliveredService.deliveredDo(undeliveredId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Do delivered successfully',
    data: result,
  });
});

const getAllDelivered = catchAsync(async (req, res) => {
  const result = await DeliveredService.getAllDelivered();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Do retrieve successfully',
    data: result,
  });
});

export const DeliveredController = {
  deliveredDo,
  getAllDelivered,
};
