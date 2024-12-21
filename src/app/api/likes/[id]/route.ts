import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { LikeService } from '../../../../services/like.service';

const likeService = new LikeService();

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    const isLiked = await likeService.toggleLike(
      params.id,
      session.user.id
    );

    return NextResponse.json(isLiked);
  } catch (error) {
    console.error('Erreur lors du toggle du like:', error);
    return new NextResponse('Erreur serveur', { status: 500 });
  }
} 