import AppError from "../../errors/AppError";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import httpStatus from 'http-status';


const createProduct = async (payload: IProduct) => {
    let productCode = () => {
        return Math.floor(100000 + Math.random() * 900000);
    };
    let data = {
        name: payload.name,
        price: payload.price,
        productCode: productCode(),
        description: payload.description,
        quantity: payload.quantity,
        group: payload.group,
    }
    try {
        const product = await Product.create(data);
        return product;
    } catch (error) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error creating product");

    }

}

const getProduct = async () => {
    try {
        const product = await Product.find()
        return product;
    } catch (error) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error getting product");
    }
}

const updateProduct = async (id: string, payload: IProduct) => {
    // Initialize data object
    let data: Partial<IProduct> = {};

    // Find the product by productCode
    const product = await Product.findOne({ _id: id });
    if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, "Product not found");
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
    if (payload?.quantity !== undefined && payload.quantity > 0) {
        data.quantity = payload.quantity;
    }

    // Update the product in the database
    const updatedProduct = await Product.findOneAndUpdate(
        { _id: id },
        data,
        { new: true } // Return the updated document
    );

    if (!updatedProduct) {
        throw new AppError(httpStatus.NOT_FOUND, "Product update failed");
    }

    return updatedProduct;
};

const getSingleProduct = async (id: string) => {
    try {
        const product = await Product.findById(id)
        if (!product) {
            throw new AppError(httpStatus.NOT_FOUND, "Product not found");
        }
        return product;
    } catch (error) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to get product");
    }

}



export const ProductServices = {
    createProduct,
    getProduct,
    updateProduct,
    getSingleProduct
}