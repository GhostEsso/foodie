import { useState, useEffect, useCallback } from 'react';
import { UserProfile, UseUserOptions, UpdateUserData } from '../models/user/user.types';
import { UserService } from '../services/user.service';

export function useUser({ userId, includeProfile = true }: UseUserOptions) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userService = new UserService();

  const fetchUser = useCallback(async () => {
    if (!includeProfile) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getUserById(userId);
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [userId, includeProfile, userService]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const updateUser = useCallback(async (data: UpdateUserData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.updateUser(userId, data);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId, userService]);

  const updateBuilding = useCallback(async (buildingId: string | null) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.updateBuilding(userId, buildingId);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId, userService]);

  const verifyEmail = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await userService.verifyEmail(userId);
      await fetchUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId, userService, fetchUser]);

  return {
    user,
    isLoading,
    error,
    updateUser,
    updateBuilding,
    verifyEmail,
    refreshUser: fetchUser
  };
} 