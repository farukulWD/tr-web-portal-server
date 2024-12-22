import { Document, Schema } from "mongoose";

export interface IProduct {
    productCode: string;
    price: number;
    quantity: number; // Quantity for this specific product
}
export interface IOrder extends Document{
    _id : string;
    orderCode: string;
    dealerCode: string;
    product: IProduct[];
    total: number;
    status: string;
    approved: boolean;

}