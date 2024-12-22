import AppError from "../../errors/AppError";
import { Dealer } from "../dealer/dealer.model";
import { Product } from "../product/product.model";
import { User } from "../users/user.model";
import { IOrder } from "./order.interface";
import { Order } from "./order.model";

const createOrder = async (payload: IOrder) => {
    // Step 1: Find the dealer
    const user = await Dealer.findOne({ code: payload.dealerCode });
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Dealer not found");
    }

    // Step 2: Validate all products
    const productCodes = payload.product.map(product => product.productCode);
    const products = await Product.find({ productCode: { $in: productCodes } });

    // if (products.length !== payload.product.length) {
    //     throw new AppError(httpStatus.NOT_FOUND, "One or more products not found");
    // }

    // Step 3: Validate quantities and calculate total value
    let total = 0;
    payload.product.forEach(orderProduct => {
        const product = products.find(p => p.productCode === orderProduct.productCode);
        if (!product) {
            throw new AppError(httpStatus.NOT_FOUND, `Product ${orderProduct.productCode} not found`);
        }

        if (orderProduct.quantity > product.quantity) {
            throw new AppError(httpStatus.BAD_REQUEST, `Insufficient quantity for product ${orderProduct.productCode}`);
        }
        orderProduct.price = product.price
        // Add to total (price * quantity)
        total += orderProduct.quantity * product.price;
    });

    // Step 4: Create the order
    const orderData = {
        ...payload,
        total, // Include calculated total
        status: "pending",
        approved: false
    };

    try {
        const order = await Order.create(orderData);

        // Optionally, deduct the dealer's money
        // user.money = user.money - total;
        // await user.save();

        return order;
    } catch (error) {
        console.error("Error creating order:", error);
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error creating order");
    }
};


const activeOrder = async(payload: IOrder[]) => {
    try {
        // Extract order IDs from the payload
        const orderIds = payload.map(order => order._id);

        // Update all orders with the extracted IDs to set their status to "active"
        const result = await Order.updateMany(
            { _id: { $in: orderIds } }, // Match orders with IDs in the payload
            { $set: { status: 'active' } } // Update status to "active"
        );

        console.log(`${result.modifiedCount} orders were updated to active status.`);
        return result;
    } catch (error) {
        console.log(error);
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error Active order");
    }

}


export const OrderServices= {
    createOrder,
    activeOrder
}
