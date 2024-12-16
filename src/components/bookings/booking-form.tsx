"use client";

import { useState } from "react";
import Button from "../ui/button";
import { formatPrice } from "../../lib/utils";

interface BookingFormProps {
  dish: {
    id: string;
    title: string;
    price: number;
    portions: number;
    availablePortions: number;
  };
  onSubmit: (data: {
    dishId: string;
    portions: number;
    pickupTime: string;
  }) => Promise<void>;
}

export function BookingForm({ dish, onSubmit }: BookingFormProps) {
  const [portions, setPortions] = useState(1);
  const [pickupTime, setPickupTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Générer les créneaux horaires disponibles (de 11h à 21h)
  const timeSlots = Array.from({ length: 21 }, (_, i) => {
    const hour = Math.floor(i / 2) + 11;
    const minutes = i % 2 === 0 ? "00" : "30";
    return `${hour}:${minutes}`;
  });

  // Obtenir la date de demain
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupTime) return;

    setIsLoading(true);
    try {
      const [date, time] = pickupTime.split(" ");
      const pickupDateTime = new Date(`${date}T${time}:00`);
      
      await onSubmit({
        dishId: dish.id,
        portions,
        pickupTime: pickupDateTime.toISOString(),
      });
    } catch (error) {
      console.error("Erreur lors de la réservation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date et heure de retrait
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="date"
            min={minDate}
            className="rounded-xl border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            value={pickupTime.split(" ")[0] || ""}
            onChange={(e) => setPickupTime(`${e.target.value} ${pickupTime.split(" ")[1] || ""}`)}
            required
          />
          <select
            className="rounded-xl border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            value={pickupTime.split(" ")[1] || ""}
            onChange={(e) => setPickupTime(`${pickupTime.split(" ")[0] || minDate} ${e.target.value}`)}
            required
          >
            <option value="">Choisir une heure</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
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
          disabled={!pickupTime || isLoading}
        >
          Confirmer la réservation
        </Button>
      </div>
    </form>
  );
} 