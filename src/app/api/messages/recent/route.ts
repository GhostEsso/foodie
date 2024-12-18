import { NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer les derniers messages de chaque conversation
    const messages = await prisma.message.findMany({
      where: {
        receiverId: session.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        conversation: {
          include: {
            dish: {
              select: {
                title: true,
              },
            },
            users: {
              where: {
                id: {
                  not: session.id,
                },
              },
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Formater les messages pour l'interface
    const formattedMessages = messages.map((message) => ({
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      isRead: message.isRead,
      createdAt: message.createdAt,
      conversation: {
        id: message.conversationId,
        otherUser: message.conversation.users[0],
        dish: message.conversation.dish,
      },
    }));

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error("Erreur lors de la récupération des messages récents:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des messages" },
      { status: 500 }
    );
  }
} 