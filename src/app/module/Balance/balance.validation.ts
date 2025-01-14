import { Types } from 'mongoose';
import { z } from 'zod';

export const BalanceValidationSchema = z.object({
  body: z.object({
    dealer: z.string().refine(value => Types.ObjectId.isValid(value), {
      message: 'Invalid dealer ObjectId.',
    }),
    amount: z
      .number()
      .positive('Amount must be a positive number.')
      .min(0.01, 'Amount must be greater than zero.'),
    transactionNo: z.string().min(1, 'Transaction number is required.'),
    receivedBank: z.string().min(1, 'Received bank is required.'),
    senderBank: z.string().min(1, 'Sender bank is required.'),
  }),
});
