import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getSession } from "../../../../lib/auth";

interface RouteParams {
  params: {
    id: string;
  };
}

// Récupérer une réservation spécifique
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        dish: {
          select: {
            title: true,
            price: true,
            userId: true,
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
    });

    if (!booking) {
      return NextResponse.json({ error: "Réservation non trouvée" }, { status: 404 });
    }

    // Vérifier que l'utilisateur est soit le créateur de la réservation, soit le propriétaire du plat
    if (booking.userId !== session.id && booking.dish.userId !== session.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération de la réservation" }, { status: 500 });
  }
}

// Mettre à jour le statut d'une réservation
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();
    const { status } = data;

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        dish: {
          select: {
            userId: true,
            title: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Réservation non trouvée" }, { status: 404 });
    }

    // Seul le propriétaire du plat peut confirmer/annuler une réservation
    if (booking.dish.userId !== session.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: { status },
    });

    // Créer une notification pour l'utilisateur qui a fait la réservation
    try {
      const notificationMessage = status === 'confirmed' 
        ? `Votre réservation de ${booking.portions} portion${booking.portions > 1 ? 's' : ''} du plat "${booking.dish.title}" a été confirmée`
        : `Votre réservation de ${booking.portions} portion${booking.portions > 1 ? 's' : ''} du plat "${booking.dish.title}" a été annulée`;

      await prisma.notification.create({
        data: {
          type: status === 'confirmed' ? "BOOKING_CONFIRMED" : "BOOKING_CANCELLED",
          message: notificationMessage,
          userId: booking.userId, // L'utilisateur qui reçoit la notification est celui qui a fait la réservation
        },
      });
    } catch (error) {
      console.error("Erreur lors de la création de la notification:", error);
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour de la réservation" }, { status: 500 });
  }
}

// Annuler une réservation
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Réservation non trouvée" }, { status: 404 });
    }

    // Seul l'utilisateur qui a fait la réservation peut l'annuler
    if (booking.userId !== session.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    await prisma.booking.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Réservation annulée avec succès" });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de l'annulation de la réservation" }, { status: 500 });
  }
} 