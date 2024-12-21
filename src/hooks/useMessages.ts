import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Conversation } from '../models/message/message.types';

export function useMessages() {
  const { data: session, status } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConversations() {
      if (status === "authenticated") {
        try {
          const response = await fetch('/api/messages');
          if (!response.ok) {
            throw new Error('Erreur lors de la récupération des conversations');
          }
          const data = await response.json();
          setConversations(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchConversations();
  }, [status]);

  async function sendMessage(conversationId: string, content: string) {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversationId, content }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message');
      }

      const newMessage = await response.json();
      return newMessage;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Une erreur est survenue');
    }
  }

  return {
    conversations,
    isLoading,
    error,
    sendMessage,
    session,
    status
  };
} 