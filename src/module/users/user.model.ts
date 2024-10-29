/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import config from '../../config';
import { UserStatus } from './user.constant';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';

const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      postal: {
        type: Number,
      },
      country: {
        type: String,
        enum: ['Bangladesh'],
        default: 'Bangladesh',
      },
    },
    isMobileVefify: {
      type: Boolean,
      default: false,
    },
    isEmailVefify: {
      type: Boolean,
      default: false,
    },
    kyc: {
      type: Boolean,
      default: false,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,

      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    profileImg: {
      type: String,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['superAdmin', 'user', 'admin'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  // hashing password and save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.userFindByMobile = async function (payload: string) {
  return await User.findOne({ mobile: payload }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema);
