import { prisma } from '../lib/prisma';
import {
    BookingFilters,
    BookingSortOptions,
    BookingResponse,
    BookingStatus,
    CreateBookingData,
    UpdateBookingData,
    Booking
} from '../models/booking/booking.types';

export class BookingService {
  async getBookings(
    filters?: BookingFilters,
    sort?: BookingSortOptions,
    page: number = 1,
    pageSize: number = 10
  ): Promise<BookingResponse> {
    const skip = (page - 1) * pageSize;

    const where = {
      ...(filters?.status && { status: filters.status }),
      ...(filters?.userId && { userId: filters.userId }),
      ...(filters?.dishId && { dishId: filters.dishId }),
      ...(filters?.fromDate && { pickupTime: { gte: filters.fromDate } }),
      ...(filters?.toDate && { pickupTime: { lte: filters.toDate } })
    };

    const [bookings, totalCount] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          dish: {
            select: {
              id: true,
              title: true,
              price: true,
              images: true,
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
      prisma.booking.count({ where })
    ]);

    return {
      bookings: bookings.map(booking => ({
        ...booking,
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
        pickupTime: booking.pickupTime.toISOString()
      })),
      totalCount
    };
  }

  async getBookingById(bookingId: string): Promise<Booking | null> {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        dish: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
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
            }
          }
        }
      }
    });

    if (!booking) return null;

    return {
      ...booking,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      pickupTime: booking.pickupTime.toISOString()
    };
  }

  async createBooking(userId: string, data: CreateBookingData): Promise<Booking> {
    const dish = await prisma.dish.findUnique({
      where: { id: data.dishId },
      select: { price: true }
    });

    if (!dish) {
      throw new Error('Plat non trouvé');
    }

    const total = dish.price * data.portions;

    const booking = await prisma.booking.create({
      data: {
        ...data,
        userId,
        total,
        status: BookingStatus.PENDING
      },
      include: {
        dish: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
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
            }
          }
        }
      }
    });

    return {
      ...booking,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      pickupTime: booking.pickupTime.toISOString()
    };
  }

  async updateBooking(
    bookingId: string,
    data: UpdateBookingData
  ): Promise<Booking> {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data,
      include: {
        dish: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
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
            }
          }
        }
      }
    });

    return {
      ...booking,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      pickupTime: booking.pickupTime.toISOString()
    };
  }

  async cancelBooking(bookingId: string): Promise<void> {
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED
      }
    });
  }

  async getPendingBookings(userId: string): Promise<BookingResponse> {
    const [bookings, totalCount] = await Promise.all([
      prisma.booking.findMany({
        where: {
          dish: {
            userId
          },
          status: BookingStatus.PENDING
        },
        include: {
          dish: {
            select: {
              id: true,
              title: true,
              price: true,
              images: true,
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
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.booking.count({
        where: {
          dish: {
            userId
          },
          status: BookingStatus.PENDING
        }
      })
    ]);

    return {
      bookings: bookings.map(booking => ({
        ...booking,
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
        pickupTime: booking.pickupTime.toISOString()
      })),
      totalCount
    };
  }
} 