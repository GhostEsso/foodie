import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/auth";
import { formatName } from "../../../lib/utils";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const userId = searchParams.get("userId");
    const dishId = searchParams.get("dishId");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const skip = (page - 1) * pageSize;

    const where = {
      OR: [
        { userId: session.id },
        { dish: { userId: session.id } }
      ],
      ...(status && { status }),
      ...(dishId && { dishId })
    };

    if (userId) {
      where.userId = userId;
    }

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
          },
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
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: pageSize
      }),
      prisma.booking.count({ where })
    ]);

    return NextResponse.json({
      bookings: bookings.map(booking => ({
        ...booking,
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
        pickupTime: booking.pickupTime.toISOString()
      })),
      totalCount
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des réservations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { dishId, portions, pickupTime } = await request.json();

    const dish = await prisma.dish.findUnique({
      where: { id: dishId },
      select: { 
        price: true,
        userId: true,
        title: true,
        user: {
          select: {
            name: true
          }
        }
      }
    });

    if (!dish) {
      return NextResponse.json({ error: "Plat non trouvé" }, { status: 404 });
    }

    const booking = await prisma.booking.create({
      data: {
        dishId,
        userId: session.id,
        portions,
        pickupTime: new Date(pickupTime),
        total: dish.price * portions,
        status: "PENDING"
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            building: true
          }
        },
        dish: {
          select: {
            id: true,
            title: true,
            price: true,
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    await prisma.notification.create({
      data: {
        type: "BOOKING_REQUEST",
        message: `**${formatName(session.name)}** a réservé ${portions} portion${portions > 1 ? 's' : ''} de votre plat "${dish.title}"`,
        userId: dish.userId,
      }
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Erreur lors de la création de la réservation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la réservation" },
      { status: 500 }
    );
  }
} 