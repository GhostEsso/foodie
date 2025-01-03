export interface Message {
  id: string;
  content: string;
  senderId: string;
  isRead: boolean;
  createdAt: string;
  conversation: {
    id: string;
    otherUser: {
      name: string;
    };
    dish: {
      title: string;
    };
  };
}

export interface Conversation {
  id: string;
  dish: {
    id: string;
    title: string;
    images: string[];
  };
  lastMessage?: {
    content: string;
    createdAt: string;
    isRead: boolean;
  };
  otherUser: {
    id: string;
    name: string;
  };
  messages: Message[];
}

export interface MessageFilters {
  isRead?: boolean;
  senderId?: string;
  receiverId?: string;
  fromDate?: Date;
  toDate?: Date;
}

export interface MessageSortOptions {
  field: keyof Message;
  direction: 'asc' | 'desc';
}

export interface ConversationsResponse {
  conversations: Conversation[];
  totalCount: number;
}

export interface MessageWithUsers extends Message {
  sender: {
    id: string;
    name: string;
    email: string;
  };
  receiver: {
    id: string;
    name: string;
    email: string;
  };
} 