import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/auth";
// import { Server } from 'socket.io';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    console.log("Récupération des notifications pour l'utilisateur:", session.id);
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.id,
        isRead: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log("Notifications trouvées:", notifications.length);

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
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
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { notificationId } = await request.json();
    console.log("Marquage de la notification comme lue:", notificationId);

    await prisma.notification.update({
      where: {
        id: notificationId,
        userId: session.id,
      },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la notification:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
} 