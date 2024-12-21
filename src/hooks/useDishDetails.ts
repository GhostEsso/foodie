import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';

interface DishDetails {
  id: string;
  title: string;
  description: string;
  price: number;
  portions: number;
  images: string[];
  ingredients: string[];
  available: boolean;
  availableFrom: string | null;
  availableTo: string | null;
  user: {
    id: string;
    name: string;
    building: {
      name: string;
    };
  };
  bookings: Array<{ portions: number }>;
}

interface Session {
  id: string;
}

export function useDishDetails(dishId: string) {
  const [dish, setDish] = useState<DishDetails | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [sessionRes, dishRes] = await Promise.all([
          fetch("/api/auth/session"),
          fetch(`/api/dishes/${dishId}`)
        ]);

        const sessionData = await sessionRes.json();
        const dishData = await dishRes.json();

        if (!dishData || dishData.error) {
          notFound();
        }

        setSession(sessionData);
        setDish(dishData);
        setError(null);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        setError(error instanceof Error ? error.message : "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dishId]);

  const bookedPortions = dish?.bookings.reduce((sum, booking) => sum + booking.portions, 0) ?? 0;
  const availablePortions = dish ? dish.portions - bookedPortions : 0;
  const isAuthor = session?.id === dish?.user.id;

  return {
    dish,
    session,
    isLoading,
    error,
    isAuthor,
    availablePortions,
  };
} 