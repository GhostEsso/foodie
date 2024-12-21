import { useState, useEffect, useCallback } from 'react';
import { BuildingWithUsers, UpdateBuildingData, UseBuildingOptions } from '../models/building/building.types';
import { BuildingService } from '../services/building.service';

export function useBuilding({ buildingId, includeUsers = true }: UseBuildingOptions) {
  const [building, setBuilding] = useState<BuildingWithUsers | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buildingService = new BuildingService();

  const fetchBuilding = useCallback(async () => {
    if (!buildingId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await buildingService.getBuildingById(buildingId);
      setBuilding(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [buildingId, buildingService]);

  useEffect(() => {
    fetchBuilding();
  }, [fetchBuilding]);

  const updateBuilding = useCallback(async (data: UpdateBuildingData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedBuilding = await buildingService.updateBuilding(buildingId, data);
      await fetchBuilding();
      return updatedBuilding;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [buildingId, buildingService, fetchBuilding]);

  const addUser = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await buildingService.addUserToBuilding(buildingId, userId);
      await fetchBuilding();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [buildingId, buildingService, fetchBuilding]);

  const removeUser = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await buildingService.removeUserFromBuilding(userId);
      await fetchBuilding();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [buildingService, fetchBuilding]);

  return {
    building,
    isLoading,
    error,
    updateBuilding,
    addUser,
    removeUser,
    refreshBuilding: fetchBuilding
  };
} 