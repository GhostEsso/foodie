import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';
import {
  BuildingFilters,
  BuildingSortOptions,
  BuildingResponse,
  CreateBuildingData,
  UpdateBuildingData,
  BuildingWithUsers
} from '../models/building/building.types';

export class BuildingService {
  async getBuildings(
    filters?: BuildingFilters,
    sort?: BuildingSortOptions,
    page: number = 1,
    pageSize: number = 10
  ): Promise<BuildingResponse> {
    const skip = (page - 1) * pageSize;

    const where: Prisma.BuildingWhereInput = {
      ...(filters?.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { address: { contains: filters.search, mode: 'insensitive' } }
        ]
      }),
      ...(filters?.hasUsers !== undefined && {
        users: {
          some: {}
        }
      })
    };

    const [buildings, totalCount] = await Promise.all([
      prisma.building.findMany({
        where,
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              apartment: true
            }
          },
          _count: {
            select: {
              users: true
            }
          }
        },
        orderBy: sort ? {
          [sort.field]: sort.direction as Prisma.SortOrder
        } : {
          createdAt: 'desc'
        },
        skip,
        take: pageSize
      }),
      prisma.building.count({ where })
    ]);

    return {
      buildings: buildings.map(building => ({
        ...building,
        createdAt: building.createdAt.toISOString(),
        updatedAt: building.updatedAt.toISOString()
      })) as unknown as BuildingWithUsers[],
      totalCount
    };
  }

  async getBuildingById(buildingId: string): Promise<BuildingWithUsers | null> {
    const building = await prisma.building.findUnique({
      where: { id: buildingId },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            apartment: true
          }
        },
        _count: {
          select: {
            users: true
          }
        }
      }
    });

    if (!building) return null;

    return {
      ...building,
      createdAt: building.createdAt.toISOString(),
      updatedAt: building.updatedAt.toISOString()
    };
  }

  async createBuilding(data: CreateBuildingData): Promise<BuildingWithUsers> {
    const building = await prisma.building.create({
      data,
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            apartment: true
          }
        },
        _count: {
          select: {
            users: true
          }
        }
      }
    });

    return {
      ...building,
      createdAt: building.createdAt.toISOString(),
      updatedAt: building.updatedAt.toISOString()
    };
  }

  async updateBuilding(
    buildingId: string,
    data: UpdateBuildingData
  ): Promise<BuildingWithUsers> {
    const building = await prisma.building.update({
      where: { id: buildingId },
      data,
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            apartment: true
          }
        },
        _count: {
          select: {
            users: true
          }
        }
      }
    });

    return {
      ...building,
      createdAt: building.createdAt.toISOString(),
      updatedAt: building.updatedAt.toISOString()
    };
  }

  async deleteBuilding(buildingId: string): Promise<void> {
    await prisma.building.delete({
      where: { id: buildingId }
    });
  }
} 