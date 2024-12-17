"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Button from "./ui/button";

interface Booking {
  id: string;
  portions: number;
  total: number;
  status: string;
  pickupTime: string;
  user: {
    name: string;
    building: {
      name: string;
    };
  };
  dish: {
    title: string;
  };
}

interface Props {
  bookings: Booking[];
  onStatusChange: () => void;
}

export function PendingBookings({ bookings, onStatusChange }: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (bookingId: string, action: "approve" | "reject") => {
    setLoading(bookingId);
    try {
      const response = await fetch(`/api/bookings/${bookingId}/${action}`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Une erreur est survenue");
      }

      toast.success(
        action === "approve"
          ? "Réservation approuvée avec succès"
          : "Réservation rejetée avec succès"
      );
      onStatusChange();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setLoading(null);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        Aucune réservation en attente
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">{booking.dish.title}</h3>
              <p className="text-sm text-gray-600">
                Réservé par: {booking.user.name}
              </p>
              <p className="text-sm text-gray-600">
                Date de retrait:{" "}
                {format(new Date(booking.pickupTime), "d MMMM yyyy 'à' HH'h'mm", {
                  locale: fr,
                })}
              </p>
              <p className="text-sm text-gray-600">
                Portions: {booking.portions} | Total: {booking.total}€
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleAction(booking.id, "approve")}
                disabled={loading === booking.id}
                variant="primary"
                size="sm"
              >
                {loading === booking.id ? "..." : "Approuver"}
              </Button>
              <Button
                onClick={() => handleAction(booking.id, "reject")}
                disabled={loading === booking.id}
                variant="danger"
                size="sm"
              >
                {loading === booking.id ? "..." : "Rejeter"}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}