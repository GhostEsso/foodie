import { NextResponse } from "next/server";
import { prisma } from "../../../lib/store";
import { getSession } from "../../../lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (conversationId) {
      // Récupérer les messages d'une conversation spécifique
      const messages = await prisma.message.findMany({
        where: {
          conversationId,
          conversation: {
            users: {
              some: {
                id: session.user.id
              }
            }
          }
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: "asc"
        }
      });

      return NextResponse.json(messages);
    } else {
      // Récupérer toutes les conversations de l'utilisateur
      const conversations = await prisma.conversation.findMany({
        where: {
          users: {
            some: {
              id: session.user.id
            }
          }
        },
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          dish: {
            select: {
              id: true,
              title: true,
              images: true
            }
          },
          messages: {
            orderBy: {
              createdAt: "desc"
            },
            take: 1
          }
        }
      });

      return NextResponse.json(conversations);
    }
  } catch (error) {
    console.error("[MESSAGES_GET]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const body = await request.json();
    const { conversationId, content } = body;

    if (!conversationId || !content) {
      return new NextResponse("Données manquantes", { status: 400 });
    }

    // Vérifier que l'utilisateur fait partie de la conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        users: {
          some: {
            id: session.user.id
          }
        }
      },
      include: {
        users: true
      }
    });

    if (!conversation) {
      return new NextResponse("Conversation non trouvée", { status: 404 });
    }

    // Trouver le destinataire (l'autre utilisateur de la conversation)
    const receiver = conversation.users.find(user => user.id !== session.user.id);
    if (!receiver) {
      return new NextResponse("Destinataire non trouvé", { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        content,
        conversationId,
        senderId: session.user.id,
        receiverId: receiver.id
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("[MESSAGES_POST]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
} 