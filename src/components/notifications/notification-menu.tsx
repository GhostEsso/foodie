"use client";

import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationMenuProps } from "../../models/notification/notification-menu.types";
import { useNotificationMenu } from "../../hooks/useNotificationMenu";
import { cn } from "../../lib/utils";

export function NotificationMenu({ className }: NotificationMenuProps) {
  const {
    isOpen,
    notifications,
    isLoading,
    unreadCount,
    toggleMenu,
    closeMenu,
    markAsRead,
    formatMessage
  } = useNotificationMenu();

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={toggleMenu}
        className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
        aria-label="Notifications"
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
              onClick={closeMenu}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-80 rounded-xl shadow-xl bg-white ring-1 ring-black/5 z-20 overflow-hidden"
            >
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto divide-y divide-gray-100">
                {isLoading ? (
                  <div className="p-4">
                    <div className="animate-pulse space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/3" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                          <div className="h-3 bg-gray-200 rounded w-3/4" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : notifications.length > 0 ? (
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
                          __html: formatMessage({ message: notification.message }) 
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