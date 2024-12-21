import { prisma } from '../lib/store';
import {
    Notification,
    NotificationFilters,
    NotificationSortOptions,
    NotificationResponse,
    NotificationType
} from '../models/notification/notification.types';

export class NotificationService {
  async getNotifications(
    userId: string,
    page: number = 1,
    pageSize: number = 10,
    filters?: NotificationFilters,
    sort?: NotificationSortOptions
  ): Promise<NotificationResponse> {
    const skip = (page - 1) * pageSize;

    const [notifications, totalCount, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: {
          userId,
          ...(filters?.type && { type: filters.type }),
          ...(filters?.isRead !== undefined && { isRead: filters.isRead }),
          ...(filters?.fromDate && { createdAt: { gte: filters.fromDate } }),
          ...(filters?.toDate && { createdAt: { lte: filters.toDate } })
        },
        orderBy: sort ? {
          [sort.field]: sort.direction
        } : {
          createdAt: 'desc'
        },
        skip,
        take: pageSize
      }),
      prisma.notification.count({
        where: {
          userId,
          ...(filters?.type && { type: filters.type }),
          ...(filters?.isRead !== undefined && { isRead: filters.isRead })
        }
      }),
      prisma.notification.count({
        where: {
          userId,
          isRead: false
        }
      })
    ]);

    return {
      notifications,
      totalCount,
      unreadCount
    };
  }

  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: Notification['data']
  ): Promise<Notification> {
    return prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data,
        isRead: false
      }
    });
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: {
        isRead: true
      }
    });
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await prisma.notification.delete({
      where: { id: notificationId }
    });
  }

  async deleteAllNotifications(userId: string): Promise<void> {
    await prisma.notification.deleteMany({
      where: { userId }
    });
  }

  // Méthodes utilitaires pour créer des notifications spécifiques
  async createMessageNotification(
    userId: string,
    senderName: string,
    messagePreview: string,
    conversationId: string
  ): Promise<Notification> {
    return this.createNotification(
      userId,
      'MESSAGE',
      `Nouveau message de ${senderName}`,
      messagePreview,
      { conversationId }
    );
  }

  async createBookingNotification(
    userId: string,
    status: string,
    dishTitle: string,
    bookingId: string
  ): Promise<Notification> {
    return this.createNotification(
      userId,
      'BOOKING',
      `Mise à jour de réservation`,
      `Votre réservation pour "${dishTitle}" est ${status}`,
      { bookingId }
    );
  }

  async createDishNotification(
    userId: string,
    action: string,
    dishTitle: string,
    dishId: string
  ): Promise<Notification> {
    return this.createNotification(
      userId,
      'DISH',
      `Mise à jour de plat`,
      `Le plat "${dishTitle}" a été ${action}`,
      { dishId }
    );
  }
} 