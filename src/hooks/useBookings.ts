import { useState, useEffect, useCallback } from 'react';

interface Booking {
  id: string;
  portions: number;
  total: number;
  status: string;
  pickupTime: string;
  user: {
    name: string;
    building: {
      name: string;
    };
  };
  dish: {
    title: string;
  };
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/dishes/pending-bookings");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des réservations");
      }
      const data = await response.json();
      setBookings(data);
      setError(null);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    isLoading,
    error,
    refetch: fetchBookings
  };
} 