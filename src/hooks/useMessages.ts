import { useState, useEffect } from 'react';
import { Message, Conversation } from '../models/message/message.types';

export function useMessages(conversationId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  const fetchMessages = async () => {
    if (!conversationId) return;
    
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des messages');
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string, receiverId: string) => {
    if (!conversationId) return;

    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          receiverId,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message');
      }

      await fetchMessages();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  const markAsRead = async () => {
    if (!conversationId) return;

    try {
      await fetch(`/api/conversations/${conversationId}/read`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Erreur lors du marquage des messages comme lus:', error);
    }
  };

  return {
    messages,
    conversation,
    isLoading,
    error,
    sendMessage,
    markAsRead,
    refreshMessages: fetchMessages
  };
} 