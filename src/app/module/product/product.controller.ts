import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductServices } from "./product.service";
import httpStatus from 'http-status';

const createProduct = catchAsync(async (req, res) => {
    const data = req.body;
    const result = await ProductServices.createProduct(data)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Product created successfully",
        success: true,
        data: result
    })
})


const getProduct = catchAsync(async (req, res) => {
    const result = await ProductServices.getProduct()
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Product retrieved successfully",
        success: true,
        data: result
    })
})


const updateProduct = catchAsync(async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const result = await ProductServices.updateProduct(id, data)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Product created successfully",
        success: true,
        data: result
    })
})

const getSingleProduct = catchAsync(async (req, res) => {
    const id = req.params.id;
    const result = await ProductServices.getSingleProduct(id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Product retrieved successfully",
        success: true,
        data: result
    })
})

export const ProductController = {
    createProduct,
    getProduct,
    updateProduct,
    getSingleProduct
}