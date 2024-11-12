import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { User } from '../users/user.model';
import { Dealer, TDealer } from './dealer.model';
import httpStatus from "http-status"






const createDealerService = async (files: any[], payload: TDealer) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const user = await User.findById(payload.userId);
  
      if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found!");
      }
  
      if (files) {
        // Filter files by field names to correctly assign images
        const nidPicFile = files.find(file => file.fieldname === 'nidPic');
        const refPhotoFile = files.find(file => file.fieldname === 'refPhoto');
        const refNidFile = files.find(file => file.fieldname === 'refNid');
  
        if (nidPicFile) {
          const imageName = `${payload?.name}`;
          const path = nidPicFile.path;
          const { secure_url } = await sendImageToCloudinary(imageName, path);
          payload.nidPic = secure_url as string;
        }
  
        if (refPhotoFile) {
          const imageName = `${payload?.refName}`;
          const path = refPhotoFile.path;
          const { secure_url } = await sendImageToCloudinary(imageName, path);
          payload.refPhoto = secure_url as string;
        }
  
        if (refNidFile) {
          const imageName = `${payload?.refName}`;
          const path = refNidFile.path;
          const { secure_url } = await sendImageToCloudinary(imageName, path);
          payload.refNid = secure_url as string;
        }
      }
  
      const newDealer = await Dealer.create([payload], { session });
  
      if (!newDealer.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
      }
  
      await session.commitTransaction();
      session.endSession();
      return newDealer;
    } catch (error: any) {
      await session.abortTransaction(); // Abort if an error occurs
      session.endSession();
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  };
  


export const DealerServicess= {
createDealerService
}