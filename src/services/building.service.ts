import { prisma } from '../lib/store';
import {
    Building,
    BuildingWithUsers,
    BuildingFilters,
    BuildingSortOptions,
    BuildingResponse,
    CreateBuildingData,
    UpdateBuildingData
} from '../models/building/building.types';

export class BuildingService {
  async getBuildings(
    page: number = 1,
    pageSize: number = 10,
    filters?: BuildingFilters,
    sort?: BuildingSortOptions
  ): Promise<BuildingResponse> {
    const skip = (page - 1) * pageSize;

    const where = {
      ...(filters?.searchTerm && {
        OR: [
          { name: { contains: filters.searchTerm, mode: 'insensitive' } },
          { address: { contains: filters.searchTerm, mode: 'insensitive' } }
        ]
      }),
      ...(filters?.city && { city: filters.city }),
      ...(filters?.postalCode && { postalCode: filters.postalCode })
    };

    const [buildings, totalCount] = await Promise.all([
      prisma.building.findMany({
        where,
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              users: true
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
      prisma.building.count({ where })
    ]);

    return {
      buildings: buildings as BuildingWithUsers[],
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
            email: true
          }
        },
        _count: {
          select: {
            users: true
          }
        }
      }
    });

    return building as BuildingWithUsers | null;
  }

  async createBuilding(data: CreateBuildingData): Promise<Building> {
    return prisma.building.create({
      data
    });
  }

  async updateBuilding(buildingId: string, data: UpdateBuildingData): Promise<Building> {
    return prisma.building.update({
      where: { id: buildingId },
      data
    });
  }

  async deleteBuilding(buildingId: string): Promise<void> {
    await prisma.building.delete({
      where: { id: buildingId }
    });
  }

  async addUserToBuilding(buildingId: string, userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        buildingId
      }
    });
  }

  async removeUserFromBuilding(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        buildingId: null
      }
    });
  }
} 