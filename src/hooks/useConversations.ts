import { useState, useEffect, useCallback } from 'react';
import { Conversation, UseConversationsOptions } from '../models/message/message.types';
import { MessageService } from '../services/message.service';

export function useConversations({ userId, pageSize = 10, initialPage = 1 }: UseConversationsOptions) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const messageService = new MessageService();

  const fetchConversations = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await messageService.getConversations(userId, page, pageSize);
      
      if (page === 1) {
        setConversations(data.conversations);
      } else {
        setConversations(prev => [...prev, ...data.conversations]);
      }
      
      setTotalCount(data.totalCount);
      setHasMore(data.conversations.length === pageSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [userId, pageSize]);

  useEffect(() => {
    fetchConversations(initialPage);
  }, [fetchConversations, initialPage]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchConversations(nextPage);
    }
  }, [currentPage, fetchConversations, hasMore, isLoading]);

  const refreshConversations = useCallback(() => {
    setCurrentPage(1);
    fetchConversations(1);
  }, [fetchConversations]);

  const markConversationAsRead = useCallback(async (conversationId: string) => {
    try {
      await messageService.markConversationAsRead(conversationId, userId);
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
    } catch (err) {
      console.error('Erreur:', err);
    }
  }, [userId]);

  return {
    conversations,
    isLoading,
    error,
    hasMore,
    totalCount,
    loadMore,
    refreshConversations,
    markConversationAsRead
  };
} 