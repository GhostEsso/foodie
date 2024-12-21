import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/store";

export async function GET() {
  try {
    const dishes = await prisma.dish.findMany({
      where: {
        available: true,
      },
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
        createdAt: "desc",
      },
      take: 3,
    });

    return NextResponse.json(dishes);
  } catch (error) {
    console.error("[RECENT_DISHES_GET]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
} 