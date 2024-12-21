import { useState, useEffect, useCallback } from 'react';
import {
    UserProfile,
    UserFilters,
    UserSortOptions
} from '../models/user/user.types';
import { UserService } from '../services/user.service';

interface UseUsersOptions {
  pageSize?: number;
  initialPage?: number;
  initialFilters?: UserFilters;
  initialSort?: UserSortOptions;
}

export function useUsers({
  pageSize = 10,
  initialPage = 1,
  initialFilters,
  initialSort
}: UseUsersOptions = {}) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<UserFilters | undefined>(initialFilters);
  const [sort, setSort] = useState<UserSortOptions | undefined>(initialSort);

  const userService = new UserService();

  const fetchUsers = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers(page, pageSize, filters, sort);
      setUsers(data.users);
      setTotalCount(data.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [pageSize, filters, sort, userService]);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [fetchUsers, currentPage]);

  const updateFilters = useCallback((newFilters: UserFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const updateSort = useCallback((newSort: UserSortOptions) => {
    setSort(newSort);
    setCurrentPage(1);
  }, []);

  const changePage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const deleteUser = useCallback(async (userId: string) => {
    try {
      await userService.deleteUser(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
      setTotalCount(prev => prev - 1);
    } catch (err) {
      console.error('Erreur:', err);
      throw err;
    }
  }, [userService]);

  return {
    users,
    isLoading,
    error,
    totalCount,
    currentPage,
    filters,
    sort,
    updateFilters,
    updateSort,
    changePage,
    deleteUser,
    refreshUsers: () => fetchUsers(currentPage)
  };
} 