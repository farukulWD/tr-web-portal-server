import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { companyServices } from './company.services';

const createCompanyController = catchAsync(async (req, res) => {
  const { companyData } = req.body;
  const createdBy = req.user._id;

  const company = await companyServices.createCompany(req.file, {
    ...companyData,
    createdBy,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Company created successfully',
    data: company,
  });
});

const getAllCompanyController = catchAsync(async (req, res) => {
  const result = await companyServices.getAllCompanies();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Company fetched successfully',
    data: result,
  });
});

export const companyController = {
  createCompanyController,
  getAllCompanyController,
};
