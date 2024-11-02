import httpStatus  from 'http-status';
import { UserServices } from './user.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';



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
