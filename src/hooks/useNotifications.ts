import { useState, useEffect, useCallback } from 'react';
import {
    Notification, UseNotificationsOptions
} from '../models/notification/notification.types';
import { NotificationService } from '../services/notification.service';

export function useNotifications({ 
  userId, 
  pageSize = 10, 
  initialPage = 1,
  autoRefresh = true,
  refreshInterval = 30000 
}: UseNotificationsOptions) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalCount, setTotalCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const notificationService = new NotificationService();

  const fetchNotifications = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await notificationService.getNotifications(userId, page, pageSize);
      
      if (page === 1) {
        setNotifications(data.notifications);
      } else {
        setNotifications(prev => [...prev, ...data.notifications]);
      }
      
      setTotalCount(data.totalCount);
      setUnreadCount(data.unreadCount);
      setHasMore(data.notifications.length === pageSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [userId, pageSize, notificationService]);

  useEffect(() => {
    fetchNotifications(initialPage);
  }, [fetchNotifications, initialPage]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchNotifications(1);
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, fetchNotifications]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchNotifications(nextPage);
    }
  }, [currentPage, fetchNotifications, hasMore, isLoading]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, isRead: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Erreur:', err);
    }
  }, [notificationService]);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead(userId);
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Erreur:', err);
    }
  }, [userId, notificationService]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
      setTotalCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Erreur:', err);
    }
  }, [notificationService]);

  const clearAllNotifications = useCallback(async () => {
    try {
      await notificationService.deleteAllNotifications(userId);
      setNotifications([]);
      setTotalCount(0);
      setUnreadCount(0);
    } catch (err) {
      console.error('Erreur:', err);
    }
  }, [userId, notificationService]);

  return {
    notifications,
    isLoading,
    error,
    hasMore,
    totalCount,
    unreadCount,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    refreshNotifications: () => fetchNotifications(1)
  };
} 