import { IDish } from './dish.interface';

export type DishStatus = 'available' | 'unavailable' | 'deleted';

export type DishWithUser = IDish & {
  user: {
    name: string;
    building?: {
      name: string;
    };
  };
};

export type DishFilters = {
  available?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  buildingId?: string;
};

export type DishSortOptions = {
  field: keyof IDish;
  direction: 'asc' | 'desc';
}; 