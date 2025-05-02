import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NPServices } from './np.services';
import httpStatus from 'http-status';

const createNp = catchAsync(async (req, res) => {
  const data = req.body;
  const { userId } = req.user;
  const result = await NPServices.createNp({
    ...data,
    createdBy: userId,
    updatedBy: userId,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'NP created success',
    data: result,
  });
});

const updateNp = catchAsync(async (req, res) => {
  const data = req.body;
  const npId = req.params.npId;
  const { userId } = req.user;
  const result = await NPServices.updateNP(npId, {
    ...data,
    updatedBy: userId,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Np update success',
    data: result,
  });
});
const allNp = catchAsync(async (req, res) => {
  const result = await NPServices.getNp();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All np retrieve ',
    data: result,
  });
});

export const NPController = {
  createNp,
  updateNp,
  allNp,
};
