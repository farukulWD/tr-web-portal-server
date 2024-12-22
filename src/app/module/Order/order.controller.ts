import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderServices } from "./order.service";


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
    const data = req.body;
    const result = await OrderServices.activeOrder(data);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Order activated successfully",
        success: true,
        data: result
    })
})



export const OrderController = {
    createOrder,
    activeOrder
}