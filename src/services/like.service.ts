import { prisma } from '../lib/prisma';
import {
    LikeFilters,
    LikeSortOptions,
    LikeResponse,
    Like
} from '../models/like/like.types';

export class LikeService {
  async getLikes(
    filters?: LikeFilters,
    sort?: LikeSortOptions,
    page: number = 1,
    pageSize: number = 10
  ): Promise<LikeResponse> {
    const skip = (page - 1) * pageSize;

    const where = {
      ...(filters?.userId && { userId: filters.userId }),
      ...(filters?.dishId && { dishId: filters.dishId }),
      ...(filters?.fromDate && { createdAt: { gte: filters.fromDate } }),
      ...(filters?.toDate && { createdAt: { lte: filters.toDate } })
    };

    const [likes, totalCount] = await Promise.all([
      prisma.like.findMany({
        where,
        include: {
          dish: {
            select: {
              id: true,
              title: true,
              images: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: sort ? {
          [sort.field]: sort.direction
        } : {
          createdAt: 'desc'
        },
        skip,
        take: pageSize
      }),
      prisma.like.count({ where })
    ]);

    return {
      likes: likes.map(like => ({
        ...like,
        createdAt: like.createdAt.toISOString()
      })),
      totalCount
    };
  }

  async getLikeById(likeId: string): Promise<Like | null> {
    const like = await prisma.like.findUnique({
      where: { id: likeId },
      include: {
        dish: {
          select: {
            id: true,
            title: true,
            images: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!like) return null;

    return {
      ...like,
      createdAt: like.createdAt.toISOString()
    };
  }

  async toggleLike(dishId: string, userId: string): Promise<boolean> {
    const existingLike = await prisma.like.findUnique({
      where: {
        dishId_userId: {
          dishId,
          userId
        }
      }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          dishId_userId: {
            dishId,
            userId
          }
        }
      });
      return false;
    } else {
      await prisma.like.create({
        data: {
          dishId,
          userId
        }
      });
      return true;
    }
  }

  async getUserLikedDishes(userId: string): Promise<Like[]> {
    const likes = await prisma.like.findMany({
      where: {
        userId
      },
      include: {
        dish: {
          select: {
            id: true,
            title: true,
            images: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return likes.map(like => ({
      ...like,
      createdAt: like.createdAt.toISOString()
    }));
  }

  async getDishLikes(dishId: string): Promise<Like[]> {
    const likes = await prisma.like.findMany({
      where: {
        dishId
      },
      include: {
        dish: {
          select: {
            id: true,
            title: true,
            images: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return likes.map(like => ({
      ...like,
      createdAt: like.createdAt.toISOString()
    }));
  }
} 