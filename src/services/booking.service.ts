import { prisma } from '../lib/prisma';
import { IBooking, IBookingCreate, BookingFilters, BookingStatus, BookingWithDetails } from '../models';

export class BookingService {
  async findAll(filters?: BookingFilters): Promise<BookingWithDetails[]> {
    return prisma.booking.findMany({
      where: {
        status: filters?.status,
        userId: filters?.userId,
        dishId: filters?.dishId,
        pickupTime: {
          gte: filters?.fromDate,
          lte: filters?.toDate
        }
      },
      include: {
        dish: {
          select: {
            title: true,
            price: true,
            images: true,
            user: {
              select: {
                name: true,
                building: {
                  select: {
                    name: true
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
    }) as unknown as BookingWithDetails[];
  }

  async findById(id: string): Promise<IBooking | null> {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        dish: {
          select: {
            title: true,
            price: true,
            images: true
          }
        },
        user: {
          select: {
            name: true,
            email: true,
            apartment: true
          }
        }
      }
    });
  }

  async create(data: IBookingCreate): Promise<IBooking> {
    return prisma.booking.create({
      data: {
        ...data,
        status: 'PENDING'
      },
      include: {
        dish: {
          select: {
            title: true,
            price: true,
            images: true
          }
        },
        user: {
          select: {
            name: true,
            email: true,
            apartment: true
          }
        }
      }
    });
  }

  async updateStatus(id: string, status: BookingStatus): Promise<IBooking> {
    const booking = await this.findById(id);
    if (!booking) {
      throw new Error('Réservation non trouvée');
    }

    return prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        dish: {
          select: {
            title: true,
            price: true,
            images: true
          }
        },
        user: {
          select: {
            name: true,
            email: true,
            apartment: true
          }
        }
      }
    });
  }
} 