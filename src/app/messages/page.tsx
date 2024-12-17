"use client";

import React, { useState } from "react";
import { ConversationList } from "../../components/chat/conversation-list";
import { ChatWindow } from "../../components/chat/chat-window";
import { MessageSquare } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Conversation {
  id: string;
  otherUser: {
    id: string;
    name: string;
  };
  dish: {
    title: string;
  };
}

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [session, setSession] = useState<any>(null);
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const fetchSession = async () => {
      const response = await fetch("/api/auth/session");
      const data = await response.json();
      setSession(data);
    };
    fetchSession();
  }, []);

  React.useEffect(() => {
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          {/* Liste des conversations */}
          <div className="border-r h-full overflow-y-auto">
            <div className="p-4 border-b sticky top-0 bg-white z-10">
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages
              </h1>
            </div>
            <ConversationList
              onSelectConversation={setSelectedConversation}
            />
          </div>

          {/* Fenêtre de chat */}
          <div className="col-span-2 flex flex-col h-full overflow-hidden">
            {selectedConversation && session ? (
              <ChatWindow
                conversationId={selectedConversation.id}
                currentUserId={session.id}
                otherUser={selectedConversation.otherUser}
                dish={selectedConversation.dish}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Sélectionnez une conversation pour commencer à discuter
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 