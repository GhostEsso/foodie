import { prisma } from '../lib/prisma';
import { IDish, IDishCreate, DishFilters } from '../models';
import { uploadImage } from '../lib/upload';

export class DishService {
  async findAll(filters?: DishFilters): Promise<IDish[]> {
    return prisma.dish.findMany({
      where: {
        available: filters?.available,
        price: {
          gte: filters?.minPrice,
          lte: filters?.maxPrice,
        },
        title: filters?.search ? { contains: filters.search, mode: 'insensitive' } : undefined,
      },
      include: {
        user: {
          select: {
            name: true,
            building: { select: { name: true } }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findById(id: string): Promise<IDish | null> {
    return prisma.dish.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            building: { select: { name: true } }
          }
        }
      }
    });
  }

  async create(data: IDishCreate, userId: string): Promise<IDish> {
    const uploadedImages = await Promise.all(
      (data.images || []).map((image) => uploadImage(image))
    );

    return prisma.dish.create({
      data: {
        ...data,
        images: uploadedImages,
        userId,
        available: true
      }
    });
  }

  async update(id: string, data: Partial<IDishCreate>): Promise<IDish> {
    const dish = await this.findById(id);
    if (!dish) {
      throw new Error('Plat non trouvé');
    }

    return prisma.dish.update({
      where: { id },
      data: {
        ...data,
        images: data.images ? await Promise.all(data.images.map((image) => uploadImage(image))) : undefined
      }
    });
  }

  async delete(id: string): Promise<IDish> {
    const dish = await this.findById(id);
    if (!dish) {
      throw new Error('Plat non trouvé');
    }

    return prisma.dish.delete({ where: { id } });
  }

  async getRecentDishes(limit: number = 3): Promise<IDish[]> {
    return prisma.dish.findMany({
      where: {
        available: true,
      },
      include: {
        user: {
          select: {
            name: true,
            building: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  }
} 