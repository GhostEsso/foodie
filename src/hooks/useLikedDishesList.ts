import { useState, useEffect, useCallback } from "react";
import { useLikes } from "./useLikes";
import { LikedDishesListProps, LikedDishesListState } from "../models/like/liked-dishes-list.types";

export function useLikedDishesList({ userId }: Pick<LikedDishesListProps, "userId">) {
  const [state, setState] = useState<LikedDishesListState>({
    likedDishes: [],
    isLoading: true
  });

  const { getUserLikedDishes } = useLikes();

  const fetchLikedDishes = useCallback(async () => {
    try {
      const dishes = await getUserLikedDishes(userId);
      setState(prev => ({
        ...prev,
        likedDishes: dishes
      }));
    } finally {
      setState(prev => ({
        ...prev,
        isLoading: false
      }));
    }
  }, [userId, getUserLikedDishes]);

  const handleUnlike = useCallback((likeId: string) => {
    setState(prev => ({
      ...prev,
      likedDishes: prev.likedDishes.filter(dish => dish.id !== likeId)
    }));
  }, []);

  useEffect(() => {
    fetchLikedDishes();
  }, [fetchLikedDishes]);

  return {
    ...state,
    handleUnlike,
    fetchLikedDishes
  };
} 