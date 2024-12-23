import { useState, useEffect, useCallback } from "react";

interface UseBookingsOptions {
  filters?: {
    status?: string;
    userId?: string;
    dishId?: string;
  };
  page?: number;
  pageSize?: number;
}

interface UseBookingsReturn {
  bookings: any[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  updateStatus: (bookingId: string, status: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useBookings({
  filters = {},
  page = 1,
  pageSize = 10,
}: UseBookingsOptions = {}): UseBookingsReturn {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      console.log('Fetching bookings with filters:', filters);
      const searchParams = new URLSearchParams();
      
      if (filters.status) searchParams.append("status", filters.status);
      if (filters.userId) searchParams.append("userId", filters.userId);
      if (filters.dishId) searchParams.append("dishId", filters.dishId);
      searchParams.append("page", page.toString());
      searchParams.append("pageSize", pageSize.toString());

      const response = await fetch(`/api/bookings?${searchParams.toString()}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la récupération des réservations");
      }

      const data = await response.json();
      console.log('Bookings received:', data);
      
      setBookings(data.bookings);
      setTotalCount(data.totalCount);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, [filters, page, pageSize]);

  const updateStatus = async (bookingId: string, status: string) => {
    try {
      console.log('Updating booking status:', { bookingId, status });
      setIsLoading(true);
      
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la mise à jour du statut");
      }

      await fetchBookings();
    } catch (err) {
      console.error('Error updating booking status:', err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered, isInitialized:', isInitialized);
    if (!isInitialized) {
      fetchBookings();
    }
  }, [fetchBookings, isInitialized]);

  const refetch = useCallback(() => {
    console.log('Refetching bookings');
    return fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    isLoading,
    error,
    totalCount,
    updateStatus,
    refetch
  };
} 