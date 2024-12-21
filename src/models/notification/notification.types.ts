export type NotificationType = 'MESSAGE' | 'BOOKING' | 'DISH' | 'SYSTEM';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  data?: {
    conversationId?: string;
    bookingId?: string;
    dishId?: string;
  };
  createdAt: Date;
}

export interface NotificationFilters {
  userId?: string;
  type?: NotificationType;
  isRead?: boolean;
  fromDate?: Date;
  toDate?: Date;
}

export interface NotificationSortOptions {
  field: keyof Notification;
  direction: 'asc' | 'desc';
}

export interface NotificationResponse {
  notifications: Notification[];
  totalCount: number;
  unreadCount: number;
}

export interface UseNotificationsOptions {
  userId: string;
  pageSize?: number;
  initialPage?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
} 