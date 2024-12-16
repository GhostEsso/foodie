import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Récupérer les réservations de l'utilisateur
export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId,
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
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();
    const { dishId, pickupTime, portions } = data;

    // Vérifier la disponibilité du plat
    const dish = await prisma.dish.findUnique({
      where: { id: dishId },
      include: {
        bookings: {
          where: {
            status: "confirmed",
          },
          select: {
            portions: true,
          },
        },
      },
    });

    if (!dish) {
      return NextResponse.json({ error: "Plat non trouvé" }, { status: 404 });
    }

    // Calculer les portions restantes
    const bookedPortions = dish.bookings.reduce((sum, booking) => sum + booking.portions, 0);
    const availablePortions = dish.portions - bookedPortions;

    if (portions > availablePortions) {
      return NextResponse.json({ 
        error: "Portions insuffisantes",
        availablePortions 
      }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        dishId,
        userId,
        pickupTime: new Date(pickupTime),
        portions: parseInt(portions),
        total: dish.price * parseInt(portions),
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création de la réservation" }, { status: 500 });
  }
} 