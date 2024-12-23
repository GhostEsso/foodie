export interface ChatUser {
  id: string;
  name: string;
}

export interface ChatDish {
  title: string;
}

export interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
  otherUser: ChatUser;
  dish: ChatDish;
}

export interface ChatWindowState {
  messageText: string;
  isScrolling: boolean;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
} 