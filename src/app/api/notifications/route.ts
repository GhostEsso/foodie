import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/auth";
// import { Server } from 'socket.io';

export async function GET() {
  try {
    console.log('GET /api/notifications - Début');
    
    const session = await getSession();
    console.log('Session:', session);
    
    if (!session) {
      console.log('Pas de session trouvée');
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: {
          userId: session.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
      }),
      prisma.notification.count({
        where: {
          userId: session.id,
          isRead: false,
        },
      }),
    ]);

    console.log('Notifications trouvées:', notifications.length);
    console.log('Notifications non lues:', unreadCount);

    const response = {
      notifications: notifications.map(notification => ({
        ...notification,
        createdAt: notification.createdAt.toISOString(),
        updatedAt: notification.updatedAt.toISOString()
      })),
      unreadCount
    };

    console.log('GET /api/notifications - Succès');
    return NextResponse.json(response);
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des notifications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { userId, type, message } = await request.json();
    console.log("Création d'une notification:", { userId, type, message });

    const notification = await prisma.notification.create({
      data: {
        type,
        message,
        userId,
        isRead: false,
      },
    });
    console.log("Notification créée:", notification);

    // Commenté temporairement
    // const io = global.io as Server;
    // if (io) {
    //   console.log("Émission de la notification via Socket.IO pour l'utilisateur:", userId);
    //   io.to(userId).emit('notification', notification);
    // } else {
    //   console.warn("Socket.IO n'est pas initialisé");
    // }

    return NextResponse.json({ notification });
  } catch (error) {
    console.error("Erreur lors de la création de la notification:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    console.log('PUT /api/notifications - Début');
    
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { notificationId } = await request.json();
    console.log('Marquage de la notification comme lue:', notificationId);

    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
        userId: session.id,
      },
      data: { isRead: true },
    });

    console.log('PUT /api/notifications - Succès');
    return NextResponse.json(notification);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la notification:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la notification" },
      { status: 500 }
    );
  }
} 