import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { isBlocked } = body;

    const user = await prisma.user.update({
      where: {
        id: params.id,
      },
      data: {
        isBlocked,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du statut de l'utilisateur" },
      { status: 500 }
    );
  }
} 