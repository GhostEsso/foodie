import { prisma } from '../lib/prisma';
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
          users: {
            some: {
              id: userId
            }
          }
        },
        include: {
          dish: {
            select: {
              id: true,
              title: true,
              images: true
            }
          },
          users: {
            where: {
              NOT: {
                id: userId
              }
            },
            select: {
              id: true,
              name: true
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
          users: {
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
        dish: {
          id: conv.dish.id,
          title: conv.dish.title,
          images: conv.dish.images
        },
        otherUser: conv.users[0],
        messages: conv.messages.map(msg => ({
          id: msg.id,
          content: msg.content,
          senderId: msg.senderId,
          createdAt: msg.createdAt.toISOString(),
          isRead: msg.isRead || false
        })),
        lastMessage: conv.messages[0] ? {
          content: conv.messages[0].content,
          createdAt: conv.messages[0].createdAt.toISOString(),
          isRead: conv.messages[0].isRead
        } : undefined
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