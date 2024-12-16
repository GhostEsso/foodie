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

    const data = await request.json();
    const { title, description, price, portions, ingredients, available, images } = data;

    // Vérifier le nombre d'images
    if (images && images.length > 3) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas ajouter plus de 3 images" },
        { status: 400 }
      );
    }

    // Upload des images
    const uploadedImages = [];
    if (images && images.length > 0) {
      for (const image of images) {
        try {
          const imageUrl = await uploadImage(image);
          uploadedImages.push(imageUrl);
        } catch (error) {
          console.error("Erreur lors de l'upload de l'image:", error);
        }
      }
    }

    const dish = await prisma.dish.create({
      data: {
        title,
        description,
        price,
        portions,
        ingredients,
        available,
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