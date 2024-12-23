import { useState, useEffect, useCallback } from "react";
import { NotificationMenuState, FormatMessageOptions } from "../models/notification/notification-menu.types";
import { useNotifications } from "./useNotifications";

export function useNotificationMenu() {
  const [state, setState] = useState<NotificationMenuState>({
    isOpen: false,
    notifications: [],
    isLoading: true
  });

  const { getNotifications, markNotificationAsRead } = useNotifications();

  const fetchNotifications = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const notifications = await getNotifications();
      setState(prev => ({
        ...prev,
        notifications,
        isLoading: false
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [getNotifications]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      }));
    } catch (error) {
      console.error("Erreur lors du marquage de la notification comme lue:", error);
    }
  }, [markNotificationAsRead]);

  const toggleMenu = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const closeMenu = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const formatMessage = useCallback(({ message, boldPattern = /\*\*(.*?)\*\*/g }: FormatMessageOptions): string => {
    return message.replace(boldPattern, '<strong>$1</strong>');
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = state.notifications.filter(n => !n.isRead).length;

  return {
    ...state,
    unreadCount,
    fetchNotifications,
    markAsRead,
    toggleMenu,
    closeMenu,
    formatMessage
  };
} 