import { Like } from "./like.types";

export interface LikedDishesListProps {
  userId: string;
  className?: string;
}

export interface LikedDishesListState {
  likedDishes: Like[];
  isLoading: boolean;
}

export interface LikedDishesListHandlers {
  handleUnlike: (likeId: string) => void;
  fetchLikedDishes: () => Promise<void>;
} 