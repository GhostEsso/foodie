import { prisma } from '../lib/prisma';
import { UserFilters, UserSortOptions, UserResponse, UserProfile } from '../models/user/user.types';

export class UserService {
  async getUsers(
    filters?: UserFilters,
    sort?: UserSortOptions,
    page: number = 1,
    pageSize: number = 10
  ): Promise<UserResponse> {
    const skip = (page - 1) * pageSize;

    const where = {
      ...(filters?.role && { role: filters.role }),
      ...(filters?.buildingId && { buildingId: filters.buildingId }),
      ...(filters?.isBlocked !== undefined && { isBlocked: filters.isBlocked }),
      ...(filters?.emailVerified !== undefined && { emailVerified: filters.emailVerified }),
      ...(filters?.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { email: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          building: {
            select: {
              id: true,
              name: true,
              address: true
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
      prisma.user.count({ where })
    ]);

    return {
      users: users.map(user => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      })),
      totalCount
    };
  }

  async getUserById(userId: string): Promise<UserProfile | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        building: {
          select: {
            id: true,
            name: true,
            address: true
          }
        }
      }
    });

    if (!user) return null;

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  }

  async updateUser(userId: string, data: Partial<UserProfile>) {
    return prisma.user.update({
      where: { id: userId },
      data,
      include: {
        building: {
          select: {
            id: true,
            name: true,
            address: true
          }
        }
      }
    });
  }

  async blockUser(userId: string, isBlocked: boolean) {
    return prisma.user.update({
      where: { id: userId },
      data: { isBlocked }
    });
  }

  async verifyEmail(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: true,
        verificationCode: null,
        verificationCodeExpires: null
      }
    });
  }
} 