import { z } from 'zod';

// Reusable address schema
const AddressSchema = z.object({
  address: z.string().optional().default(''),
  city: z.string().optional().default(''),
  thana: z.string().optional().default(''),
  postal: z.union([z.string(), z.number()]).optional().default(''),
  country: z.enum(['Bangladesh']).optional().default('Bangladesh'),
});

// Main company validation schema (follows same pattern as userValidationSchema)
const companyValidationSchema = z.object({
  body: z.object({
    companyData: z.object({
      name: z.string().min(1, { message: 'Company name is required' }),
      address: AddressSchema,
      phone: z.string().min(1, { message: 'Phone is required' }),
      email: z.string().email({ message: 'Invalid email address' }),
      website: z.string().url({ message: 'Invalid website URL' }),
      deliveredAmount: z.number().optional().default(0),
      userId: z.string({ message: 'User ID is required' }),
      createdBy: z.string().optional(),
    }),
  }),
});
export type CompanyInput = z.infer<typeof companyValidationSchema>['body']['companyData'];

export { companyValidationSchema };
