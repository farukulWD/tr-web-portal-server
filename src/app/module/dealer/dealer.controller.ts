import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { DealerServicess } from "./dealer.services";
import httpStatus from "http-status";

const createUserController = catchAsync(async (req, res) => {
  const { dealerData } = req.body;

  // Ensure req.files is defined and is an array
  const files = Array.isArray(req.files) ? req.files : [];

  const result = await DealerServicess.createDealerService(files, dealerData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dealer created successfully',
    data: result,
  });
});

export const DealerController = {
  createUserController,
};
