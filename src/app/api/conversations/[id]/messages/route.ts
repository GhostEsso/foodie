import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getSession } from "../../../../../lib/auth";

interface RouteParams {
  params: {
    id: string;
  };
}

// Récupérer les messages d'une conversation
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const conversationId = params.id;

    // Vérifier que l'utilisateur fait partie de la conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        users: {
          some: {
            id: session.id,
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation non trouvée" }, { status: 404 });
    }

    // Récupérer les messages
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Marquer les messages non lus comme lus
    await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: session.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des messages" },
      { status: 500 }
    );
  }
}

// Envoyer un nouveau message
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const conversationId = params.id;
    const { content, receiverId } = await request.json();

    // Vérifier que l'utilisateur fait partie de la conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        users: {
          some: {
            id: session.id,
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation non trouvée" }, { status: 404 });
    }

    // Créer le message
    const message = await prisma.message.create({
      data: {
        content,
        senderId: session.id,
        receiverId,
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Créer une notification pour le destinataire
    await prisma.notification.create({
      data: {
        type: "NEW_MESSAGE",
        message: `Nouveau message de ${session.name}`,
        userId: receiverId,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    );
  }
} 