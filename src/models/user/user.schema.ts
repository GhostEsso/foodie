import { z } from 'zod';

export const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2).max(50),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
  googleId: z.string().optional(),
  apartment: z.string().optional(),
  buildingId: z.string().uuid().optional(),
  isBlocked: z.boolean().default(false),
  emailVerified: z.boolean().default(false),
  verificationCode: z.string().optional(),
  verificationCodeExpires: z.date().optional()
});

export const UserUpdateSchema = UserSchema.partial().extend({
  id: z.string().uuid()
});

export type UserSchemaType = z.infer<typeof UserSchema>;
export type UserUpdateSchemaType = z.infer<typeof UserUpdateSchema>; 