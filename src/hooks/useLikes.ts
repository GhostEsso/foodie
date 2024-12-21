import { useState, useEffect, useCallback } from 'react';
import {
    Like,
    LikeFilters,
    LikeSortOptions
} from '../models/like/like.types';

interface UseLikesOptions {
  filters?: LikeFilters;
  sort?: LikeSortOptions;
  page?: number;
  pageSize?: number;
}

export function useLikes(options: UseLikesOptions = {}) {
  const {
    filters,
    sort,
    page = 1,
    pageSize = 10
  } = options;

  const [likes, setLikes] = useState<Like[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLikes = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.userId) {
        queryParams.append('userId', filters.userId);
      }
      if (filters?.dishId) {
        queryParams.append('dishId', filters.dishId);
      }
      if (filters?.fromDate) {
        queryParams.append('fromDate', filters.fromDate.toISOString());
      }
      if (filters?.toDate) {
        queryParams.append('toDate', filters.toDate.toISOString());
      }
      if (sort) {
        queryParams.append('sortField', sort.field);
        queryParams.append('sortDirection', sort.direction);
      }
      queryParams.append('page', page.toString());
      queryParams.append('pageSize', pageSize.toString());

      const response = await fetch(`/api/likes?${queryParams}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des likes');
      }
      
      const data = await response.json();
      setLikes(data.likes);
      setTotalCount(data.totalCount);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [filters, sort, page, pageSize]);

  useEffect(() => {
    fetchLikes();
  }, [fetchLikes]);

  const toggleLike = async (dishId: string) => {
    try {
      const response = await fetch(`/api/likes/${dishId}`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Erreur lors du like/unlike');
      }

      await fetchLikes();
      return response.json();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      return false;
    }
  };

  const getUserLikedDishes = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/liked-dishes`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des plats likés');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      return [];
    }
  };

  const getDishLikes = async (dishId: string) => {
    try {
      const response = await fetch(`/api/dishes/${dishId}/likes`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des likes du plat');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      return [];
    }
  };

  return {
    likes,
    totalCount,
    isLoading,
    error,
    toggleLike,
    getUserLikedDishes,
    getDishLikes,
    refreshLikes: fetchLikes
  };
} 