export interface Conversation {
  id: string;
  otherUser: {
    id: string;
    name: string;
  };
  dish: {
    title: string;
  };
}

export interface Session {
  id: string;
}

export interface ConversationResponse {
  conversation: Conversation;
} 