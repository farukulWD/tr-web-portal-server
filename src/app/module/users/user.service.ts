import mongoose from 'mongoose';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import httpStatus from 'http-status';
import { userInfo } from 'os';
import { TUser } from './user.interface';

const createUserIntoDb = async (file: any, payload: TUser) => {
  // const session = await mongoose.startSession();
  try {
    // session.startTransaction();
    //set  generated id

    if (file) {
      const imageName = `${payload?.name}`;
      const path = file?.path;

      //send image to cloudinary
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

    const existingUser = await User.findOne({ mobile: payload.mobile });

    if (existingUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'The user already created');
    }

    // create a user (transaction-1)
    const newUser = await User.create(payload); // array

    // //create a student
    // if (!newUser.length) {
    //   throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    // }

    // await session.commitTransaction();
    // await session.endSession();
    return newUser;
  } catch (err: any) {
    // await session.abortTransaction();
    // await session.endSession();
    throw new Error(err);
  }
};

const updateUser = async (mobile: string, data: TUser) => {
  const isExititng = await User.userFind({ mobile: mobile });

  if (!isExititng) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
  }

  const res = await User.findOneAndUpdate({ mobile: mobile }, data, {
    new: true,
  });

  return res;
};
const getUsers = async () => {
  const res = await User.find();

  return res;
};

export const UserServices = {
  createUserIntoDb,
  updateUser,
  getUsers,
};
