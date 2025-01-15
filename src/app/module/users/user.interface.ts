/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';
import { TUserFind } from './user.model';

export interface TUser extends Document {
  _id?: string;
  name: string;
  email?: string;
  mobile: string;
  profileImg?: string;
  password: string;
  code?: string;
  passwordChangedAt?: Date;
  role: 'superAdmin' | 'admin' | 'user' | 'dealer' | 'sr';
  status: 'active' | 'inactive';
  isDeleted: boolean;
  address?: {
    address: string;
    city: string;
    thana: string;
    postal: number;
    country: 'Bangladesh';
  };
  isMobileVerify?: boolean;
  isEmailVerify?: boolean;
  kyc?: boolean;
}
export interface UserModel extends Model<TUser> {
  userFindByMobile(mobile: string): Promise<TUser | null>;
  userFind(payload: TUserFind): Promise<TUser | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
