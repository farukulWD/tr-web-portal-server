import mongoose, { model, Schema } from 'mongoose';
import { IBalance } from './balance.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const BalanceSchema = new Schema<IBalance>(
  {
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dealer',
      required: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount must be a positive number.'],
    },
    receivedBank: {
      type: String,
      required: true,
    },
    senderBank: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

BalanceSchema.pre('save', async function (next) {
  const dealerExists = await mongoose.models.Dealer.exists({
    _id: this.dealer,
  });
  if (!dealerExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Dealer not found.');
  }

  await mongoose.models.Dealer.findByIdAndUpdate(this.dealer, {
    $inc: { money: this.amount },
  });

  next();
});

export const Balance = model<IBalance>('Balance', BalanceSchema);
