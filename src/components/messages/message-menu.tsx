"use client";

import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { MessageMenuProps } from "../../models/message/message-menu.types";
import { useMessageMenu } from "../../hooks/useMessageMenu";
import { cn } from "../../lib/utils";

export function MessageMenu({ className }: MessageMenuProps) {
  const {
    unreadCount,
    isOpen,
    messages,
    isLoading,
    toggleMenu,
    closeMenu
  } = useMessageMenu();

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
        onClick={toggleMenu}
        aria-label="Messages"
      >
        <MessageSquare className={`h-6 w-6 transition-colors duration-200 ${unreadCount > 0 ? 'text-primary-500' : ''}`} />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute top-6 -right-6 transform"
            >
              <div className="flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[10px] font-bold text-white bg-gradient-to-r from-blue-500 to-primary-500 rounded-full shadow-lg">
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
                ) : messages.length > 0 ? (
                  messages.map((message) => (
                    <Link
                      key={message.id}
                      href={`/messages?conversation=${message.conversation.id}`}
                      onClick={closeMenu}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                          !message.isRead ? 'bg-primary-50/60' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900 truncate">
                              {message.conversation.otherUser.name}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              {message.conversation.dish.title}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {message.content}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 whitespace-nowrap">
                            {formatDistanceToNow(new Date(message.createdAt), {
                              addSuffix: true,
                              locale: fr,
                            })}
                          </p>
                        </div>
                      </motion.div>
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-8 text-sm text-gray-500 text-center">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    Aucun message
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