import { NextResponse } from "next/server";
import { getSession } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const notification = await prisma.notification.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!notification) {
      return NextResponse.json({ error: "Notification non trouvée" }, { status: 404 });
    }

    if (notification.userId !== session.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: params.id },
      data: { isRead: true },
    });

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la notification:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la notification" },
      { status: 500 }
    );
  }
} 