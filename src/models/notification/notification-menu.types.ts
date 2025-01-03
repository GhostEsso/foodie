import { Notification } from "./notification.types";

export interface NotificationMenuProps {
  className?: string;
}

export interface NotificationMenuState {
  isOpen: boolean;
  notifications: Notification[];
  isLoading: boolean;
}

export interface NotificationMenuHandlers {
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  toggleMenu: () => void;
  closeMenu: () => void;
}

export interface FormatMessageOptions {
  message: string;
  boldPattern?: RegExp;
} 