"use client";

import { useMessages } from '../../hooks/useMessages';
import { Conversation } from '../../models/message/message.types';
import { LoadingPage } from '../ui/loading';

interface ConversationListProps {
  userId: string;
  selectedConversationId?: string;
  onSelectConversation: (conversation: Conversation) => void;
}

export function ConversationList({
  userId,
  selectedConversationId,
  onSelectConversation
}: ConversationListProps) {
  const { conversations, isLoading, error } = useMessages();

  if (isLoading) {
    return <LoadingPage message="Chargement des conversations..." />;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        {error}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-center">
        Aucune conversation
      </div>
    );
  }

  return (
    <div className="divide-y">
      {conversations.map((conversation) => {
        const otherUser = conversation.participants.find(p => p.id !== userId)!;
        const lastMessage = conversation.messages[0];

        return (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
              selectedConversationId === conversation.id ? 'bg-primary-50' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {otherUser.name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {conversation.dish.title}
                </p>
                {lastMessage && (
                  <p className="mt-1 text-sm text-gray-600 truncate">
                    {lastMessage.content}
                  </p>
                )}
              </div>
              {lastMessage && (
                <div className="text-xs text-gray-400">
                  {new Date(lastMessage.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
} 