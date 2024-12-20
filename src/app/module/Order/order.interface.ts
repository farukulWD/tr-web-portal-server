import { Document, Schema } from "mongoose";


export interface IOrder extends Document{
    _id : string;
    dealerCode: string;
    product: string;
    quantity: number;
    price: number;
    total: number;
    status: string;
    approved: boolean;

}