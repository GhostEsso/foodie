import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Récupérer tous les plats
export async function GET() {
  try {
    const dishes = await prisma.dish.findMany({
      include: {
        user: {
          select: {
            name: true,
            building: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(dishes);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération des plats" }, { status: 500 });
  }
}

// Créer un nouveau plat
export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();
    const { title, description, price, ingredients, images, portions } = data;

    const dish = await prisma.dish.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        ingredients,
        images,
        portions: parseInt(portions),
        userId,
      },
    });

    return NextResponse.json(dish);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création du plat" }, { status: 500 });
  }
} 