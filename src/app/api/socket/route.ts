import { NextResponse } from 'next/server';
import { initSocket, NextApiResponseWithSocket } from '../../../lib/socket';

export async function GET(req: Request, res: NextApiResponseWithSocket) {
  try {
    const io = initSocket(res);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du WebSocket:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 