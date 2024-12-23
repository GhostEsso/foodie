import { useState, useEffect } from "react";
import { DishCardProps, DishCardState } from "../models/dish/dish-card.types";

export function useDishCard({ dish, currentUserId }: DishCardProps) {
  const [state, setState] = useState<DishCardState>({
    isLiked: false,
    isLoading: false,
    likesCount: dish.likesCount
  });

  const isAuthor = currentUserId === dish.user.id;

  useEffect(() => {
    if (currentUserId) {
      fetchLikeStatus();
    }
  }, [dish.id, currentUserId]);

  const fetchLikeStatus = async () => {
    try {
      const response = await fetch(`/api/dishes/${dish.id}/like`);
      const data = await response.json();
      setState(prev => ({
        ...prev,
        isLiked: data.liked,
        likesCount: data.likesCount
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération du statut du like:", error);
    }
  };

  const handleLike = async () => {
    if (!currentUserId) return;
    
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch(`/api/dishes/${dish.id}/like`, {
        method: "POST",
      });
      const data = await response.json();
      setState(prev => ({
        ...prev,
        isLiked: data.liked,
        likesCount: data.likesCount
      }));
    } catch (error) {
      console.error("Erreur lors du like:", error);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return {
    isLiked: state.isLiked,
    isLoading: state.isLoading,
    likesCount: state.likesCount,
    isAuthor,
    handleLike
  };
} 