import { useState } from "react";
import { useLikes } from "./useLikes";
import { LikeButtonProps, LikeButtonState } from "../models/like/like-button.types";

export function useLikeButton({
  dishId,
  initialIsLiked = false,
  onLikeChange
}: Pick<LikeButtonProps, "dishId" | "initialIsLiked" | "onLikeChange">) {
  const [state, setState] = useState<LikeButtonState>({
    isLiked: initialIsLiked,
    isLoading: false
  });

  const { toggleLike } = useLikes();

  const handleClick = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const result = await toggleLike(dishId);
      setState(prev => ({ ...prev, isLiked: result }));
      onLikeChange?.(result);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return {
    ...state,
    handleClick
  };
} 