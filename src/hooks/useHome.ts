import { useState, useEffect } from 'react';
import { IDish } from '../models';

export function useHome() {
  const [recentDishes, setRecentDishes] = useState<IDish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecentDishes() {
      try {
        const response = await fetch('/api/dishes/recent');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des plats récents');
        }
        const data = await response.json();
        setRecentDishes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecentDishes();
  }, []);

  return { recentDishes, isLoading, error };
} 