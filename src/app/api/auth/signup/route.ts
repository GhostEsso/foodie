import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { hashPassword } from "../../../../lib/auth";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const { email, password, name, buildingId, apartment } = await request.json();

    // Vérification des champs requis
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

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        buildingId,
        apartment,
      },
      select: {
        id: true,
        email: true,
        name: true,
        building: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Erreur détaillée lors de l'inscription:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma Error Details:", {
        code: error.code,
        meta: error.meta,
        message: error.message
      });
      
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: "Un conflit existe avec les données fournies" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: "Erreur lors de l'inscription. Veuillez réessayer.",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      },
      { status: 500 }
    );
  }
} 