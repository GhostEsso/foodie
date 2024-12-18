"use client";

import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Message {
  id: string;
  content: string;
  senderId: string;
  isRead: boolean;
  createdAt: string;
  conversation: {
    id: string;
    otherUser: {
      name: string;
    };
    dish: {
      title: string;
    };
  };
}

export function MessageMenu() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetchUnreadCount();
    fetchRecentMessages();
    const interval = setInterval(() => {
      fetchUnreadCount();
      fetchRecentMessages();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch("/api/messages/unread-count");
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des messages non lus:", error);
    }
  };

  const fetchRecentMessages = async () => {
    try {
      const response = await fetch("/api/messages/recent");
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des messages récents:", error);
    }
  };

  return (
    <div className="relative">
      <Link
        href="/messages"
        className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
        onClick={(e) => {
          if (isOpen) {
            e.preventDefault();
            setIsOpen(false);
          }
        }}
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
      </Link>

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
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <Link
                      key={message.id}
                      href={`/messages?conversation=${message.conversation.id}`}
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