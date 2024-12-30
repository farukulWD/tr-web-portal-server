import AppError from "../../errors/AppError";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import httpStatus from 'http-status';


const createProduct = async (payload: IProduct) => {

    let data = {
        name: payload.name,
        price: payload.price,
        description: payload.description,
        stock: payload.stock,
        group: payload.group,
    }
    try {
        const product = await Product.create(data);
        return product;
    } catch (error) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error creating product");

    }

}

const getProduct = async (searchTerm: string) => {
    try {
        // Start with an empty query object
        let query: any = {};

        if (searchTerm) {
            // Build a dynamic query that checks if the search term is found in productCode, name, or group
            query = {
                $or: [
                    { productCode: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search for productCode
                    { name: { $regex: searchTerm, $options: 'i' } },         // Case-insensitive search for name
                    { group: { $regex: searchTerm, $options: 'i' } }         // Case-insensitive search for group
                ]
            };
        }
        const product = await Product.find(query)
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

const deleteProduct = async (id: string) => {
    try {
        const product = await Product.findByIdAndDelete(id)
        if (!product) {
            throw new AppError(httpStatus.NOT_FOUND, "Product not found");
        }
        return product;
    } catch (error) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to delete product");
    }
}



export const ProductServices = {
    createProduct,
    getProduct,
    updateProduct,
    getSingleProduct,
    deleteProduct
}