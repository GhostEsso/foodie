import { useState, useEffect, useCallback } from 'react';
import {
    BuildingWithUsers,
    BuildingFilters,
    BuildingSortOptions,
    UseBuildingsOptions,
    CreateBuildingData
} from '../models/building/building.types';
import { BuildingService } from '../services/building.service';

export function useBuildings({
  pageSize = 10,
  initialPage = 1,
  initialFilters,
  initialSort
}: UseBuildingsOptions = {}) {
  const [buildings, setBuildings] = useState<BuildingWithUsers[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<BuildingFilters | undefined>(initialFilters);
  const [sort, setSort] = useState<BuildingSortOptions | undefined>(initialSort);

  const buildingService = new BuildingService();

  const fetchBuildings = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await buildingService.getBuildings(page, pageSize, filters, sort);
      setBuildings(data.buildings);
      setTotalCount(data.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [pageSize, filters, sort, buildingService]);

  useEffect(() => {
    fetchBuildings(currentPage);
  }, [fetchBuildings, currentPage]);

  const updateFilters = useCallback((newFilters: BuildingFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const updateSort = useCallback((newSort: BuildingSortOptions) => {
    setSort(newSort);
    setCurrentPage(1);
  }, []);

  const changePage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const createBuilding = useCallback(async (data: CreateBuildingData) => {
    try {
      const newBuilding = await buildingService.createBuilding(data);
      setBuildings(prev => [newBuilding, ...prev]);
      setTotalCount(prev => prev + 1);
      return newBuilding;
    } catch (err) {
      console.error('Erreur:', err);
      throw err;
    }
  }, [buildingService]);

  const deleteBuilding = useCallback(async (buildingId: string) => {
    try {
      await buildingService.deleteBuilding(buildingId);
      setBuildings(prev => prev.filter(building => building.id !== buildingId));
      setTotalCount(prev => prev - 1);
    } catch (err) {
      console.error('Erreur:', err);
      throw err;
    }
  }, [buildingService]);

  return {
    buildings,
    isLoading,
    error,
    totalCount,
    currentPage,
    filters,
    sort,
    updateFilters,
    updateSort,
    changePage,
    createBuilding,
    deleteBuilding,
    refreshBuildings: () => fetchBuildings(currentPage)
  };
} 