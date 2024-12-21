import { z } from 'zod';

export const MessageSchema = z.object({
  content: z.string().min(1).max(1000),
  senderId: z.string().uuid(),
  receiverId: z.string().uuid(),
  conversationId: z.string().uuid(),
  isRead: z.boolean().default(false)
});

export const MessageUpdateSchema = MessageSchema.partial().extend({
  id: z.string().uuid()
});

export type MessageSchemaType = z.infer<typeof MessageSchema>;
export type MessageUpdateSchemaType = z.infer<typeof MessageUpdateSchema>; 