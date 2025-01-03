import { useState, useEffect, useCallback } from 'react';
import { UserProfile, UserFilters, UserSortOptions } from '../models/user/user.types';

interface UseUsersOptions {
  filters?: UserFilters;
  sort?: UserSortOptions;
  page?: number;
  pageSize?: number;
}

export function useUsers(options: UseUsersOptions = {}) {
  const {
    filters,
    sort,
    page = 1,
    pageSize = 10
  } = options;

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.role) {
        queryParams.append('role', filters.role);
      }
      if (filters?.buildingId) {
        queryParams.append('buildingId', filters.buildingId);
      }
      if (filters?.isBlocked !== undefined) {
        queryParams.append('isBlocked', filters.isBlocked.toString());
      }
      if (filters?.emailVerified !== undefined) {
        queryParams.append('emailVerified', filters.emailVerified.toString());
      }
      if (filters?.search) {
        queryParams.append('search', filters.search);
      }
      if (sort) {
        queryParams.append('sortField', sort.field);
        queryParams.append('sortDirection', sort.direction);
      }
      queryParams.append('page', page.toString());
      queryParams.append('pageSize', pageSize.toString());

      const response = await fetch(`/api/users?${queryParams}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs');
      }
      
      const data = await response.json();
      setUsers(data.users);
      setTotalCount(data.totalCount);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [filters, sort, page, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUser = async (userId: string, data: Partial<UserProfile>) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
      }

      await fetchUsers();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  const blockUser = async (userId: string, isBlocked: boolean) => {
    try {
      const response = await fetch(`/api/users/${userId}/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isBlocked }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du blocage/déblocage de l\'utilisateur');
      }

      await fetchUsers();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  return {
    users,
    totalCount,
    isLoading,
    error,
    updateUser,
    blockUser,
    refreshUsers: fetchUsers
  };
} 