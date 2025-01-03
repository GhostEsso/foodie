import { useState, useCallback, useEffect } from 'react';
import { NotificationMenuState, FormatMessageOptions } from '../models/notification/notification-menu.types';

export function useNotificationMenu() {
  const [state, setState] = useState<NotificationMenuState>({
    isOpen: false,
    notifications: [],
    isLoading: true
  });

  const fetchNotifications = useCallback(async () => {
    try {
      console.log('Récupération des notifications...');
      setState(prev => ({ ...prev, isLoading: true }));
      
      const response = await fetch('/api/notifications', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des notifications');
      }
      
      const data = await response.json();
      console.log('Notifications reçues:', data);
      
      setState(prev => ({
        ...prev,
        notifications: data.notifications || [],
        isLoading: false
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      console.log('Marquage de la notification comme lue:', notificationId);
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notificationId }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Erreur lors du marquage de la notification');
      }

      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      }));
    } catch (error) {
      console.error("Erreur lors du marquage de la notification comme lue:", error);
    }
  }, []);

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
    console.log('Initialisation des notifications');
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