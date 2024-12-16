import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, name, googleId } = await request.json();

    // Vérifier si l'utilisateur existe déjà
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Si l'utilisateur n'existe pas, créer un nouveau compte
      // Note: Pour l'instant, on demande à l'utilisateur de sélectionner son bâtiment après la connexion
      user = await prisma.user.create({
        data: {
          email,
          name,
          googleId,
          // Mot de passe vide car l'authentification se fait via Google
          password: "",
        },
      });
    }

    // Créer le token JWT
    const token = await createToken(user.id);

    // Définir le cookie
    cookies().set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    // Ne pas renvoyer le mot de passe
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Erreur lors de l'authentification Google:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'authentification Google" },
      { status: 500 }
    );
  }
} 