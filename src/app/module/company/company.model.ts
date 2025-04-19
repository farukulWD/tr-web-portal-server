import { model, Schema } from 'mongoose';
import { ICompany } from './company.interface';

const companySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true, unique: true },
    userId: {
      type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    address: {
      address: {
        type: String,
        default: '',
      },
      city: {
        type: String,
        default: '',
      },
      thana: {
        type: String,
        default: '',
      },
      postal: {
        type: Number,
        default: '',
      },
      country: {
        type: String,
        enum: ['Bangladesh'],
        default: 'Bangladesh',
      },
    },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String, required: true },
    deliveredAmount: { type: Number, default: 0 },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tradeLicensePic: {
        type: String,
        required: true,
    }


   
  },
  {
    timestamps: true,
  }
);

export const Company = model<ICompany>('company', companySchema);
