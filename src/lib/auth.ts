import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePasswords(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export async function createToken(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(JWT_SECRET));
  
  return token;
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return verified.payload as { userId: string };
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const token = cookies().get('token')?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      building: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return user;
}

export async function requireAuth(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
  }

  return payload;
} 