import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getSession } from "../../../../lib/auth";

interface RouteParams {
  params: {
    id: string;
  };
}

// Récupérer un plat spécifique
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const dish = await prisma.dish.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            building: {
              select: {
                name: true,
              },
            },
          },
        },
        bookings: {
          where: {
            status: "APPROVED",
          },
          select: {
            pickupTime: true,
            portions: true,
          },
        },
      },
    });

    if (!dish) {
      return NextResponse.json({ error: "Plat non trouvé" }, { status: 404 });
    }

    return NextResponse.json(dish);
  } catch (error) {
    console.error("Erreur lors de la récupération du plat:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération du plat" }, { status: 500 });
  }
}

// Mettre à jour un plat
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();
    const dish = await prisma.dish.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!dish) {
      return NextResponse.json({ error: "Plat non trouvé" }, { status: 404 });
    }

    if (dish.userId !== session.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const updatedDish = await prisma.dish.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(updatedDish);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour du plat" }, { status: 500 });
  }
}

// Supprimer un plat
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const dish = await prisma.dish.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!dish) {
      return NextResponse.json({ error: "Plat non trouvé" }, { status: 404 });
    }

    if (dish.userId !== session.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    await prisma.dish.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Plat supprimé avec succès" });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la suppression du plat" }, { status: 500 });
  }
} 