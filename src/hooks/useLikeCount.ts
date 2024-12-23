import { useState, useEffect, useCallback } from "react";
import { useLikes } from "./useLikes";
import { LikeCountProps, LikeCountState } from "../models/like/like-count.types";

export function useLikeCount({ dishId }: Pick<LikeCountProps, "dishId">) {
  const [state, setState] = useState<LikeCountState>({
    count: 0,
    isLoading: true
  });

  const { getDishLikes } = useLikes();

  const fetchLikes = useCallback(async () => {
    try {
      const likes = await getDishLikes(dishId);
      setState(prev => ({
        ...prev,
        count: likes.length
      }));
    } finally {
      setState(prev => ({
        ...prev,
        isLoading: false
      }));
    }
  }, [dishId, getDishLikes]);

  useEffect(() => {
    fetchLikes();
  }, [fetchLikes]);

  return {
    ...state,
    fetchLikes
  };
} 