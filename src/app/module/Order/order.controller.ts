import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderServices } from "./order.service";
import httpStatus  from 'http-status';



const createOrder = catchAsync(async (req, res) => {
    const data = req.body;
    const result = await OrderServices.createOrder(data);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Order created successfully",
        success: true,
        data: result
    })
})

const activeOrder = catchAsync(async (req, res) => {
    const {id} = req.params;
    const result = await OrderServices.activeOrder(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Order activated successfully",
        success: true,
        data: result
    })
})


const getOrder = catchAsync(async (req, res) => {
    const result = await OrderServices.getOrder();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Order Fetched successfully",
        success: true,
        data: result
    })
})

const getDraftOrder = catchAsync(async (req, res) => {
    const result = await OrderServices.getDraftOrder();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Order Fetched successfully",
        success: true,
        data: result
    })
})


export const OrderController = {
    createOrder,
    activeOrder,
    getOrder,
    getDraftOrder
}