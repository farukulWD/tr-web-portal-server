import mongoose, { model, Schema, Document } from "mongoose";
import { TUser, UserModel } from "../users/user.interface";


export interface TDealer extends TUser {
    code: string;
    userId: mongoose.Types.ObjectId;
    nidNo: string;
    nidPic: string;
    refName: string;
    ref: string;
    refNid: string;
    refMobile: string;
    refPhoto: string;
    class: string;
    group: string;
    money: number;
}

// Define the schema
const dealerSchema = new Schema<TDealer>({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    nidNo: {
        type: String,
        required: true
    },
    nidPic: {
        type: String,
        required: true
    },

    ref: {
        type: String,
        required: true
    },
    refNid: {
        type: String,
        required: true
    },
    refMobile: {
        type: String,
        required: true
    },
    refPhoto: {
        type: String,
        required: true
    },
    class: {
        type: String,
    },
    group: {
        type: String,
    },
    money: {
        type: Number,
        default: 0,
        },



});

// Create and export the model
export const Dealer = model<TDealer>("Dealer", dealerSchema);
