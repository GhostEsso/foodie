import { NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("[SESSION_GET]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
} 