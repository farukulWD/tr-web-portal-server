import AppError from "../../errors/AppError";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";

const createProduct = async(payload: IProduct)=>{
    let productCode =  () => {
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

export const ProductServices= {
    createProduct
}