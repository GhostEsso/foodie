import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// Récupérer tous les bâtiments
export async function GET() {
  try {
    const buildings = await prisma.building.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    return NextResponse.json(buildings);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des bâtiments" },
      { status: 500 }
    );
  }
}

// Créer un nouveau bâtiment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Le nom du bâtiment est requis" },
        { status: 400 }
      );
    }

    const building = await prisma.building.create({
      data: {
        name,
        address: name // Pour l'instant, on utilise le même nom comme adresse
      }
    });

    return NextResponse.json(building);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création du bâtiment" },
      { status: 500 }
    );
  }
} 