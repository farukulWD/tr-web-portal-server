import mongoose from 'mongoose';

import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createUserIntoDb = async (file: any, payload: any) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id

    if (file) {
      const imageName = `${payload?.name}`;
      const path = file?.path;

      //send image to cloudinary
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

    const existingUser = await User.findOne({ mobile: payload.mobile });
    console.log({ existingUser });

    if (existingUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'The user already created');
    }

    // create a user (transaction-1)
    const newUser = await User.create([payload], { session }); // array

    //create a student
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    await session.commitTransaction();
    await session.endSession();
    return newUser;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const UserServices = {
  createUserIntoDb,
};
