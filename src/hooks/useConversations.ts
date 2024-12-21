import { useState, useEffect } from 'react';
import { Conversation } from '../models/message/message.types';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des conversations');
      }
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const createConversation = async (dishId: string, otherUserId: string) => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dishId,
          otherUserId,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la conversation');
      }

      const newConversation = await response.json();
      await fetchConversations();
      return newConversation;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      return null;
    }
  };

  return {
    conversations,
    isLoading,
    error,
    createConversation,
    refreshConversations: fetchConversations
  };
} 