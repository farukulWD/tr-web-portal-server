import AppError from '../../errors/AppError';
import { Company } from './company.model';
import { CompanyInput } from './company.validation';
import httpStatus from 'http-status';
import { User } from '../users/user.model';

const createCompany = async (file: any, company: CompanyInput) => {
  if (!company) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Company data is required');
  }
  if (!company.userId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User ID is required');
  }
  if (!company.name) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Company name is required');
  }
  if (!company.phone) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Phone number is required');
  }

  if (!company.email) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email is required');
  }
  if (!company.website) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Website is required');
  }

  const user = User.findById({ _id: company.userId });

  if(!user){
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
  }

  const result = await Company.create(company);

  return result;
};

const getAllCompanies = async () => {
  const result = await Company.find({});
  return result;
};

export const companyServices = {
  createCompany,
  getAllCompanies,
};
