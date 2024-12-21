import { IMessage } from './message.interface';
import { IUser } from '../user/user.interface';

export type MessageWithUsers = IMessage & {
  sender: Pick<IUser, 'id' | 'name' | 'email'>;
  receiver: Pick<IUser, 'id' | 'name' | 'email'>;
};

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    email: string;
  }[];
  messages: ChatMessage[];
  lastMessage?: {
    content: string;
    createdAt: string;
    senderId: string;
  };
  unreadCount: number;
  dish: {
    id: string;
    title: string;
    image?: string;
  };
}

export interface ConversationsResponse {
  conversations: Conversation[];
  totalCount: number;
}

export interface UseConversationsOptions {
  userId: string;
  pageSize?: number;
  initialPage?: number;
}

export type MessageFilters = {
  conversationId?: string;
  senderId?: string;
  receiverId?: string;
  isRead?: boolean;
  fromDate?: Date;
  toDate?: Date;
};

export type MessageSortOptions = {
  field: keyof IMessage;
  direction: 'asc' | 'desc';
};

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isRead: boolean;
}

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

export interface SendMessageData {
  content: string;
  receiverId: string;
} 