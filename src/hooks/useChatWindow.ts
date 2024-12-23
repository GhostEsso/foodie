import { useState, useEffect, useRef } from 'react';
import { useMessages } from './useMessages';
import { ChatWindowProps, ChatWindowState } from '../models/chat/chat-window.types';

export function useChatWindow({
  conversationId,
  currentUserId,
  otherUser
}: ChatWindowProps) {
  const { messages, sendMessage } = useMessages(conversationId);
  const [state, setState] = useState<ChatWindowState>({
    messageText: "",
    isScrolling: false
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state.isScrolling) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, state.isScrolling]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.messageText.trim()) return;
    
    await sendMessage(state.messageText, otherUser.id);
    setState(prev => ({ ...prev, messageText: "" }));
  };

  const setMessageText = (messageText: string) => {
    setState(prev => ({ ...prev, messageText }));
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isAtBottom = target.scrollHeight - target.scrollTop === target.clientHeight;
    setState(prev => ({ ...prev, isScrolling: !isAtBottom }));
  };

  return {
    messages,
    messageText: state.messageText,
    messagesEndRef,
    setMessageText,
    handleSubmit,
    handleScroll
  };
} 