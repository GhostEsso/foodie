import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/auth";
import { uploadImage } from "../../../lib/upload";

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
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await request.json();
    const uploadedImages: string[] = [];

    try {
      // Upload des images
      for (const image of formData.images || []) {
        try {
          const imageUrl = await uploadImage(image);
          uploadedImages.push(imageUrl);
        } catch (error) {
          console.error("Erreur lors de l'upload de l'image:", error);
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'upload des images:", error);
    }

    const dish = await prisma.dish.create({
      data: {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        portions: formData.portions,
        ingredients: formData.ingredients,
        available: formData.available,
        images: uploadedImages,
        userId: session.id,
      },
    });

    return NextResponse.json(dish);
  } catch (error) {
    console.error("Erreur lors de la création du plat:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du plat" },
      { status: 500 }
    );
  }
} 