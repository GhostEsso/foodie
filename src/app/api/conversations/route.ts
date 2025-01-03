import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        users: {
          some: {
            id: session.id
          }
        }
      },
      include: {
        dish: {
          select: {
            id: true,
            title: true,
            images: true
          }
        },
        users: {
          where: {
            NOT: {
              id: session.id
            }
          },
          select: {
            id: true,
            name: true
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          select: {
            content: true,
            createdAt: true,
            isRead: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Formater les conversations pour correspondre à l'interface attendue
    const formattedConversations = conversations.map(conv => ({
      id: conv.id,
      dish: {
        id: conv.dish.id,
        title: conv.dish.title,
        images: conv.dish.images
      },
      otherUser: conv.users[0],
      lastMessage: conv.messages[0] ? {
        content: conv.messages[0].content,
        createdAt: conv.messages[0].createdAt.toISOString(),
        isRead: conv.messages[0].isRead
      } : undefined
    }));

    return NextResponse.json(formattedConversations);
  } catch (error) {
    console.error("[CONVERSATIONS_GET]", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des conversations" },
      { status: 500 }
    );
  }
}

// Créer une nouvelle conversation
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { dishId, otherUserId } = await request.json();

    // Vérifier si une conversation existe déjà
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        dishId,
        AND: [
          {
            users: {
              some: {
                id: session.id,
              },
            },
          },
          {
            users: {
              some: {
                id: otherUserId,
              },
            },
          },
        ],
      },
    });

    if (existingConversation) {
      return NextResponse.json(existingConversation);
    }

    // Créer une nouvelle conversation
    const conversation = await prisma.conversation.create({
      data: {
        dishId,
        users: {
          connect: [
            { id: session.id },
            { id: otherUserId },
          ],
        },
      },
      include: {
        dish: {
          select: {
            title: true,
            images: true,
          },
        },
        users: {
          where: {
            NOT: {
              id: session.id,
            },
          },
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Erreur lors de la création de la conversation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la conversation" },
      { status: 500 }
    );
  }
} 