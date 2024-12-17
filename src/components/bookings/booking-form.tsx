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
  const [pickupTime, setPickupTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Générer les créneaux horaires disponibles en fonction des heures de disponibilité du plat
  const getTimeSlots = (selectedDate: string) => {
    const slots: string[] = [];
    const selectedDateTime = new Date(selectedDate);
    const availableFrom = dish.availableFrom ? new Date(dish.availableFrom) : null;
    const availableTo = dish.availableTo ? new Date(dish.availableTo) : null;

    // Si pas dans la plage de dates, retourner un tableau vide
    if (availableFrom && selectedDateTime < availableFrom) return [];
    if (availableTo && selectedDateTime > availableTo) return [];

    // Déterminer les heures de début et fin pour la date sélectionnée
    let startTime = new Date(selectedDateTime);
    startTime.setHours(0, 0, 0, 0);
    let endTime = new Date(selectedDateTime);
    endTime.setHours(23, 59, 0, 0);

    // Ajuster si c'est le même jour que availableFrom/availableTo
    if (availableFrom?.toDateString() === selectedDateTime.toDateString()) {
      startTime = availableFrom;
    }
    if (availableTo?.toDateString() === selectedDateTime.toDateString()) {
      endTime = availableTo;
    }

    // Générer les créneaux
    let current = new Date(startTime);
    while (current <= endTime) {
      slots.push(current.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }));
      current.setMinutes(current.getMinutes() + 30);
    }

    return slots;
  };

  // Obtenir la date minimum de réservation
  const getMinDate = () => {
    if (dish.availableFrom) {
      return new Date(dish.availableFrom).toISOString().split("T")[0];
    }
    return new Date().toISOString().split("T")[0];
  };

  // Obtenir la date maximum de réservation
  const getMaxDate = () => {
    if (dish.availableTo) {
      return new Date(dish.availableTo).toISOString().split("T")[0];
    }
    const defaultMaxDate = new Date();
    defaultMaxDate.setDate(defaultMaxDate.getDate() + 7); // Par défaut, 7 jours
    return defaultMaxDate.toISOString().split("T")[0];
  };

  // Formater la date et l'heure pour l'affichage
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Vérifier si un créneau horaire est disponible
  const isTimeSlotAvailable = (date: string, time: string) => {
    if (!date) return false;
    
    const [hours, minutes] = time.split(":");
    const dateTime = new Date(date);
    dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    if (dish.availableFrom) {
      const availableFrom = new Date(dish.availableFrom);
      if (dateTime < availableFrom) {
        return false;
      }
    }
    
    if (dish.availableTo) {
      const availableTo = new Date(dish.availableTo);
      if (dateTime > availableTo) {
        return false;
      }
    }

    return true;
  };

  // Vérifier si une date est disponible
  const isDateAvailable = (date: string) => {
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    const availableFrom = dish.availableFrom ? new Date(dish.availableFrom) : null;
    const availableTo = dish.availableTo ? new Date(dish.availableTo) : null;
    
    if (availableFrom) {
      const fromDate = new Date(availableFrom);
      fromDate.setHours(0, 0, 0, 0);
      if (selectedDate < fromDate) return false;
    }
    
    if (availableTo) {
      const toDate = new Date(availableTo);
      toDate.setHours(0, 0, 0, 0);
      if (selectedDate > toDate) return false;
    }
    
    return true;
  };

  // Générer les dates disponibles
  const getAvailableDates = () => {
    const dates: string[] = [];
    const start = dish.availableFrom ? new Date(dish.availableFrom) : new Date();
    const end = dish.availableTo ? new Date(dish.availableTo) : new Date(start);
    end.setDate(end.getDate() + 7);

    let current = new Date(start);
    while (current <= end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupTime) return;

    setIsLoading(true);
    try {
      const [date, time] = pickupTime.split(" ");
      const [hours, minutes] = time.split(":");
      const pickupDateTime = new Date(date);
      pickupDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      // Vérifier si la date/heure choisie est dans la plage de disponibilité
      if (dish.availableFrom) {
        const availableFrom = new Date(dish.availableFrom);
        if (pickupDateTime < availableFrom) {
          throw new Error(`Le plat n'est disponible qu'à partir du ${availableFrom.toLocaleString("fr-FR")}`);
        }
      }
      
      if (dish.availableTo) {
        const availableTo = new Date(dish.availableTo);
        if (pickupDateTime > availableTo) {
          throw new Error(`Le plat n'est disponible que jusqu'au ${availableTo.toLocaleString("fr-FR")}`);
        }
      }

      await onSubmit({
        dishId: dish.id,
        portions,
        pickupTime: pickupDateTime.toISOString(),
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date et heure de retrait
        </label>
        {dish.availableFrom && dish.availableTo && (
          <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <p>Plat disponible du :</p>
            <p className="font-medium">{formatDateTime(dish.availableFrom)}</p>
            <p>au :</p>
            <p className="font-medium">{formatDateTime(dish.availableTo)}</p>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <select
            className="rounded-xl border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            value={pickupTime.split(" ")[0] || ""}
            onChange={(e) => {
              const newDate = e.target.value;
              setPickupTime(newDate);
            }}
            required
          >
            <option value="">Choisir une date</option>
            {getAvailableDates().map((date) => (
              <option 
                key={date} 
                value={date}
                disabled={!isDateAvailable(date)}
              >
                {new Date(date).toLocaleDateString('fr-FR')}
              </option>
            ))}
          </select>

          <select
            className="rounded-xl border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            value={pickupTime.split(" ")[1] || ""}
            onChange={(e) => setPickupTime(`${pickupTime.split(" ")[0]} ${e.target.value}`)}
            required
            disabled={!pickupTime.split(" ")[0]}
          >
            <option value="">Choisir une heure</option>
            {pickupTime.split(" ")[0] && getTimeSlots(pickupTime.split(" ")[0]).map((time) => (
              <option 
                key={time} 
                value={time}
                disabled={!isTimeSlotAvailable(pickupTime.split(" ")[0], time)}
              >
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