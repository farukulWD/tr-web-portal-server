import mongoose, { model, Schema, Document } from "mongoose";
import { TUser, UserModel } from "../users/user.interface";


export interface TDealer extends TUser {
    shopName:string;
    code: string;
    userId: mongoose.Types.ObjectId;
    nidNo: string;
    nidPic: string;
    refName: string;
    refNidNo: string;
    refNid: string;
    refMobile: string;
    refPhoto: string;
    class: string;
    group: string;
    money: number;
    mobile:string;
}

// Define the schema
const dealerSchema = new Schema<TDealer>({
    shopName:{
        type:String,
        required:true,
        
    },
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

    refNidNo: {
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
    mobile:{
        type:String,
        required:true,
        unique:true
    },
    money: {
        type: Number,
        default: 0,
        },



});
// Pre-save hook
// dealerSchema.pre('save', async function (next) {
//     if (!this.isNew || this.code) {
//         // If it's not a new document or productCode is already set, skip
//         return next();
//     }

//     let isUnique = false;
//     while (!isUnique) {
//         // Generate a random 6-digit number
//         const code = Math.floor(100000 + Math.random() * 900000);

//         // Check if the code already exists in the database
//         const existingProduct = await mongoose.models.Order.findOne({ productCode: code });

//         if (!existingProduct) {
//             // If no existing product has this code, assign it and exit the loop
//             this.code = code.toString();
//             isUnique = true;
//         }
//     }
//     next();
// });

// Create and export the model
export const Dealer = model<TDealer>("Dealer", dealerSchema);
