import { prisma } from '../lib/prisma';
import {
    NotificationFilters,
    NotificationSortOptions,
    NotificationResponse,
    NotificationType
} from '../models/notification/notification.types';

export class NotificationService {
  async getNotifications(
    userId: string,
    filters?: NotificationFilters,
    sort?: NotificationSortOptions,
    page: number = 1,
    pageSize: number = 10
  ): Promise<NotificationResponse> {
    const skip = (page - 1) * pageSize;

    const [notifications, totalCount, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: {
          userId,
          ...(filters?.isRead !== undefined && { isRead: filters.isRead }),
          ...(filters?.type && { type: filters.type }),
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
          ...(filters?.isRead !== undefined && { isRead: filters.isRead }),
          ...(filters?.type && { type: filters.type }),
          ...(filters?.fromDate && { createdAt: { gte: filters.fromDate } }),
          ...(filters?.toDate && { createdAt: { lte: filters.toDate } })
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
      notifications: notifications.map(notification => ({
        ...notification,
        createdAt: notification.createdAt.toISOString(),
        updatedAt: notification.updatedAt.toISOString()
      })),
      totalCount,
      unreadCount
    };
  }

  async createNotification(
    userId: string,
    type: NotificationType,
    message: string
  ) {
    return prisma.notification.create({
      data: {
        userId,
        type,
        message,
        isRead: false
      }
    });
  }

  async markAsRead(notificationId: string) {
    return prisma.notification.update({
      where: {
        id: notificationId
      },
      data: {
        isRead: true
      }
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: {
        isRead: true
      }
    });
  }

  async deleteNotification(notificationId: string) {
    return prisma.notification.delete({
      where: {
        id: notificationId
      }
    });
  }
} 