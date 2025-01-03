import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { LikeService } from '../../../../../services/like.service';

const likeService = new LikeService();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    const likes = await likeService.getDishLikes(params.id);
    return NextResponse.json(likes);
  } catch (error) {
    console.error('Erreur lors de la récupération des likes du plat:', error);
    return new NextResponse('Erreur serveur', { status: 500 });
  }
} 