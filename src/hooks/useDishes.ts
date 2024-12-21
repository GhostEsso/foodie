import { useState, useEffect, useCallback } from 'react';
import {
    DishWithUser,
    DishFilters,
    DishSortOptions,
    CreateDishData,
    UpdateDishData
} from '../models/dish/dish.types';

interface UseDishesOptions {
  filters?: DishFilters;
  sort?: DishSortOptions;
  page?: number;
  pageSize?: number;
}

export function useDishes(options: UseDishesOptions = {}) {
  const {
    filters,
    sort,
    page = 1,
    pageSize = 10
  } = options;

  const [dishes, setDishes] = useState<DishWithUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDishes = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.search) {
        queryParams.append('search', filters.search);
      }
      if (filters?.userId) {
        queryParams.append('userId', filters.userId);
      }
      if (filters?.buildingId) {
        queryParams.append('buildingId', filters.buildingId);
      }
      if (filters?.minPrice) {
        queryParams.append('minPrice', filters.minPrice.toString());
      }
      if (filters?.maxPrice) {
        queryParams.append('maxPrice', filters.maxPrice.toString());
      }
      if (filters?.availableNow !== undefined) {
        queryParams.append('availableNow', filters.availableNow.toString());
      }
      if (filters?.hasPortions !== undefined) {
        queryParams.append('hasPortions', filters.hasPortions.toString());
      }
      if (sort) {
        queryParams.append('sortField', sort.field);
        queryParams.append('sortDirection', sort.direction);
      }
      queryParams.append('page', page.toString());
      queryParams.append('pageSize', pageSize.toString());

      const response = await fetch(`/api/dishes?${queryParams}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des plats');
      }
      
      const data = await response.json();
      setDishes(data.dishes);
      setTotalCount(data.totalCount);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [filters, sort, page, pageSize]);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  const createDish = async (data: CreateDishData) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'images') {
          value.forEach((image: File) => {
            formData.append('images', image);
          });
        } else {
          formData.append(key, value?.toString() || '');
        }
      });

      const response = await fetch('/api/dishes', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du plat');
      }

      await fetchDishes();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  const updateDish = async (dishId: string, data: UpdateDishData) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'images' && value) {
          value.forEach((image: File) => {
            formData.append('images', image);
          });
        } else if (value !== undefined) {
          formData.append(key, value?.toString() || '');
        }
      });

      const response = await fetch(`/api/dishes/${dishId}`, {
        method: 'PATCH',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du plat');
      }

      await fetchDishes();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  const deleteDish = async (dishId: string) => {
    try {
      const response = await fetch(`/api/dishes/${dishId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du plat');
      }

      await fetchDishes();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  const toggleLike = async (dishId: string) => {
    try {
      const response = await fetch(`/api/dishes/${dishId}/like`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Erreur lors du like/unlike du plat');
      }

      await fetchDishes();
      return response.json();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      return false;
    }
  };

  return {
    dishes,
    totalCount,
    isLoading,
    error,
    createDish,
    updateDish,
    deleteDish,
    toggleLike,
    refreshDishes: fetchDishes
  };
} 