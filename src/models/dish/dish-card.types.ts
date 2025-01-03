export interface DishCardUser {
  id: string;
  name: string;
  building: {
    name: string;
  };
}

export interface DishCardData {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  available: boolean;
  portions: number;
  likesCount: number;
  availableFrom: string | null;
  availableTo: string | null;
  user: DishCardUser;
}

export interface DishCardProps {
  dish: DishCardData;
  currentUserId?: string | null;
  showActions?: boolean;
  className?: string;
  imageClassName?: string;
}

export interface DishCardState {
  isLiked: boolean;
  isLoading: boolean;
  likesCount: number;
} 