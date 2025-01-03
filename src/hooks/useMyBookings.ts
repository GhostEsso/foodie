import { useState, useEffect } from "react";
import { BookingStatus } from "../models/booking/booking.types";
import { MyBookingsState } from "../models/dish/my-bookings.types";

export function useMyBookings() {
  const [state, setState] = useState<MyBookingsState>({
    dishes: [],
    isLoading: true,
    error: ""
  });

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/dishes/my-bookings");
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setState(prev => ({
        ...prev,
        dishes: data,
        isLoading: false
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : "Une erreur est survenue",
        isLoading: false
      }));
    }
  };

  const getStatusLabel = (status: BookingStatus): string => {
    switch (status) {
      case "PENDING":
        return "En attente";
      case "APPROVED":
        return "Approuvée";
      case "REJECTED":
        return "Rejetée";
      case "CANCELLED":
        return "Annulée";
      default:
        return status;
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    ...state,
    fetchBookings,
    getStatusLabel
  };
} 