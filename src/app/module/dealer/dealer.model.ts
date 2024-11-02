import mongoose, { Schema } from "mongoose";

const dealerSchema=new Schema({
    code:{
        type:String,
        required:true,
        unique:true
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    }

})