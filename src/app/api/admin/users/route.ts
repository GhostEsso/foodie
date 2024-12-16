import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  console.log("API route called");
  
  try {
    console.log("Fetching users...");
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        apartment: true,
        buildingId: true,
        isBlocked: true,
        building: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    console.log("Users data:", JSON.stringify(users, null, 2));
    return NextResponse.json(users);
  } catch (error) {
    console.error("Detailed error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des utilisateurs" },
      { status: 500 }
    );
  }
} 