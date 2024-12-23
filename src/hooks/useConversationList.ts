import { useState, useEffect } from "react";
import {
    Conversation,
    ConversationListProps,
    ConversationListState
} from "../models/chat/conversation-list.types";

export function useConversationList({ onSelectConversation }: ConversationListProps) {
  const [state, setState] = useState<ConversationListState>({
    conversations: [],
    selectedConversation: null,
    isLoading: true
  });

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/conversations");
      if (response.ok) {
        const data = await response.json();
        setState(prev => ({
          ...prev,
          conversations: data
        }));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des conversations:", error);
    } finally {
      setState(prev => ({
        ...prev,
        isLoading: false
      }));
    }
  };

  const handleConversationClick = (conversation: Conversation) => {
    setState(prev => ({
      ...prev,
      selectedConversation: conversation.id
    }));
    onSelectConversation?.(conversation);
  };

  return {
    conversations: state.conversations,
    selectedConversation: state.selectedConversation,
    isLoading: state.isLoading,
    handleConversationClick
  };
} 