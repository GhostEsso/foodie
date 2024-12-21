import { NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      id: session.id,
      name: session.name,
      email: session.email,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de la session:", error);
    return NextResponse.json(null);
  }
} 