import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderServices } from "./order.service";


const createOrder = catchAsync(async(req,res)=>{
    const data = req.body;
    const result = await OrderServices.createOrder(data);

    sendResponse(res,{
        statusCode: httpStatus.OK,
        message: "Order created successfully",
        success: true,
        data: result
    })
})



export const OrderController = {
    createOrder
}