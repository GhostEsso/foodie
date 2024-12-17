"use client";

import React, { useState } from "react";
import Button from "../ui/button";
import { formatPrice } from "../../lib/utils";

interface BookingFormProps {
  dish: {
    id: string;
    title: string;
    price: number;
    portions: number;
    availablePortions: number;
    availableFrom: string | null;
    availableTo: string | null;
  };
  onSubmit: (data: {
    dishId: string;
    portions: number;
    pickupTime: string;
  }) => Promise<void>;
}

export function BookingForm({ dish, onSubmit }: BookingFormProps) {
  const [portions, setPortions] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre de portions
        </label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPortions(Math.max(1, portions - 1))}
            disabled={portions === 1}
          >
            -
          </Button>
          <span className="text-lg font-medium">{portions}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPortions(Math.min(dish.availablePortions, portions + 1))}
            disabled={portions === dish.availablePortions}
          >
            +
          </Button>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {dish.availablePortions} portions disponibles
        </p>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Total</span>
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(dish.price * portions)}
          </span>
        </div>
        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Confirmer la réservation
        </Button>
      </div>
    </form>
  );
} 