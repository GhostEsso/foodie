import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_CREDENTIALS = {
  email: "admin@foody.com",
  password: "admin123"
};

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      cookies().set({
        name: "isAdminLoggedIn",
        value: "true",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Identifiants incorrects" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Erreur lors de la connexion admin:", error);
    return NextResponse.json(
      { error: "Erreur lors de la connexion" },
      { status: 500 }
    );
  }
} 