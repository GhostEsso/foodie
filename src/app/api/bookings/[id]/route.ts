import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: {
    id: string;
  };
}

// Récupérer une réservation spécifique
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { userId } = auth();
    if (!userId) {
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
    if (booking.userId !== userId && booking.dish.userId !== userId) {
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
    const { userId } = auth();
    if (!userId) {
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
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Réservation non trouvée" }, { status: 404 });
    }

    // Seul le propriétaire du plat peut confirmer/annuler une réservation
    if (booking.dish.userId !== userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour de la réservation" }, { status: 500 });
  }
}

// Annuler une réservation
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { userId } = auth();
    if (!userId) {
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
    if (booking.userId !== userId) {
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