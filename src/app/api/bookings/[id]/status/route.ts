import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getSession } from "../../../../../lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('PUT /api/bookings/[id]/status - Début');
    console.log('Booking ID:', params.id);
    
    const session = await getSession();
    console.log('Session:', session);
    
    if (!session) {
      console.log('Pas de session trouvée');
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { status } = await request.json();
    console.log('Nouveau statut:', status);

    // Vérifier que le statut est valide
    if (!["PENDING", "APPROVED", "REJECTED", "COMPLETED", "CANCELLED"].includes(status)) {
      console.log('Statut invalide');
      return NextResponse.json(
        { error: "Statut invalide" },
        { status: 400 }
      );
    }

    // Récupérer la réservation
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        dish: {
          include: {
            user: true
          }
        },
        user: true
      }
    });

    console.log('Réservation trouvée:', booking);

    if (!booking) {
      console.log('Réservation non trouvée');
      return NextResponse.json(
        { error: "Réservation non trouvée" },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est le propriétaire du plat
    if (booking.dish.userId !== session.id) {
      console.log('Utilisateur non autorisé');
      return NextResponse.json(
        { error: "Non autorisé à modifier cette réservation" },
        { status: 403 }
      );
    }

    // Mettre à jour le statut
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: { status },
      include: {
        dish: {
          include: {
            user: true
          }
        },
        user: true
      }
    });

    console.log('Réservation mise à jour:', updatedBooking);

    // Créer une notification pour l'utilisateur
    let message = "";
    if (status === "APPROVED") {
      message = `Votre réservation pour "${booking.dish.title}" a été acceptée`;
    } else if (status === "REJECTED") {
      message = `Votre réservation pour "${booking.dish.title}" a été refusée`;
    }

    if (message) {
      await prisma.notification.create({
        data: {
          userId: booking.userId,
          type: "BOOKING_STATUS",
          message,
          data: {
            bookingId: booking.id,
            status
          },
          read: false
        }
      });
      console.log('Notification créée');
    }

    console.log('PUT /api/bookings/[id]/status - Succès');
    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Erreur détaillée lors de la mise à jour du statut:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du statut" },
      { status: 500 }
    );
  }
} 