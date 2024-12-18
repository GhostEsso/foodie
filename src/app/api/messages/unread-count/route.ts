import { NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ count: 0 });
    }

    // Compter les messages non lus pour l'utilisateur
    const count = await prisma.message.count({
      where: {
        receiverId: session.id,
        isRead: false,
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Erreur lors du comptage des messages non lus:", error);
    return NextResponse.json({ count: 0 });
  }
} 