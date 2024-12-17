import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getSession } from "../../../../lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const dishes = await prisma.dish.findMany({
      where: {
        userId: session.id,
        bookings: {
          some: {
            status: "PENDING"
          }
        }
      },
      include: {
        bookings: {
          where: {
            status: "PENDING"
          },
          include: {
            user: {
              select: {
                name: true,
                building: {
                  select: {
                    name: true
                  }
                }
              }
            },
            dish: {
              select: {
                title: true
              }
            }
          }
        }
      }
    });

    const bookings = dishes.flatMap(dish => dish.bookings.map(booking => ({
      ...booking,
      pickupTime: booking.pickupTime.toISOString()
    })));

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des réservations" },
      { status: 500 }
    );
  }
} 