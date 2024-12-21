import { prisma } from '../lib/store';
import { Prisma, User } from '@prisma/client';
import {
    UserProfile,
    UserFilters,
    UserSortOptions,
    UserResponse,
    UpdateUserData,
    UserRole
} from '../models/user/user.types';

type UserWithBuilding = User & {
    building: { id: string; name: string; } | null;
};

export class UserService {
    private mapToUserProfile(user: UserWithBuilding): UserProfile {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role as UserRole,
            emailVerified: user.emailVerified,
            building: user.building,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }

    async getUsers(
        page: number = 1,
        pageSize: number = 10,
        filters?: UserFilters,
        sort?: UserSortOptions
    ): Promise<UserResponse> {
        const skip = (page - 1) * pageSize;

        const where: Prisma.UserWhereInput = {
            ...(filters?.role && { role: filters.role }),
            ...(filters?.emailVerified !== undefined && { emailVerified: filters.emailVerified }),
            ...(filters?.buildingId && { buildingId: filters.buildingId }),
            ...(filters?.searchTerm && {
                OR: [
                    { name: { contains: filters.searchTerm, mode: Prisma.QueryMode.insensitive } },
                    { email: { contains: filters.searchTerm, mode: Prisma.QueryMode.insensitive } }
                ]
            })
        };

        const [users, totalCount] = await Promise.all([
            prisma.user.findMany({
                where,
                include: {
                    building: {
                        select: {
                            id: true,
                            name: true
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
            users: users.map(this.mapToUserProfile),
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
                        name: true
                    }
                }
            }
        });

        return user ? this.mapToUserProfile(user as UserWithBuilding) : null;
    }

    async updateUser(userId: string, data: UpdateUserData): Promise<UserProfile> {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                email: data.email,
                role: data.role,
                emailVerified: data.emailVerified,
                buildingId: data.buildingId
            },
            include: {
                building: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        return this.mapToUserProfile(user as UserWithBuilding);
    }

    async deleteUser(userId: string): Promise<void> {
        await prisma.user.delete({
            where: { id: userId }
        });
    }

    async verifyEmail(userId: string): Promise<void> {
        await prisma.user.update({
            where: { id: userId },
            data: {
                emailVerified: true
            }
        });
    }

    async updatePassword(userId: string, hashedPassword: string): Promise<void> {
        await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword
            }
        });
    }

    async updateBuilding(userId: string, buildingId: string | null): Promise<UserProfile> {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                buildingId
            },
            include: {
                building: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        return this.mapToUserProfile(user as UserWithBuilding);
    }
} 