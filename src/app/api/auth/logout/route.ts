import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    cookies().delete("token");
    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: {
          "Location": "/",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la déconnexion" },
      { status: 500 }
    );
  }
} 