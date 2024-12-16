import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const buildings = await prisma.building.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(buildings);
  } catch (error) {
    console.error("Erreur lors de la récupération des bâtiments:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des bâtiments" },
      { status: 500 }
    );
  }
} 