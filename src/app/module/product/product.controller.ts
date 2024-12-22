import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductServices } from "./product.service";

const createProduct = catchAsync(async(req,res)=>{
    const data = req.body;
    const result = await ProductServices.createProduct(data)

    sendResponse(res,{
        statusCode: httpStatus.OK,
        message: "Product created successfully",
        success: true,
        data: result
    })
})