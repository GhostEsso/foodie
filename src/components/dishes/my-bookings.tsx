"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "../../lib/utils";

interface Booking {
  id: string;
  portions: number;
  total: number;
  status: string;
  pickupTime: string;
  user: {
    name: string;
    email: string;
    apartment: string;
    building: {
      name: string;
    };
  };
}

interface Dish {
  id: string;
  title: string;
  bookings: Booking[];
}

export function MyBookings() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dishes/my-bookings")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        setDishes(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Une erreur est survenue: {error}
      </div>
    );
  }

  if (dishes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune réservation pour vos plats pour le moment.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {dishes.map((dish) => (
        <div key={dish.id} className="bg-white rounded-xl shadow-soft p-6">
          <h3 className="text-xl font-semibold mb-4">{dish.title}</h3>
          
          {dish.bookings.length === 0 ? (
            <p className="text-gray-500">Aucune réservation pour ce plat.</p>
          ) : (
            <div className="space-y-4">
              {dish.bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{booking.user.name}</p>
                      <p className="text-sm text-gray-600">
                        {booking.user.building.name} - Apt {booking.user.apartment}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.pickupTime).toLocaleString("fr-FR", {
                          dateStyle: "long",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary-600">
                        {formatPrice(booking.total)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {booking.portions} portion{booking.portions > 1 ? "s" : ""}
                      </p>
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-800">
                        {booking.status === "pending"
                          ? "En attente"
                          : booking.status === "confirmed"
                          ? "Confirmé"
                          : booking.status === "completed"
                          ? "Terminé"
                          : "Annulé"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 