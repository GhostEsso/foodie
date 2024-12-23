"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useMessages } from '../../hooks/useMessages';
import { formatRelativeTime } from '../../lib/utils';
import { Send } from 'lucide-react';

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
  otherUser: {
    id: string;
    name: string;
  };
  dish: {
    title: string;
  };
}

export function ChatWindow({
  conversationId,
  currentUserId,
  otherUser,
  dish
}: ChatWindowProps) {
  const { messages, sendMessage } = useMessages(conversationId);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    await sendMessage(messageText, otherUser.id);
    setMessageText("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* En-tête */}
      <div className="p-4 border-b">
        <h2 className="font-semibold">{otherUser.name}</h2>
        <p className="text-sm text-gray-500">À propos de : {dish.title}</p>
      </div>

      {/* Zone des messages avec scroll dédié */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === currentUserId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.senderId === currentUserId
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.senderId === currentUserId
                    ? 'text-primary-100'
                    : 'text-gray-500'
                }`}
              >
                {formatRelativeTime(new Date(message.createdAt))}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Formulaire d'envoi */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 min-w-0 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Envoyer</span>
          </button>
        </div>
      </form>
    </div>
  );
} 