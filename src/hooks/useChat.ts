import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, ChatWindowProps, SendMessageData } from '../models/message/message.types';
import { MessageService } from '../services/message.service';

export function useChat({ conversationId, currentUserId, otherUser }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messageService = new MessageService();

  const fetchMessages = useCallback(async () => {
    try {
      const data = await messageService.getMessages(conversationId, {
        isRead: undefined,
      }, {
        field: 'createdAt',
        direction: 'desc'
      });
      
      setMessages(data.map(msg => ({
        id: msg.id,
        content: msg.content,
        senderId: msg.sender.id,
        createdAt: msg.createdAt.toISOString(),
        isRead: msg.isRead
      })));
    } catch (error) {
      console.error("Erreur lors de la récupération des messages:", error);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    if (messages.length > 0 && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const isScrolledToBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
      
      if (isScrolledToBottom) {
        scrollToBottom();
      }
    }
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  const sendMessage = async (messageData: SendMessageData) => {
    setIsLoading(true);
    try {
      await messageService.sendMessage(
        conversationId,
        currentUserId,
        messageData.receiverId,
        messageData.content
      );

      setNewMessage("");
      await fetchMessages();
      scrollToBottom();
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage({
        content: newMessage,
        receiverId: otherUser.id,
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    isLoading,
    handleSubmit,
    messagesContainerRef,
    currentUserId
  };
} 