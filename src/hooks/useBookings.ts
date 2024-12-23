import { useState, useEffect, useCallback } from 'react';
import {
    Booking,
    BookingFilters,
    BookingSortOptions,
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

  const [state, setState] = useState<{
    bookings: Booking[];
    totalCount: number;
    isLoading: boolean;
    isRefreshing: boolean;
    error: string | null;
    pendingBookings: Set<string>;
  }>({
    bookings: [],
    totalCount: 0,
    isLoading: true,
    isRefreshing: false,
    error: null,
    pendingBookings: new Set()
  });

  const fetchBookings = useCallback(async (showLoading = true) => {
    if (state.bookings.length > 0) {
      showLoading = false;
    }

    setState(prev => ({
      ...prev,
      isLoading: showLoading,
      isRefreshing: !showLoading,
      error: null
    }));

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

      const response = await fetch(`/api/bookings?${queryParams}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération des réservations');
      }
      
      const data = await response.json();
      setState(prev => ({
        ...prev,
        bookings: data.bookings,
        totalCount: data.totalCount,
        isLoading: false,
        isRefreshing: false,
        error: null
      }));
    } catch (error) {
      console.error('Erreur fetchBookings:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
        isLoading: false,
        isRefreshing: false
      }));
    }
  }, [filters, sort, page, pageSize]);

  const updateStatus = async (bookingId: string, status: BookingStatus) => {
    setState(prev => ({
      ...prev,
      pendingBookings: new Set([...prev.pendingBookings, bookingId])
    }));

    try {
      const endpoint = status === 'APPROVED' ? 'approve' : 'reject';
      const response = await fetch(`/api/bookings/${bookingId}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour du statut');
      }

      const updatedBooking = await response.json();
      console.log('Réservation mise à jour:', updatedBooking);

      setState(prev => ({
        ...prev,
        bookings: prev.bookings.filter(b => b.id !== bookingId),
        pendingBookings: new Set([...prev.pendingBookings].filter(id => id !== bookingId))
      }));

    } catch (error) {
      console.error('Erreur updateStatus:', error);
      setState(prev => ({
        ...prev,
        pendingBookings: new Set([...prev.pendingBookings].filter(id => id !== bookingId)),
        error: error instanceof Error ? error.message : 'Une erreur est survenue'
      }));
      throw error;
    }
  };

  useEffect(() => {
    fetchBookings(true);
  }, [fetchBookings]);

  return {
    ...state,
    updateStatus,
    refreshBookings: () => fetchBookings(false)
  };
} 