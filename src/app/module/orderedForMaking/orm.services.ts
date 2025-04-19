import { Types } from 'mongoose';
import AppError from '../../errors/AppError';
import OrderedForMaking from './ofm.model';
import { IOrderedForMaking } from './ofm.interface';

const createOrmToDb = async (data: IOrderedForMaking) => {
  if (!data) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Data is required');
  }
  if (!data.orderId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Order ID is required');
  }
  if (!data.deliveredPartnerId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Delivered Partner ID is required'
    );
  }
  if (!data.products || data.products.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Products are required');
  }
  if (!data.deliveryDate) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Delivery date is required');
  }
  if (!data.createdBy) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Created By is required');
  }
  const result = await OrderedForMaking.create(data);
  return result;
};

const getAllOrm = async () => {
  const result = await OrderedForMaking.find({})
    .populate('products.productId')
    .populate('deliveredPartnerId')
    .populate('createdBy')
    .populate('updatedBy');
  return result;
};

const getSingleOrm = async (id: Types.ObjectId) => {
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, 'ID is required');
  }
  const result = await OrderedForMaking.findById(id)
    .populate('products.productId')
    .populate('deliveredPartnerId')
    .populate('createdBy')
    .populate('updatedBy');
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Ordered For Making not found');
  }

  return result;
};
const updateOrm = async (id: Types.ObjectId, data: IOrderedForMaking) => {
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, 'ID is required');
  }
  if (!data) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Data is required');
  }
  if (!data.orderId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Order ID is required');
  }
  if (!data.deliveredPartnerId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Delivered Partner ID is required'
    );
  }
  if (!data.products || data.products.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Products are required');
  }
  const result = await OrderedForMaking.findByIdAndUpdate(id, data, {
    new: true,
  })
    .populate('products.productId')
    .populate('deliveredPartnerId')
    .populate('createdBy')
    .populate('updatedBy');
  return result;
};
const deleteOrm = async (id: Types.ObjectId) => {
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, 'ID is required');
  }
  const result = await OrderedForMaking.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Ordered For Making not found');
  }
  if (result.status === 'completed') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Cannot delete completed order');
  }
  if (result.status === 'in-progress') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot delete in-progress order'
    );
  }

  const getResult = await OrderedForMaking.findByIdAndDelete(id)
    .populate('products.productId')
    .populate('deliveredPartnerId')
    .populate('createdBy')
    .populate('updatedBy');
  return getResult;
};

export const ormServices = {
  createOrmToDb,
  getAllOrm,
  getSingleOrm,
  updateOrm,
  deleteOrm,
};
