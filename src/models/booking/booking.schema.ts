import { z } from 'zod';

export const BookingSchema = z.object({
  dishId: z.string().uuid(),
  userId: z.string().uuid(),
  pickupTime: z.date(),
  portions: z.number().int().positive(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']).default('PENDING'),
  total: z.number().positive()
});

export const BookingUpdateSchema = BookingSchema.partial().extend({
  id: z.string().uuid()
});

export type BookingSchemaType = z.infer<typeof BookingSchema>;
export type BookingUpdateSchemaType = z.infer<typeof BookingUpdateSchema>; 