export interface Dish {
  id: string;
  title: string;
  description: string;
  price: number;
  portions: number;
  availableFrom: string | null;
  availableTo: string | null;
  images: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DishWithUser extends Dish {
  user: {
    id: string;
    name: string;
    email: string;
    building?: {
      id: string;
      name: string;
      address: string;
    };
  };
  _count: {
    bookings: number;
    likes: number;
  };
}

export interface DishFilters {
  search?: string;
  userId?: string;
  buildingId?: string;
  minPrice?: number;
  maxPrice?: number;
  availableNow?: boolean;
  hasPortions?: boolean;
}

export interface DishSortOptions {
  field: keyof Dish;
  direction: 'asc' | 'desc';
}

export interface DishResponse {
  dishes: DishWithUser[];
  totalCount: number;
}

export interface CreateDishData {
  title: string;
  description: string;
  price: number;
  portions: number;
  availableFrom?: Date | null;
  availableTo?: Date | null;
  images: File[];
}

export interface UpdateDishData {
  title?: string;
  description?: string;
  price?: number;
  portions?: number;
  availableFrom?: Date | null;
  availableTo?: Date | null;
  images?: File[];
} 