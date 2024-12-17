import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getSession } from "../../../../lib/auth";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: params.id,
        users: {
          some: {
            id: session.id,
          },
        },
      },
      include: {
        dish: {
          select: {
            id: true,
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

    if (!conversation) {
      return NextResponse.json({ error: "Conversation non trouvée" }, { status: 404 });
    }

    // Formater la réponse
    const formattedConversation = {
      id: conversation.id,
      dish: conversation.dish,
      otherUser: conversation.users[0], // L'autre utilisateur de la conversation
    };

    return NextResponse.json(formattedConversation);
  } catch (error) {
    console.error("Erreur lors de la récupération de la conversation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la conversation" },
      { status: 500 }
    );
  }
} 