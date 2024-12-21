import { useState, useEffect, useCallback } from 'react';
import { GlobalStats, StatsFilters } from '../models/stats/stats.types';
import { StatsService } from '../services/stats.service';

interface UseStatsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  initialFilters?: StatsFilters;
}

export function useStats({
  autoRefresh = false,
  refreshInterval = 60000,
  initialFilters
}: UseStatsOptions = {}) {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StatsFilters | undefined>(initialFilters);

  const statsService = new StatsService();

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await statsService.getGlobalStats(filters);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [filters, statsService]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchStats, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, fetchStats]);

  const updateFilters = useCallback((newFilters: StatsFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(undefined);
  }, []);

  return {
    stats,
    isLoading,
    error,
    filters,
    updateFilters,
    clearFilters,
    refreshStats: fetchStats
  };
}