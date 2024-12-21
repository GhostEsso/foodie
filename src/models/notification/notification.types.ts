export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export enum NotificationType {
  BOOKING_REQUEST = "BOOKING_REQUEST",
  BOOKING_APPROVED = "BOOKING_APPROVED",
  BOOKING_REJECTED = "BOOKING_REJECTED",
  NEW_MESSAGE = "NEW_MESSAGE",
  DISH_LIKED = "DISH_LIKED"
}

export interface NotificationFilters {
  isRead?: boolean;
  type?: NotificationType;
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
  autoRefresh?: boolean;
  refreshInterval?: number;
  filters?: NotificationFilters;
  sort?: NotificationSortOptions;
} 