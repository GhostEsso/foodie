"use client";

import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { MessageSquare } from "lucide-react";
import { useConversationList } from "../../hooks/useConversationList";
import { ConversationListProps } from "../../models/chat/conversation-list.types";

export function ConversationList(props: ConversationListProps) {
  const {
    conversations,
    selectedConversation,
    isLoading,
    handleConversationClick
  } = useConversationList(props);

  if (isLoading) {
    return <div className="p-4 text-center">Chargement...</div>;
  }

  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center">
        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Aucune conversation</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
            selectedConversation === conversation.id ? "bg-primary-50" : ""
          }`}
          onClick={() => handleConversationClick(conversation)}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0">
              {conversation.dish.images[0] ? (
                <img
                  src={conversation.dish.images[0]}
                  alt={conversation.dish.title}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <MessageSquare className="h-6 w-6" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900 truncate">
                  {conversation.otherUser.name}
                </h3>
                {conversation.lastMessage && (
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 truncate">
                {conversation.dish.title}
              </p>
              {conversation.lastMessage && (
                <p className="text-sm text-gray-600 truncate">
                  {conversation.lastMessage.content}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 