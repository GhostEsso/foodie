import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getSession } from "../../../../../lib/auth";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { status } = await request.json();

    // Vérifier que la réservation existe et que l'utilisateur est le propriétaire du plat
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        dish: {
          select: {
            userId: true,
            title: true
          }
        },
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json({ error: "Réservation non trouvée" }, { status: 404 });
    }

    if (booking.dish.userId !== session.id) {
      return NextResponse.json({ error: "Non autoris��" }, { status: 403 });
    }

    // Mettre à jour le statut de la réservation
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: { status },
      include: {
        dish: {
          select: {
            title: true,
            user: {
              select: {
                name: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Créer une notification pour l'utilisateur qui a fait la réservation
    const notificationMessage = status === "APPROVED"
      ? `Votre réservation pour "${booking.dish.title}" a été acceptée`
      : `Votre réservation pour "${booking.dish.title}" a été refusée`;

    await prisma.notification.create({
      data: {
        type: status === "APPROVED" ? "BOOKING_APPROVED" : "BOOKING_REJECTED",
        message: notificationMessage,
        userId: booking.user.id
      }
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du statut" },
      { status: 500 }
    );
  }
} 