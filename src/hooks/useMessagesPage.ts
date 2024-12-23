import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Conversation, Session } from "../models/conversation/conversation.types";

export function useMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchSession = async () => {
      const response = await fetch("/api/auth/session");
      const data = await response.json();
      setSession(data);
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const conversationId = searchParams.get("conversation");
    if (conversationId) {
      const fetchConversation = async () => {
        try {
          const response = await fetch(`/api/conversations/${conversationId}`);
          if (response.ok) {
            const conversation = await response.json();
            setSelectedConversation(conversation);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de la conversation:", error);
        }
      };
      fetchConversation();
    }
  }, [searchParams]);

  return {
    selectedConversation,
    setSelectedConversation,
    session
  };
} 