import jwt, { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import httpStatus from 'http-status';
import { userInfo } from 'os';
import { TUser } from './user.interface';
import { generateUniqueCode } from '../../utils/generateUniqueCode';
import config from '../../config';

const createUserIntoDb = async (file: any, payload: TUser) => {
  // console.log(file)

  try {
    if (file) {
      const imageName = `${payload?.name}`;
      const path = file?.path;

      //send image to cloudinary
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      console.log(secure_url);
      payload.profileImg = secure_url as string;
    }

    const existingUser = await User.findOne({ mobile: payload.mobile });

    if (existingUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'The user already created');
    }

    // create a user (transaction-1)
    payload.code = await generateUniqueCode();
    payload.password = payload.mobile;
    payload.role = 'user';
    const newUser = await User.create(payload); // array

    return newUser;
  } catch (err: any) {
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
const getUser = async (token: string) => {
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string
  ) as JwtPayload;

  const res = await User.findById({ _id: decoded?.userId });

  return res;
};

export const UserServices = {
  createUserIntoDb,
  updateUser,
  getUsers,
  getUser,
};
