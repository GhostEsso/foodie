export interface IMessage {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  isRead: boolean;
  createdAt: Date;
}

export interface IMessageCreate extends Omit<IMessage, 'id' | 'createdAt' | 'isRead'> {
  isRead?: boolean;
}

export interface IMessageUpdate extends Partial<IMessageCreate> {
  id: string;
} 