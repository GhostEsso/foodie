import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getSession } from "../../../../../lib/auth";
import { formatName } from "../../../../../lib/utils";

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
      data: { status: "REJECTED" },
    });

    // Créer une notification pour l'acheteur
    await prisma.notification.create({
      data: {
        type: "BOOKING_REJECTED",
        message: `Votre réservation pour "${booking.dish.title}" a été rejetée par **${formatName(session.name)}**`,
        userId: booking.userId,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Erreur lors du rejet:", error);
    return NextResponse.json({ error: "Erreur lors du rejet" }, { status: 500 });
  }
} 