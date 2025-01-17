import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DealerServicess } from './dealer.services';
import httpStatus from 'http-status';

const createUserController = catchAsync(async (req, res) => {
  const dealerData = req.body;
  const files = req.files as {
    nidPic?: Express.Multer.File[];
    refNid?: Express.Multer.File[];
    refPhoto?: Express.Multer.File[];
  };
  const filesArray = Object.entries(files).map(([fieldName, fileDetails]) => ({
    ...fileDetails[0],
  }));

  const result = await DealerServicess.createDealerService(
    filesArray,
    dealerData
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dealer created successfully',
    data: result,
  });
});

const getAllDealerController = catchAsync(async (req, res) => {
  const result = await DealerServicess.getAllDealer();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dealer Fetched successfully',
    data: result,
  });
});

export const DealerController = {
  createUserController,
  getAllDealerController,
};
