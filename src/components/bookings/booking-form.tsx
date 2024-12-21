"use client";

import React from "react";
import Button from "../ui/button";
import { formatPrice } from "../../lib/utils";
import { useBookingForm } from "../../hooks/useBookingForm";
import { BookingFormDish, BookingFormData } from "../../models/booking/booking.types";

interface BookingFormProps {
  dish: BookingFormDish;
  onSubmit: (data: BookingFormData) => Promise<void>;
}

export function BookingForm({ dish, onSubmit }: BookingFormProps) {
  const {
    portions,
    isLoading,
    error,
    incrementPortions,
    decrementPortions,
    handleSubmit,
    totalPrice
  } = useBookingForm({ dish, onSubmit });

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
            onClick={decrementPortions}
            disabled={portions === 1}
          >
            -
          </Button>
          <span className="text-lg font-medium">{portions}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={incrementPortions}
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
            {formatPrice(totalPrice)}
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