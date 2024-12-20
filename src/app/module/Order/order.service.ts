import AppError from "../../errors/AppError";
import { Dealer } from "../dealer/dealer.model";
import { User } from "../users/user.model";
import { IOrder } from "./order.interface";
import { Order } from "./order.model";

const createOrder = async (payload: IOrder) => {

    const user = await Dealer.findOne({ code: payload.dealerCode });
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, " Dealer not found");
    }
    // const product = await Product.productFind({ productCode: payload.product });

    // if (!product) {
    //     throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    // }

    let data = {
        dealerCode: payload.dealerCode,
        product: payload.product,
        quantity: payload.quantity,
        // price: product.price
        // total: product.price*payload.quantity,
    }
    try {
        const order = await Order.create(data);
        // user.money = user.money - data.total
        // await user.save()
        return order;
    } catch (error) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error creating order");

    }
}


export const OrderServices= {
    createOrder
}
