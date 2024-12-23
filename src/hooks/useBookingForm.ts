import { useState } from "react";
import { BookingFormDish, BookingFormData, BookingFormState } from "../models/booking/booking-form.types";

interface UseBookingFormProps {
  dish: BookingFormDish;
  onSubmit: (data: BookingFormData) => Promise<void>;
}

export function useBookingForm({ dish, onSubmit }: UseBookingFormProps) {
  const [state, setState] = useState<BookingFormState>({
    portions: 1,
    isLoading: false,
    error: null
  });

  const incrementPortions = () => {
    setState(prev => ({
      ...prev,
      portions: Math.min(dish.availablePortions, prev.portions + 1)
    }));
  };

  const decrementPortions = () => {
    setState(prev => ({
      ...prev,
      portions: Math.max(1, prev.portions - 1)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      if (!dish.availableFrom) {
        throw new Error("La date de disponibilité n'est pas définie");
      }

      await onSubmit({
        dishId: dish.id,
        portions: state.portions,
        pickupTime: dish.availableFrom,
      });
    } catch (error) {
      console.error("Erreur lors de la réservation:", error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Une erreur est survenue"
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return {
    portions: state.portions,
    isLoading: state.isLoading,
    error: state.error,
    incrementPortions,
    decrementPortions,
    handleSubmit,
    total: dish.price * state.portions
  };
} 