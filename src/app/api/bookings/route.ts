import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/auth";
// import { Server } from 'socket.io';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.id,
      },
      include: {
        dish: {
          select: {
            title: true,
            price: true,
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération des réservations" }, { status: 500 });
  }
}

// Créer une nouvelle réservation
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
        status: 'pending'
      },
      include: {
        user: true,
        dish: true,
      },
    });

    // Créer une notification pour le propriétaire du plat
    const notification = await prisma.notification.create({
      data: {
        type: "BOOKING_CREATED",
        message: `${session.name} a réservé ${portions} portion${portions > 1 ? 's' : ''} de votre plat "${dish.title}"`,
        userId: dish.userId,
        isRead: false,
      },
    });

    // Commenté temporairement
    // const io = global.io as Server;
    // if (io) {
    //   console.log("Émission de la notification pour l'utilisateur:", dish.userId);
    //   io.to(dish.userId).emit('notification', notification);
    // } else {
    //   console.warn("Socket.IO n'est pas initialisé");
    // }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Erreur lors de la création de la réservation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la réservation" },
      { status: 500 }
    );
  }
} 