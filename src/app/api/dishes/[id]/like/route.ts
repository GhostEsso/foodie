import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getSession } from "../../../../../lib/auth";

interface RouteParams {
  params: {
    id: string;
  };
}

// Ajouter/Retirer un like
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const dishId = params.id;
    const userId = session.id;

    // Vérifier si l'utilisateur a déjà liké ce plat
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_dishId: {
          userId,
          dishId,
        },
      },
    });

    if (existingLike) {
      // Vérifier d'abord le nombre actuel de likes
      const currentDish = await prisma.dish.findUnique({
        where: { id: dishId },
        select: { likesCount: true }
      });

      // Ne pas décrémenter si déjà à zéro
      const shouldDecrement = (currentDish?.likesCount || 0) > 0;

      // Si le like existe, on le supprime
      const [, dish] = await prisma.$transaction([
        prisma.like.delete({
          where: { id: existingLike.id }
        }),
        prisma.dish.update({
          where: { id: dishId },
          data: shouldDecrement ? { likesCount: { decrement: 1 } } : {},
          select: { likesCount: true }
        })
      ]);
      return NextResponse.json({ liked: false, likesCount: dish.likesCount });
    } else {
      // Sinon, on crée un nouveau like
      const [, dish] = await prisma.$transaction([
        prisma.like.create({
          data: { userId, dishId }
        }),
        prisma.dish.update({
          where: { id: dishId },
          data: { likesCount: { increment: 1 } },
          select: { likesCount: true }
        })
      ]);
      return NextResponse.json({ liked: true, likesCount: dish.likesCount });
    }
  } catch (error) {
    console.error("Erreur lors de la gestion du like:", error);
    return NextResponse.json(
      { error: "Erreur lors de la gestion du like" },
      { status: 500 }
    );
  }
}

// Vérifier si un plat est liké par l'utilisateur
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    const dishId = params.id;

    // Récupérer le nombre actuel de likes
    const dish = await prisma.dish.findUnique({
      where: { id: dishId },
      select: { likesCount: true }
    });

    if (!session) {
      return NextResponse.json({ liked: false, likesCount: dish?.likesCount || 0 });
    }

    const userId = session.id;

    const like = await prisma.like.findUnique({
      where: {
        userId_dishId: {
          userId,
          dishId,
        },
      },
    });

    return NextResponse.json({ 
      liked: !!like,
      likesCount: dish?.likesCount || 0
    });
  } catch (error) {
    console.error("Erreur lors de la vérification du like:", error);
    return NextResponse.json({ liked: false, likesCount: 0 });
  }
} 