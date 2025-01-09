import AppError from "../../errors/AppError";
import { Dealer } from "../dealer/dealer.model";
import { Product } from "../product/product.model";
import { User } from "../users/user.model";
import { IOrder } from "./order.interface";
import { Order } from "./order.model";
import httpStatus from 'http-status';


const createOrder = async (payload: IOrder) => {
    // Step 1: Find the dealer
    const user = await Dealer.findOne({ _id: payload.dealer });
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Dealer not found");
    }
    // let orderCode = () => {
    //     return Math.floor(100000 + Math.random() * 900000);
    // };

    // Step 2: Validate all products
    const productCodes = payload.product.map(product => product.product);
    const products = await Product.find({ _id: { $in: productCodes } });

    // if (products.length !== payload.product.length) {
    //     throw new AppError(httpStatus.NOT_FOUND, "One or more products not found");
    // }

    // Step 3: Validate quantities and calculate total value
    let total = 0;
    payload.product.forEach(orderProduct => {
        const product = products.find(p => p._id.toString() === orderProduct.product.toString());
        if (!product) {
            throw new AppError(httpStatus.NOT_FOUND, `Product ${orderProduct.product} not found`);
        }

        if (product.stock !== undefined && orderProduct.quantity > product.stock) {
            throw new AppError(httpStatus.BAD_REQUEST, `Insufficient quantity for product ${orderProduct.product}`);
        }
        if (product.price !== undefined) {
            orderProduct.price = product.price
            // Add to total (price * quantity)
            total += orderProduct.quantity * product.price;
        }

    });

    // Step 4: Create the order
    const orderData = {
        ...payload,
        total, // Include calculated total
        status: "pending",
        approved: false,
    };

    try {
        const order = await Order.create(orderData);



        return order;
    } catch (error) {
        console.error("Error creating order:", error);
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error creating order");
    }
};


const activeOrder = async (payload: any) => {
    try {
        // Extract order IDs from the payload
        let result = await Order.findOne({ _id: payload })
        if (!result) {
            throw new AppError(httpStatus.NOT_FOUND, `Order not found`)
        }

        const dealer = await Dealer.findOne({ _id: result.dealer })
        if (!dealer) {
            throw new AppError(httpStatus.NOT_FOUND, `Dealer not found`)
        }
        // Update the order status to "active"
        if (dealer.money >= result.total) {


            await result.updateOne({ $set: { status: "active" } });
            // Optionally, deduct the dealer's money
            // user.money = user.money - total;
            // await user.save();
            dealer.money = dealer.money - result.total;
            await dealer.save();
        } else {
            throw new AppError(httpStatus.BAD_REQUEST, `Dealer does not have enough money`)
        }

       
        return result;
    } catch (error) {
      
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error Active order");
    }

}

const getOrder = async (id :string) => {
    try {
        const order = await Order.find({dealer:id}).populate("product.product dealer")
        return order;
    } catch (error) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error getting order");
    }
}

const getDraftOrder = async (id: string) => {
    try {
        const order = await Order.find({ orderType: "draft" , dealer: id}).populate("product.product dealer")
        return order;
    } catch (error) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error getting order");
    }
}

const cancelOrder = async (id: string) => {
    try {
        const order = await Order.findById(id)
        if (!order) {
            throw new AppError(httpStatus.NOT_FOUND, `Order not found`)
        }
        // Update the order status to "canceled"
        await order.updateOne({ $set: { status: "canceled" } });
      
        let dealer = await Dealer.findById(order.dealer);
        if (!dealer) {
            throw new AppError(httpStatus.NOT_FOUND, `Dealer not found`)
        }
        dealer.money = dealer.money + order.total;
        await dealer.save();
        return order;
    } catch (error) {
        console.log(error);
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error cancel order");
    }
}

const getCancelOrder = async (id:string) => {
    try {
        const order = await Order.find({ status: "canceled",dealer: id }).populate("product.product dealer")
        return order;
    } catch (error) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error getting order");
    }
}

const deleteOrder = async (id: string) => {
    try {
        const order = await Order.findById(id)
        if (!order) {
            throw new AppError(httpStatus.NOT_FOUND, `Order not found`)
        }
        // Delete the order
        await order.deleteOne();
        console.log(`${order} order was deleted.`);
        return order;
    } catch (error) {
        console.log(error);
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error delete order");
    }
}


export const OrderServices = {
    createOrder,
    activeOrder,
    getOrder,
    getDraftOrder,
    cancelOrder,
    getCancelOrder,
    deleteOrder 
}
