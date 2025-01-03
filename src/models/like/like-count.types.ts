export interface LikeCountProps {
  dishId: string;
  className?: string;
}

export interface LikeCountState {
  count: number;
  isLoading: boolean;
}

export interface LikeCountHandlers {
  fetchLikes: () => Promise<void>;
} 