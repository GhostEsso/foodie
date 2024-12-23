import { useState, useEffect } from 'react';
import { DishWithUser } from '../models/dish/dish.types';

interface UseHomeReturn {
  session: any;
  recentDishes: DishWithUser[];
  isLoading: boolean;
  error: string | null;
}

export function useHome(): UseHomeReturn {
  const [session, setSession] = useState<any>(null);
  const [recentDishes, setRecentDishes] = useState<DishWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionRes, dishesRes] = await Promise.all([
          fetch("/api/auth/session"),
          fetch("/api/dishes/recent")
        ]);

        const [sessionData, dishesData] = await Promise.all([
          sessionRes.json(),
          dishesRes.json()
        ]);

        setSession(sessionData);
        setRecentDishes(dishesData);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    session,
    recentDishes,
    isLoading,
    error
  };
} 