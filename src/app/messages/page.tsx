"use client";

import { useState, useEffect } from "react";
import { ChatWindow } from "../../components/chat/chat-window";
import { ConversationList } from "../../components/chat/conversation-list";
import { Conversation } from "../../models/message/message.types";
import { LoadingPage } from "../../components/ui/loading";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  building: {
    id: string;
    name: string;
  } | null;
}

export default function MessagesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch('/api/auth/session');
        if (!response.ok) {
          throw new Error('Non authentifié');
        }
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, [router]);

  if (loading) {
    return <LoadingPage message="Chargement des messages..." />;
  }

  if (!user) {
    return null; // Le router.push s'en occupera
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-1/3 border-r">
        <ConversationList
          userId={user.id}
          selectedConversationId={selectedConversation?.id}
          onSelectConversation={(conversation: Conversation) => setSelectedConversation(conversation)}
        />
      </div>
      <div className="flex-1">
        {selectedConversation ? (
          <ChatWindow
            conversationId={selectedConversation.id}
            currentUserId={user.id}
            otherUser={selectedConversation.participants.find(p => p.id !== user.id)!}
            dish={selectedConversation.dish}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Sélectionnez une conversation pour commencer
          </div>
        )}
      </div>
    </div>
  );
} 