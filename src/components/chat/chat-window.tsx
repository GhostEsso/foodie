"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Send } from "lucide-react";
import Button from "../ui/button";
import { useChat } from "../../hooks/useChat";
import { ChatWindowProps } from "../../models/message/message.types";

export function ChatWindow(props: ChatWindowProps) {
  const {
    messages,
    newMessage,
    setNewMessage,
    isLoading,
    handleSubmit,
    messagesContainerRef,
    currentUserId
  } = useChat(props);

  return (
    <div className="flex flex-col h-full">
      {/* En-tête fixe */}
      <div className="p-4 border-b bg-white">
        <h3 className="font-medium text-gray-900">{props.otherUser.name}</h3>
        <p className="text-sm text-gray-500">{props.dish.title}</p>
      </div>

      {/* Zone de messages scrollable */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ maxHeight: 'calc(100vh - 13rem)' }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.senderId === currentUserId
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.senderId === currentUserId
                    ? "text-primary-100"
                    : "text-gray-500"
                }`}
              >
                {formatDistanceToNow(new Date(message.createdAt), {
                  addSuffix: true,
                  locale: fr,
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Formulaire d'envoi fixe */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
} 