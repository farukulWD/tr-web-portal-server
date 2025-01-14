import { Document, Schema, Types } from "mongoose";

export interface IProduct {
    product: Schema.Types.ObjectId;
    price: number;
    quantity: number; 
}
export interface IOrder extends Document{
    _id : string;
    orderCode: string;
    dealer: Schema.Types.ObjectId;
    product: IProduct[];
    total: number;
    status: string;
    approved: boolean;
    orderType: string;

}