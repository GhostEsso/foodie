"use client";

import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

function formatMessage(message: string): string {
  return message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

export function NotificationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "POST",
      });
      if (response.ok) {
        setNotifications(notifications.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        ));
      }
    } catch (error) {
      console.error("Erreur lors du marquage de la notification comme lue:", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
      >
        <Bell className={`h-6 w-6 transition-colors duration-200 ${unreadCount > 0 ? 'text-primary-500' : ''}`} />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2"
            >
              <div className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg">
                {unreadCount}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10 bg-black/5 backdrop-blur-sm" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-80 rounded-xl shadow-xl bg-white ring-1 ring-black/5 z-20 overflow-hidden"
            >
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto divide-y divide-gray-100">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                        !notification.isRead ? 'bg-primary-50/60' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <p 
                        className="text-sm text-gray-900"
                        dangerouslySetInnerHTML={{ 
                          __html: formatMessage(notification.message) 
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-sm text-gray-500 text-center">
                    <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    Aucune notification
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 