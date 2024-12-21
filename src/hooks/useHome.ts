import { useState, useEffect } from 'react';

export function useHome() {
  const [recentDishes, setRecentDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecentDishes();
  }, []);

  const fetchRecentDishes = async () => {
    try {
      const response = await fetch('/api/dishes/recent');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des plats récents');
      }
      const data = await response.json();
      setRecentDishes(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    recentDishes,
    isLoading,
    error
  };
} 