import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderServices } from "./order.service";
import httpStatus from 'http-status';



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
    const { id } = req.params;
    const result = await OrderServices.activeOrder(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Order activated successfully",
        success: true,
        data: result
    })
})


const getOrder = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await OrderServices.getOrder(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Order Fetched successfully",
        success: true,
        data: result
    })
})

const getDraftOrder = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await OrderServices.getDraftOrder(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Order Fetched successfully",
        success: true,
        data: result
    })
})

const cancelOrder = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await OrderServices.cancelOrder(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Order cancelled successfully",
        success: true,
        data: result
    })
})

const getCancelOrder = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await OrderServices.getCancelOrder(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Order cancelled successfully",
        success: true,
        data: result
    })
})

const deleteOrder = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await OrderServices.deleteOrder(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Order deleted successfully",
        success: true,
        data: result
    })
})



export const OrderController = {
    createOrder,
    activeOrder,
    getOrder,
    getDraftOrder,
    cancelOrder,
    getCancelOrder,
    deleteOrder
}