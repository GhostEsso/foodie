import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const building = await prisma.building.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(building);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression du bâtiment" },
      { status: 500 }
    );
  }
} 