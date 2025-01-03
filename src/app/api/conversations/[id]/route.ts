import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getSession } from "../../../../lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: params.id,
      },
      include: {
        dish: {
          select: {
            id: true,
            title: true,
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

    // Vérifier que l'utilisateur fait partie de la conversation
    const isParticipant = conversation.users.some(user => user.id === session.id);
    if (!isParticipant) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    return NextResponse.json({
      id: conversation.id,
      dish: conversation.dish,
      otherUser: conversation.users[0],
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de la conversation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la conversation" },
      { status: 500 }
    );
  }
} 