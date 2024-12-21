import { useState, useEffect, useCallback } from 'react';
import {
    Booking,
    BookingFilters,
    BookingSortOptions,
    CreateBookingData,
    UpdateBookingData,
    BookingStatus
} from '../models/booking/booking.types';

interface UseBookingsOptions {
  filters?: BookingFilters;
  sort?: BookingSortOptions;
  page?: number;
  pageSize?: number;
}

export function useBookings(options: UseBookingsOptions = {}) {
  const {
    filters,
    sort,
    page = 1,
    pageSize = 10
  } = options;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.status) {
        queryParams.append('status', filters.status);
      }
      if (filters?.userId) {
        queryParams.append('userId', filters.userId);
      }
      if (filters?.dishId) {
        queryParams.append('dishId', filters.dishId);
      }
      if (filters?.fromDate) {
        queryParams.append('fromDate', filters.fromDate.toISOString());
      }
      if (filters?.toDate) {
        queryParams.append('toDate', filters.toDate.toISOString());
      }
      if (sort) {
        queryParams.append('sortField', sort.field);
        queryParams.append('sortDirection', sort.direction);
      }
      queryParams.append('page', page.toString());
      queryParams.append('pageSize', pageSize.toString());

      const response = await fetch(`/api/bookings?${queryParams}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des réservations');
      }
      
      const data = await response.json();
      setBookings(data.bookings);
      setTotalCount(data.totalCount);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [filters, sort, page, pageSize]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const createBooking = async (data: CreateBookingData) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la réservation');
      }

      await fetchBookings();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  const updateBooking = async (bookingId: string, data: UpdateBookingData) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la réservation');
      }

      await fetchBookings();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'annulation de la réservation');
      }

      await fetchBookings();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  const updateStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }

      await fetchBookings();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  return {
    bookings,
    totalCount,
    isLoading,
    error,
    createBooking,
    updateBooking,
    cancelBooking,
    updateStatus,
    refreshBookings: fetchBookings
  };
} 