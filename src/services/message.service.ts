import { prisma } from '../lib/store';
import {
    MessageFilters,
    MessageSortOptions,
    ConversationsResponse,
    MessageWithUsers
} from '../models/message/message.types';

export class MessageService {
  async getConversations(
    userId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ConversationsResponse> {
    const skip = (page - 1) * pageSize;

    const [conversations, totalCount] = await Promise.all([
      prisma.conversation.findMany({
        where: {
          participants: {
            some: {
              id: userId
            }
          }
        },
        include: {
          participants: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          dish: {
            select: {
              id: true,
              title: true,
              images: true
            }
          },
          messages: {
            orderBy: {
              createdAt: 'desc'
            },
            take: 1,
            select: {
              id: true,
              content: true,
              createdAt: true,
              senderId: true,
              isRead: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        },
        skip,
        take: pageSize
      }),
      prisma.conversation.count({
        where: {
          participants: {
            some: {
              id: userId
            }
          }
        }
      })
    ]);

    return {
      conversations: conversations.map(conv => ({
        id: conv.id,
        participants: conv.participants,
        messages: conv.messages.map(msg => ({
          id: msg.id,
          content: msg.content,
          senderId: msg.senderId,
          createdAt: msg.createdAt.toISOString(),
          isRead: msg.isRead || false
        })),
        lastMessage: conv.messages[0] || undefined,
        unreadCount: 0,
        dish: {
          id: conv.dish.id,
          title: conv.dish.title,
          image: conv.dish.images[0]
        }
      })),
      totalCount
    };
  }

  async getMessages(
    conversationId: string,
    filters?: MessageFilters,
    sort?: MessageSortOptions
  ): Promise<MessageWithUsers[]> {
    return prisma.message.findMany({
      where: {
        conversationId,
        ...(filters?.isRead !== undefined && { isRead: filters.isRead }),
        ...(filters?.senderId && { senderId: filters.senderId }),
        ...(filters?.receiverId && { receiverId: filters.receiverId }),
        ...(filters?.fromDate && { createdAt: { gte: filters.fromDate } }),
        ...(filters?.toDate && { createdAt: { lte: filters.toDate } })
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: sort ? {
        [sort.field]: sort.direction
      } : {
        createdAt: 'desc'
      }
    });
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    receiverId: string,
    content: string
  ): Promise<MessageWithUsers> {
    return prisma.message.create({
      data: {
        content,
        conversationId,
        senderId,
        receiverId,
        isRead: false
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async markConversationAsRead(conversationId: string, userId: string): Promise<void> {
    await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        isRead: false
      },
      data: {
        isRead: true
      }
    });
  }
} 