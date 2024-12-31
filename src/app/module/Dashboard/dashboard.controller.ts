import { Request, Response } from 'express';
import { Order } from '../Order/order.model'; // Assuming the Order model is imported here
import mongoose from 'mongoose';

// Utility function to format the start and end of a week
const getWeekStartAndEnd = (date: Date) => {
    const start = new Date(date);
    const end = new Date(date);

    // Set to the beginning of the week (assuming Sunday is the start)
    start.setDate(start.getDate() - start.getDay());

    // Set to the end of the week (Saturday)
    end.setDate(end.getDate() + (6 - end.getDay()));

    return { start, end };
};

// Dashboard Controller
export const getDashboardData = async (req: Request, res: Response) => {
    try {
        // Date parameters for analysis (e.g., last 30 days, specific range)
        const { startDate, endDate } = req.query;

        // Basic filter object for the query
        let dateFilter: any = {};

        if (startDate && endDate) {
            dateFilter = {
                createdAt: {
                    $gte: new Date(startDate as string),
                    $lte: new Date(endDate as string),
                },
            };
        } else {
            // Defaults to the last 30 days if no date range is provided
            const last30Days = new Date();
            last30Days.setDate(last30Days.getDate() - 30);
            dateFilter = { createdAt: { $gte: last30Days } };
        }

        // 1. **Monthly Analysis**
        const monthlyOrders = await Order.aggregate([
            {
                $match: dateFilter,
            },
            {
                $project: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    total: 1,
                },
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month" },
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$total" },
                },
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } }, // Sort by latest first
        ]);

        // 2. **Daily Analysis**
        const dailyOrders = await Order.aggregate([
            {
                $match: dateFilter,
            },
            {
                $project: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    total: 1,
                },
            },
            {
                $group: {
                    _id: "$date",
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$total" },
                },
            },
            { $sort: { "_id": -1 } }, // Sort by latest date first
        ]);

        // 3. **Weekly Analysis**
        const weeklyOrders = await Order.aggregate([
            {
                $match: dateFilter,
            },
            {
                $project: {
                    weekStart: {
                        $dateToString: { format: "%Y-%m-%d", date: { $subtract: ["$createdAt", { $dayOfWeek: "$createdAt" }] } },
                    },
                    total: 1,
                },
            },
            {
                $group: {
                    _id: "$weekStart",
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$total" },
                },
            },
            { $sort: { "_id": -1 } }, // Sort by latest week first
        ]);

        // 4. **Product-wise Analysis**
        const productWiseOrders = await Order.aggregate([
            {
                $unwind: "$product", // Unwind the product array to analyze each product in the order
            },
            {
                $group: {
                    _id: "$product.product", // Group by product ID
                    totalQuantity: { $sum: "$product.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$product.quantity", "$product.price"] } },
                },
            },
            {
                $lookup: {
                    from: "products", // Assuming the Product collection is named "products"
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            {
                $unwind: "$productDetails",
            },
            {
                $project: {
                    productName: "$productDetails.name", // Assuming each product has a 'name' field
                    totalQuantity: 1,
                    totalRevenue: 1,
                },
            },
            { $sort: { totalRevenue: -1 } }, // Sort by total revenue
        ]);

        // 5. **User-wise Analysis (by Dealer)**
        const userWiseOrders = await Order.aggregate([
            {
                $match: dateFilter,
            },
            {
                $group: {
                    _id: "$dealer", // Group by dealer (user)
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$total" },
                },
            },
            {
                $lookup: {
                    from: "dealers", // Assuming the Dealer collection is named "dealers"
                    localField: "_id",
                    foreignField: "_id",
                    as: "dealerDetails",
                },
            },
            {
                $unwind: "$dealerDetails",
            },
            {
                $project: {
                    dealerName: "$dealerDetails.name", // Assuming each dealer has a 'name' field
                    totalOrders: 1,
                    totalRevenue: 1,
                },
            },
            { $sort: { totalRevenue: -1 } }, // Sort by total revenue
        ]);

        // Send the aggregated data in the response
        res.status(200).json({
            monthlyOrders,
            dailyOrders,
            weeklyOrders,
            productWiseOrders,
            userWiseOrders,
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Error fetching dashboard data" });
    }
};
