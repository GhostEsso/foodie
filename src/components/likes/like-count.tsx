import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useLikes } from '../../../hooks/useLikes';
import { cn } from '../../../lib/utils';

interface LikeCountProps {
  dishId: string;
  className?: string;
}

export function LikeCount({ dishId, className }: LikeCountProps) {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { getDishLikes } = useLikes();

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const likes = await getDishLikes(dishId);
        setCount(likes.length);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikes();
  }, [dishId, getDishLikes]);

  if (isLoading) {
    return <div className="animate-pulse h-5 w-12 bg-gray-200 rounded" />;
  }

  return (
    <div className={cn('flex items-center gap-1 text-sm', className)}>
      <Heart className="h-4 w-4" />
      <span>{count}</span>
    </div>
  );
} 