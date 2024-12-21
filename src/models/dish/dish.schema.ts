import { z } from 'zod';

export const DishSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().positive(),
  ingredients: z.array(z.string()),
  images: z.array(z.string().url()),
  available: z.boolean(),
  portions: z.number().int().positive(),
  availableFrom: z.date().optional(),
  availableTo: z.date().optional(),
  userId: z.string().uuid()
});

export const DishUpdateSchema = DishSchema.partial().extend({
  id: z.string().uuid()
});

export type DishSchemaType = z.infer<typeof DishSchema>;
export type DishUpdateSchemaType = z.infer<typeof DishUpdateSchema>; 