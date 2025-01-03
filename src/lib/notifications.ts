import { prisma } from "./prisma";

interface CreateNotificationParams {
  userId: string;
  type: string;
  message: string;
  data?: Record<string, any>;
}

export async function createNotification({
  userId,
  type,
  message,
  data = {}
}: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        message,
        data,
        read: false
      }
    });

    return notification;
  } catch (error) {
    console.error("Erreur lors de la création de la notification:", error);
    throw error;
  }
} 