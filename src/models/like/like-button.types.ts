export interface LikeButtonProps {
  dishId: string;
  initialIsLiked?: boolean;
  onLikeChange?: (isLiked: boolean) => void;
  className?: string;
}

export interface LikeButtonState {
  isLiked: boolean;
  isLoading: boolean;
}

export interface LikeButtonHandlers {
  handleClick: () => Promise<void>;
} 