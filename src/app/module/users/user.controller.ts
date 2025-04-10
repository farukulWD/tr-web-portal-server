import httpStatus from 'http-status';
import { UserServices } from './user.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const createUser = catchAsync(async (req, res) => {
  const {userData} = req.body;
 



  const result = await UserServices.createUserIntoDb(req.file,userData );
 

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created success',
    data: result,
  });
});



const getUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getUsers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Fetched  success',
    data: result,
  });
});
const getUser = catchAsync(async (req, res) => {
  const token = req.headers.authorization
  
  const result = await UserServices.getUser(token as string) ;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Fetched  success',
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const data = req.body;

  const mobile = req.params.mobile;
  const result = await UserServices.updateUser(mobile, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated success',
    data: result,
  });
});

export const UserControllers = {
  createUser,
  updateUser,
  getUsers,
  getUser
};
