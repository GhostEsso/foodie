export interface LastMessage {
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface ConversationDish {
  id: string;
  title: string;
  images: string[];
}

export interface ConversationUser {
  id: string;
  name: string;
}

export interface Conversation {
  id: string;
  dish: ConversationDish;
  lastMessage?: LastMessage;
  otherUser: ConversationUser;
}

export interface ConversationListProps {
  onSelectConversation?: (conversation: Conversation) => void;
}

export interface ConversationListState {
  conversations: Conversation[];
  selectedConversation: string | null;
  isLoading: boolean;
} 