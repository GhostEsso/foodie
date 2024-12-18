import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "../../../../lib/prisma";
import { sendVerificationEmail } from "../../../../lib/email";

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const { email, password, name, buildingId, apartment } = await request.json();

    // Vérifier que tous les champs requis sont présents
    if (!email || !password || !name || !buildingId || !apartment) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }

    // Vérifier si le bâtiment existe
    const building = await prisma.building.findUnique({
      where: { id: buildingId },
    });

    if (!building) {
      return NextResponse.json(
        { error: "Bâtiment non trouvé" },
        { status: 400 }
      );
    }

    // Vérifier si l'appartement est déjà utilisé dans ce bâtiment
    const existingApartment = await prisma.user.findFirst({
      where: {
        AND: [
          { buildingId },
          { apartment }
        ]
      }
    });

    if (existingApartment) {
      return NextResponse.json(
        { error: "Cet appartement est déjà enregistré dans ce bâtiment" },
        { status: 400 }
      );
    }

    // Générer le code de vérification
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 3600000); // Expire dans 1 heure

    // Hasher le mot de passe
    const hashedPassword = await hash(password, 12);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        buildingId,
        apartment,
        verificationCode,
        verificationCodeExpires,
        emailVerified: false,
      },
    });

    // Envoyer l'email de vérification
    await sendVerificationEmail(email, verificationCode);

    return NextResponse.json({
      message: "Un code de vérification a été envoyé à votre adresse email",
      userId: user.id,
    });
  } catch (error) {
    console.error("Erreur détaillée lors de l'inscription:", error);
    
    // Retourner un message d'erreur plus spécifique
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Erreur lors de l'inscription: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Une erreur inattendue s'est produite lors de l'inscription" },
      { status: 500 }
    );
  }
} 