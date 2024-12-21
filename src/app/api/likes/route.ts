import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { LikeService } from '../../../services/like.service';

const likeService = new LikeService();

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filters = {
      userId: searchParams.get('userId') || undefined,
      dishId: searchParams.get('dishId') || undefined,
      fromDate: searchParams.get('fromDate')
        ? new Date(searchParams.get('fromDate')!)
        : undefined,
      toDate: searchParams.get('toDate')
        ? new Date(searchParams.get('toDate')!)
        : undefined
    };

    const sort = searchParams.get('sortField')
      ? {
          field: searchParams.get('sortField')!,
          direction: searchParams.get('sortDirection') || 'desc'
        }
      : undefined;

    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    const response = await likeService.getLikes(
      filters,
      sort,
      page,
      pageSize
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération des likes:', error);
    return new NextResponse('Erreur serveur', { status: 500 });
  }
} 