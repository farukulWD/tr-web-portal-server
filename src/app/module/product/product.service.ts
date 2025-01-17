import AppError from '../../errors/AppError';
import { IProduct } from './product.interface';
import { Product } from './product.model';
import httpStatus from 'http-status';

const createProduct = async (payload: IProduct) => {
  if (!payload.name) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Product Name is required');
  }
  if (payload.stock < 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Stock must be possitive number '
    );
  }

  const product = await Product.create(payload);
  return product;
};

const getProduct = async (searchTerm: string) => {
  try {
    let query: any = {};

    if (searchTerm) {
      query = {
        $or: [
          { productCode: { $regex: searchTerm, $options: 'i' } },
          { name: { $regex: searchTerm, $options: 'i' } },
          { group: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search for grou
        ],
        isDeleted: false,
      };
    }
    const product = await Product.find(query);
    return product;
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error getting product'
    );
  }
};

const updateProduct = async (id: string, payload: IProduct) => {
  let data: Partial<IProduct> = {};
  const product = await Product.findOne({ _id: id });
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  // Conditionally update fields based on the payload
  if (payload.name) {
    data.name = payload.name;
  }
  if (payload.description) {
    data.description = payload.description;
  }
  if (payload.price !== undefined && payload.price > 0) {
    data.price = payload.price;
  }
  if (payload?.stock !== undefined && payload.stock > 0) {
    data.stock = payload.stock;
  }

  // Update the product in the database
  const updatedProduct = await Product.findOneAndUpdate(
    { _id: id },
    data,
    { new: true } // Return the updated document
  );

  if (!updatedProduct) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product update failed');
  }

  return updatedProduct;
};

const getSingleProduct = async (id: string) => {
  try {
    const product = await Product.findById({ _id: id });
    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }
    return product;
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to get product'
    );
  }
};

const deleteProduct = async (id: string) => {
  try {
    const findProduct = await Product.findById({ _id: id });
    if (!findProduct) {
      throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }

    const status = findProduct?.isDeleted ? false : true;
    const product = await Product.findByIdAndUpdate(id, { isDeleted: status });

    return product;
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to delete product'
    );
  }
};

export const ProductServices = {
  createProduct,
  getProduct,
  updateProduct,
  getSingleProduct,
  deleteProduct,
};
