import { z } from 'zod';

// Enum values for role and status
const UserRoleEnum = z.enum(['superAdmin', 'user', 'admin']);
const UserStatusEnum = z.enum(['active', 'inactive']);

// Zod Schema
const userValidationSchema = z.object({
  body: z.object({
    userData: z.object({
    name: z.string().min(1, { message: 'Name is required' }).optional(),
    address: z
      .object({
        address: z.string().optional(),
        city: z.string().optional(),
        thana: z.string().optional(),
        postal: z.string().optional(),
        country: z.enum(['Bangladesh']).default('Bangladesh'),
      })
      .optional(),

    mobile: z.string().min(10, { message: 'Mobile number is required' }),

    profileImg: z.string().optional(),

    passwordChangedAt: z.date().optional(),

    role: UserRoleEnum.default('user').optional(),

    status: UserStatusEnum.default('active').optional(),

    isDeleted: z.boolean().default(false).optional(),
  }),
})
});

// For use in request validation middleware
export { userValidationSchema };
