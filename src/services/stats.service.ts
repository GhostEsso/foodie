import { prisma } from '../lib/store';
import {
    GlobalStats,
    DishStats,
    BookingStats,
    UserStats,
    StatsFilters
} from '../models/stats/stats.types';

export class StatsService {
  async getGlobalStats(filters?: StatsFilters): Promise<GlobalStats> {
    const dateFilter = {
      ...(filters?.startDate && { gte: filters.startDate }),
      ...(filters?.endDate && { lte: filters.endDate })
    };

    const [dishes, bookings, users, conversations, messages] = await Promise.all([
      this.getDishStats(filters),
      this.getBookingStats(filters),
      this.getUserStats(filters),
      prisma.conversation.count({
        where: {
          createdAt: dateFilter,
          ...(filters?.buildingId && {
            users: {
              some: {
                buildingId: filters.buildingId
              }
            }
          })
        }
      }),
      prisma.message.count({
        where: {
          createdAt: dateFilter,
          ...(filters?.buildingId && {
            sender: {
              buildingId: filters.buildingId
            }
          })
        }
      })
    ]);

    const unreadMessages = await prisma.message.count({
      where: {
        isRead: false,
        createdAt: dateFilter,
        ...(filters?.buildingId && {
          sender: {
            buildingId: filters.buildingId
          }
        })
      }
    });

    return {
      dishes,
      bookings,
      users,
      conversationsCount: conversations,
      messagesCount: messages,
      unreadMessagesCount: unreadMessages
    };
  }

  private async getDishStats(filters?: StatsFilters): Promise<DishStats> {
    const dateFilter = {
      ...(filters?.startDate && { gte: filters.startDate }),
      ...(filters?.endDate && { lte: filters.endDate })
    };

    const dishes = await prisma.dish.findMany({
      where: {
        createdAt: dateFilter,
        ...(filters?.buildingId && {
          user: {
            buildingId: filters.buildingId
          }
        })
      },
      include: {
        _count: {
          select: {
            bookings: true,
            likes: true
          }
        }
      }
    });

    const totalDishes = dishes.length;
    const availableDishes = dishes.filter(d => d.available).length;
    const totalPortions = dishes.reduce((sum, d) => sum + d.portions, 0);
    const availablePortions = dishes
      .filter(d => d.available)
      .reduce((sum, d) => sum + d.portions, 0);
    const averagePrice = dishes.reduce((sum, d) => sum + d.price, 0) / totalDishes;

    const mostPopularDishes = dishes
      .map(d => ({
        id: d.id,
        title: d.title,
        bookingsCount: d._count.bookings,
        likesCount: d._count.likes
      }))
      .sort((a, b) => b.bookingsCount - a.bookingsCount)
      .slice(0, 5);

    return {
      totalDishes,
      availableDishes,
      totalPortions,
      availablePortions,
      averagePrice,
      mostPopularDishes
    };
  }

  private async getBookingStats(filters?: StatsFilters): Promise<BookingStats> {
    const dateFilter = {
      ...(filters?.startDate && { gte: filters.startDate }),
      ...(filters?.endDate && { lte: filters.endDate })
    };

    const bookings = await prisma.booking.findMany({
      where: {
        createdAt: dateFilter,
        ...(filters?.buildingId && {
          user: {
            buildingId: filters.buildingId
          }
        })
      }
    });

    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
    const approvedBookings = bookings.filter(b => b.status === 'APPROVED').length;
    const rejectedBookings = bookings.filter(b => b.status === 'REJECTED').length;
    const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED').length;
    const totalRevenue = bookings.reduce((sum, b) => sum + b.total, 0);
    const averagePortionsPerBooking = bookings.reduce((sum, b) => sum + b.portions, 0) / totalBookings;

    const bookingsByDay = await prisma.$queryRaw<{ date: string; count: number; revenue: number }[]>`
      SELECT 
        DATE(createdAt) as date,
        COUNT(*) as count,
        SUM(total) as revenue
      FROM bookings
      WHERE createdAt BETWEEN ${filters?.startDate} AND ${filters?.endDate}
      GROUP BY DATE(createdAt)
      ORDER BY date DESC
    `;

    return {
      totalBookings,
      pendingBookings,
      approvedBookings,
      rejectedBookings,
      cancelledBookings,
      totalRevenue,
      averagePortionsPerBooking,
      bookingsByDay
    };
  }

  private async getUserStats(filters?: StatsFilters): Promise<UserStats> {
    const dateFilter = {
      ...(filters?.startDate && { gte: filters.startDate }),
      ...(filters?.endDate && { lte: filters.endDate })
    };

    const users = await prisma.user.findMany({
      where: {
        createdAt: dateFilter,
        ...(filters?.buildingId && {
          buildingId: filters.buildingId
        })
      }
    });

    const totalUsers = users.length;
    const activeUsers = users.filter(u => !u.isBlocked).length;
    const verifiedUsers = users.filter(u => u.emailVerified).length;
    const usersWithBuilding = users.filter(u => u.buildingId).length;

    const usersByRole = await prisma.$queryRaw<{ role: string; count: number }[]>`
      SELECT role, COUNT(*) as count
      FROM users
      WHERE createdAt BETWEEN ${filters?.startDate} AND ${filters?.endDate}
      GROUP BY role
    `;

    const newUsersPerDay = await prisma.$queryRaw<{ date: string; count: number }[]>`
      SELECT 
        DATE(createdAt) as date,
        COUNT(*) as count
      FROM users
      WHERE createdAt BETWEEN ${filters?.startDate} AND ${filters?.endDate}
      GROUP BY DATE(createdAt)
      ORDER BY date DESC
    `;

    return {
      totalUsers,
      activeUsers,
      verifiedUsers,
      usersWithBuilding,
      usersByRole,
      newUsersPerDay
    };
  }
}