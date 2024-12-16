import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Supprimer le cookie de token
  cookies().delete("token");
  
  return NextResponse.json({ message: "Déconnexion réussie" });
} 