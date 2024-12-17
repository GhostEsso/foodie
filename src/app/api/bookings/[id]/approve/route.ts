import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getSession } from "../../../../../lib/auth";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        dish: true,
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

    // Vérifier que l'utilisateur est le propriétaire du plat
    if (booking.dish.userId !== session.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    // Mettre à jour le statut
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: { status: "APPROVED" },
    });

    // Créer une notification pour l'acheteur
    await prisma.notification.create({
      data: {
        type: "BOOKING_APPROVED",
        message: `Votre réservation pour "${booking.dish.title}" a été approuvée par ${session.name}`,
        userId: booking.userId,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Erreur lors de l'approbation:", error);
    return NextResponse.json({ error: "Erreur lors de l'approbation" }, { status: 500 });
  }
} 