export interface Notification {
  id: string;
  type: string;
  message: string;
  userId: string;
  isRead: boolean;
  data?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationFilters {
  isRead?: boolean;
  type?: string;
}

export interface NotificationSortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
} 