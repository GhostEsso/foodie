import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/auth";

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

    // Récupérer le prix du plat
    const dish = await prisma.dish.findUnique({
      where: { id: dishId },
      select: { price: true }
    });

    if (!dish) {
      return NextResponse.json({ error: "Plat non trouvé" }, { status: 404 });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: session.id,
        dishId,
        portions,
        pickupTime: new Date(pickupTime),
        status: "confirmed",
        total: dish.price * portions,
      },
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