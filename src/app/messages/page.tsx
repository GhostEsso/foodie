"use client";

import React, { useState } from "react";
import { ConversationList } from "../../components/chat/conversation-list";
import { ChatWindow } from "../../components/chat/chat-window";
import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<{
    id: string;
    otherUser: { id: string; name: string };
    dish: { title: string };
  } | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-4rem)]">
          {/* Liste des conversations */}
          <div className="border-r">
            <div className="p-4 border-b">
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages
              </h1>
            </div>
            <ConversationList
              onSelectConversation={(conversation) => setSelectedConversation(conversation)}
            />
          </div>

          {/* Fenêtre de chat */}
          <div className="col-span-2 flex flex-col">
            {selectedConversation ? (
              <ChatWindow
                conversationId={selectedConversation.id}
                currentUserId="current-user-id" // À remplacer par l'ID de l'utilisateur connecté
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