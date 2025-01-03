import { useState, useEffect, useCallback } from 'react';
import {
    BuildingWithUsers,
    BuildingFilters,
    BuildingSortOptions,
    CreateBuildingData,
    UpdateBuildingData
} from '../models/building/building.types';

interface UseBuildingsOptions {
  filters?: BuildingFilters;
  sort?: BuildingSortOptions;
  page?: number;
  pageSize?: number;
}

export function useBuildings(options: UseBuildingsOptions = {}) {
  const {
    filters,
    sort,
    page = 1,
    pageSize = 10
  } = options;

  const [buildings, setBuildings] = useState<BuildingWithUsers[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBuildings = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.search) {
        queryParams.append('search', filters.search);
      }
      if (filters?.hasUsers !== undefined) {
        queryParams.append('hasUsers', filters.hasUsers.toString());
      }
      if (sort) {
        queryParams.append('sortField', sort.field);
        queryParams.append('sortDirection', sort.direction);
      }
      queryParams.append('page', page.toString());
      queryParams.append('pageSize', pageSize.toString());

      const response = await fetch(`/api/buildings?${queryParams}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des bâtiments');
      }
      
      const data = await response.json();
      setBuildings(data.buildings);
      setTotalCount(data.totalCount);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [filters, sort, page, pageSize]);

  useEffect(() => {
    fetchBuildings();
  }, [fetchBuildings]);

  const createBuilding = async (data: CreateBuildingData) => {
    try {
      const response = await fetch('/api/buildings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du bâtiment');
      }

      await fetchBuildings();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  const updateBuilding = async (buildingId: string, data: UpdateBuildingData) => {
    try {
      const response = await fetch(`/api/buildings/${buildingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du bâtiment');
      }

      await fetchBuildings();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  const deleteBuilding = async (buildingId: string) => {
    try {
      const response = await fetch(`/api/buildings/${buildingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du bâtiment');
      }

      await fetchBuildings();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  return {
    buildings,
    totalCount,
    isLoading,
    error,
    createBuilding,
    updateBuilding,
    deleteBuilding,
    refreshBuildings: fetchBuildings
  };
} 