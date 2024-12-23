"use client";

import { ConversationList } from "../../components/chat/conversation-list";
import { ChatWindow } from "../../components/chat/chat-window";
import { MessageSquare } from "lucide-react";
import { useMessagesPage } from "../../hooks/useMessagesPage";

export default function MessagesPage() {
  const { selectedConversation, setSelectedConversation, session } = useMessagesPage();

  return (
    <main className="flex-1">
      <div className="h-[calc(100vh-4rem)] bg-white">
        <div className="h-full max-w-7xl mx-auto">
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
            <div className="col-span-2 flex flex-col h-full">
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
    </main>
  );
} 