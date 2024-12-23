import { useState, useEffect, useCallback } from "react";
import { MessageMenuState } from "../models/message/message-menu.types";
import { useMessages } from "./useMessages";

export function useMessageMenu() {
  const [state, setState] = useState<MessageMenuState>({
    unreadCount: 0,
    isOpen: false,
    messages: [],
    isLoading: true
  });

  const { getUnreadCount, getRecentMessages } = useMessages();

  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadCount();
      setState(prev => ({
        ...prev,
        unreadCount: count
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des messages non lus:", error);
    }
  }, [getUnreadCount]);

  const fetchRecentMessages = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const messages = await getRecentMessages();
      setState(prev => ({
        ...prev,
        messages,
        isLoading: false
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des messages récents:", error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [getRecentMessages]);

  const toggleMenu = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const closeMenu = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    fetchRecentMessages();
    const interval = setInterval(() => {
      fetchUnreadCount();
      fetchRecentMessages();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount, fetchRecentMessages]);

  return {
    ...state,
    fetchUnreadCount,
    fetchRecentMessages,
    toggleMenu,
    closeMenu
  };
} 