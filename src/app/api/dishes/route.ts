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
    console.log("Début de la création du plat");
    
    const session = await getSession();
    if (!session) {
      console.log("Pas de session utilisateur");
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.log("Session utilisateur trouvée:", session.id);

    const formData = await request.json();
    console.log("Données reçues:", formData);

    const uploadedImages: string[] = [];

    // Upload des images seulement si elles sont présentes
    if (formData.images && formData.images.length > 0) {
      console.log("Tentative d'upload des images");
      try {
        for (const image of formData.images) {
          try {
            const imageUrl = await uploadImage(image);
            uploadedImages.push(imageUrl);
          } catch (error) {
            console.error("Erreur lors de l'upload d'une image:", error);
            // Continue avec les autres images si une échoue
          }
        }
      } catch (error) {
        console.error("Erreur lors du traitement des images:", error);
        // Continue sans les images
      }
    }

    console.log("Création du plat dans la base de données");
    const dish = await prisma.dish.create({
      data: {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        portions: parseInt(formData.portions),
        ingredients: formData.ingredients || [],
        available: true,
        images: uploadedImages,
        userId: session.id,
        availableFrom: formData.availableFrom ? new Date(formData.availableFrom) : null,
        availableTo: formData.availableTo ? new Date(formData.availableTo) : null,
      },
    });

    console.log("Plat créé avec succès:", dish);
    return NextResponse.json(dish);
  } catch (error) {
    console.error("Erreur détaillée lors de la création du plat:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du plat", details: error instanceof Error ? error.message : "Erreur inconnue" },
      { status: 500 }
    );
  }
} 