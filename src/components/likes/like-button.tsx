import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useLikes } from '../../hooks/useLikes';
import Button from '../ui/button';
import { cn } from '../../lib/utils';

interface LikeButtonProps {
  dishId: string;
  initialIsLiked?: boolean;
  onLikeChange?: (isLiked: boolean) => void;
  className?: string;
}

export function LikeButton({
  dishId,
  initialIsLiked = false,
  onLikeChange,
  className
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);
  const { toggleLike } = useLikes();

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const result = await toggleLike(dishId);
      setIsLiked(result);
      onLikeChange?.(result);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        'group hover:bg-pink-100 dark:hover:bg-pink-900 h-9 w-9 p-0',
        className
      )}
    >
      <Heart
        className={cn(
          'h-5 w-5 transition-colors',
          isLiked
            ? 'fill-pink-500 text-pink-500'
            : 'fill-none text-gray-500 group-hover:text-pink-500'
        )}
      />
      <span className="sr-only">
        {isLiked ? 'Ne plus aimer' : 'Aimer'}
      </span>
    </Button>
  );
} 