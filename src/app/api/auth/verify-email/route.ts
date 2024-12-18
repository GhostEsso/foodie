import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId, code } = await request.json();

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    if (!user.verificationCode || !user.verificationCodeExpires) {
      return NextResponse.json(
        { error: "Aucun code de vérification n'est actif" },
        { status: 400 }
      );
    }

    if (user.verificationCode !== code) {
      return NextResponse.json(
        { error: "Code de vérification incorrect" },
        { status: 400 }
      );
    }

    if (new Date() > user.verificationCodeExpires) {
      return NextResponse.json(
        { error: "Le code de vérification a expiré" },
        { status: 400 }
      );
    }

    // Mettre à jour l'utilisateur
    await prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: true,
        verificationCode: null,
        verificationCodeExpires: null,
      },
    });

    return NextResponse.json({
      message: "Email vérifié avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la vérification de l'email:", error);
    return NextResponse.json(
      { error: "Erreur lors de la vérification de l'email" },
      { status: 500 }
    );
  }
} 