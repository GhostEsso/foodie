import { useState } from 'react';
import { BookingFormDish, BookingFormData } from '../models/booking/booking.types';

interface UseBookingFormProps {
  dish: BookingFormDish;
  onSubmit: (data: BookingFormData) => Promise<void>;
}

export function useBookingForm({ dish, onSubmit }: UseBookingFormProps) {
  const [portions, setPortions] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const incrementPortions = () => {
    setPortions(prev => Math.min(dish.availablePortions, prev + 1));
  };

  const decrementPortions = () => {
    setPortions(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!dish.availableFrom) {
        throw new Error("La date de disponibilité n'est pas définie");
      }

      await onSubmit({
        dishId: dish.id,
        portions,
        pickupTime: dish.availableFrom,
      });
    } catch (error) {
      console.error("Erreur lors de la réservation:", error);
      setError(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    portions,
    isLoading,
    error,
    incrementPortions,
    decrementPortions,
    handleSubmit,
    totalPrice: dish.price * portions
  };
} 