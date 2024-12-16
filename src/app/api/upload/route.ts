import { NextResponse } from "next/server";
import { getSession } from "../../../lib/auth";
import { uploadImage } from "../../../lib/upload";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    console.log("Fichier reçu:", {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Le fichier doit être une image" },
        { status: 400 }
      );
    }

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Le fichier est trop volumineux (max 5MB)" },
        { status: 400 }
      );
    }

    try {
      console.log("Début de l'upload vers Firebase...");
      const url = await uploadImage(file);
      console.log("Upload réussi, URL:", url);
      return NextResponse.json({ url });
    } catch (uploadError) {
      console.error("Erreur lors de l'upload vers Firebase:", uploadError);
      if (uploadError instanceof Error) {
        console.error("Stack trace:", uploadError.stack);
        return NextResponse.json(
          { error: uploadError.message },
          { status: 500 }
        );
      }
      throw uploadError;
    }
  } catch (error) {
    console.error("Erreur détaillée lors de l'upload:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'upload de l'image";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 