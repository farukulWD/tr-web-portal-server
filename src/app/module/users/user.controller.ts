import httpStatus  from 'http-status';
import sendResponse from '../../utils/utils/sendResponse';
import { UserServices } from './user.service';
import catchAsync from '../../utils/utils/catchAsync';



const createUser = catchAsync(async (req, res) => {
  const { userData } = req.body;

  const result = await UserServices.createUserIntoDb(req.file, userData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created success',
    data: result,
  });
});

export const UserControllers = {
  createUser,
};
