export interface Like {
  id: string;
  dishId: string;
  userId: string;
  createdAt: string;
  dish: {
    id: string;
    title: string;
    images: string[];
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface LikeFilters {
  userId?: string;
  dishId?: string;
  fromDate?: Date;
  toDate?: Date;
}

export interface LikeSortOptions {
  field: keyof Like;
  direction: 'asc' | 'desc';
}

export interface LikeResponse {
  likes: Like[];
  totalCount: number;
} 