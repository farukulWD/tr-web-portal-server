import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { NP } from './np.model';

const createNp = async (npData: { np: number; createdBy: string }) => {
  if (!npData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'National percentage is required'
    );
  }

  const findNP = await NP.find({});

  if (findNP) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Np Already created');
  }

  const result = await NP.create(npData);
  return result;
};

const updateNP = async (
  npId: string,
  npData: { np: number; updatedBy: string }
) => {
  if (!npId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'National percentage id is required'
    );
  }
  if (!npData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'National percentage data is required'
    );
  }

  const findNp = await NP.findByIdAndUpdate(npId, npData, { new: true });

  if (!findNp) {
    throw new AppError(httpStatus.BAD_REQUEST, 'National percentage not found');
  }
};

const getNp = async () => {
  const result = await NP.find({}).populate('createdBy').populate('updatedBy');

  return result;
};

export const NPServices = {
  createNp,
  updateNP,
  getNp,
};
