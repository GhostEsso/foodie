import { prisma } from '../lib/prisma';
import {
    DishFilters,
    DishSortOptions,
    DishResponse,
    CreateDishData,
    UpdateDishData,
    DishWithUser
} from '../models/dish/dish.types';

export class DishService {
  async getDishes(
    filters?: DishFilters,
    sort?: DishSortOptions,
    page: number = 1,
    pageSize: number = 10
  ): Promise<DishResponse> {
    const skip = (page - 1) * pageSize;

    const where = {
      ...(filters?.search && {
        OR: [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } }
        ]
      }),
      ...(filters?.userId && { userId: filters.userId }),
      ...(filters?.buildingId && { user: { buildingId: filters.buildingId } }),
      ...(filters?.minPrice && { price: { gte: filters.minPrice } }),
      ...(filters?.maxPrice && { price: { lte: filters.maxPrice } }),
      ...(filters?.availableNow && {
        AND: [
          { availableFrom: { lte: new Date() } },
          { availableTo: { gte: new Date() } }
        ]
      }),
      ...(filters?.hasPortions && { portions: { gt: 0 } })
    };

    const [dishes, totalCount] = await Promise.all([
      prisma.dish.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              building: {
                select: {
                  id: true,
                  name: true,
                  address: true
                }
              }
            }
          },
          _count: {
            select: {
              bookings: true,
              likes: true
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
      prisma.dish.count({ where })
    ]);

    return {
      dishes: dishes.map(dish => ({
        ...dish,
        createdAt: dish.createdAt.toISOString(),
        updatedAt: dish.updatedAt.toISOString(),
        availableFrom: dish.availableFrom?.toISOString() || null,
        availableTo: dish.availableTo?.toISOString() || null
      })),
      totalCount
    };
  }

  async getDishById(dishId: string): Promise<DishWithUser | null> {
    const dish = await prisma.dish.findUnique({
      where: { id: dishId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            building: {
              select: {
                id: true,
                name: true,
                address: true
              }
            }
          }
        },
        _count: {
          select: {
            bookings: true,
            likes: true
          }
        }
      }
    });

    if (!dish) return null;

    return {
      ...dish,
      createdAt: dish.createdAt.toISOString(),
      updatedAt: dish.updatedAt.toISOString(),
      availableFrom: dish.availableFrom?.toISOString() || null,
      availableTo: dish.availableTo?.toISOString() || null
    };
  }

  async createDish(userId: string, data: CreateDishData): Promise<DishWithUser> {
    // Note: La gestion de l'upload des images devrait être faite avant d'appeler cette méthode
    const dish = await prisma.dish.create({
      data: {
        ...data,
        userId,
        images: [], // Les URLs des images devraient être fournies après leur upload
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            building: {
              select: {
                id: true,
                name: true,
                address: true
              }
            }
          }
        },
        _count: {
          select: {
            bookings: true,
            likes: true
          }
        }
      }
    });

    return {
      ...dish,
      createdAt: dish.createdAt.toISOString(),
      updatedAt: dish.updatedAt.toISOString(),
      availableFrom: dish.availableFrom?.toISOString() || null,
      availableTo: dish.availableTo?.toISOString() || null
    };
  }

  async updateDish(
    dishId: string,
    data: UpdateDishData
  ): Promise<DishWithUser> {
    // Note: La gestion de l'upload des images devrait être faite avant d'appeler cette méthode
    const dish = await prisma.dish.update({
      where: { id: dishId },
      data: {
        ...data,
        images: data.images ? [] : undefined, // Les URLs des images devraient être fournies après leur upload
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            building: {
              select: {
                id: true,
                name: true,
                address: true
              }
            }
          }
        },
        _count: {
          select: {
            bookings: true,
            likes: true
          }
        }
      }
    });

    return {
      ...dish,
      createdAt: dish.createdAt.toISOString(),
      updatedAt: dish.updatedAt.toISOString(),
      availableFrom: dish.availableFrom?.toISOString() || null,
      availableTo: dish.availableTo?.toISOString() || null
    };
  }

  async deleteDish(dishId: string): Promise<void> {
    await prisma.dish.delete({
      where: { id: dishId }
    });
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

  async getRecentDishes(limit: number = 10): Promise<DishWithUser[]> {
    const dishes = await prisma.dish.findMany({
      where: {
        AND: [
          { availableFrom: { lte: new Date() } },
          { availableTo: { gte: new Date() } },
          { portions: { gt: 0 } }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            building: {
              select: {
                id: true,
                name: true,
                address: true
              }
            }
          }
        },
        _count: {
          select: {
            bookings: true,
            likes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    return dishes.map(dish => ({
      ...dish,
      createdAt: dish.createdAt.toISOString(),
      updatedAt: dish.updatedAt.toISOString(),
      availableFrom: dish.availableFrom?.toISOString() || null,
      availableTo: dish.availableTo?.toISOString() || null
    }));
  }
} 