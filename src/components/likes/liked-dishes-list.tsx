import { useEffect, useState } from 'react';
import { useLikes } from '../../../hooks/useLikes';
import { Like } from '../../../models/like/like.types';
import { Card } from '../../ui/card';
import { LikeButton } from './like-button';
import Image from 'next/image';
import Link from 'next/link';

interface LikedDishesListProps {
  userId: string;
  className?: string;
}

export function LikedDishesList({ userId, className }: LikedDishesListProps) {
  const [likedDishes, setLikedDishes] = useState<Like[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getUserLikedDishes } = useLikes();

  useEffect(() => {
    const fetchLikedDishes = async () => {
      try {
        const dishes = await getUserLikedDishes(userId);
        setLikedDishes(dishes);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedDishes();
  }, [userId, getUserLikedDishes]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse h-24 bg-gray-200 rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (likedDishes.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Aucun plat liké pour le moment
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid gap-4">
        {likedDishes.map((like) => (
          <Card key={like.id} className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-md overflow-hidden">
                <Image
                  src={like.dish.images[0]}
                  alt={like.dish.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/dishes/${like.dish.id}`}
                  className="text-lg font-medium hover:underline truncate"
                >
                  {like.dish.title}
                </Link>
                <p className="text-sm text-gray-500 truncate">
                  Par {like.dish.user.name}
                </p>
              </div>
              <LikeButton
                dishId={like.dish.id}
                initialIsLiked={true}
                onLikeChange={(isLiked) => {
                  if (!isLiked) {
                    setLikedDishes((prev) =>
                      prev.filter((d) => d.id !== like.id)
                    );
                  }
                }}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 