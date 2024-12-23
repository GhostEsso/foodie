"use client";

import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useBookings } from "../hooks/useBookings";

interface PendingBookingsProps {
  className?: string;
}

export function PendingBookings({ className }: PendingBookingsProps) {
  const { bookings, isLoading, pendingBookings, updateStatus } = useBookings({
    filters: {
      status: "PENDING"
    }
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-100 p-4 rounded-lg">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  const handleAccept = async (bookingId: string) => {
    try {
      await updateStatus(bookingId, "APPROVED");
    } catch (error) {
      console.error("Erreur lors de l'acceptation de la réservation:", error);
    }
  };

  const handleReject = async (bookingId: string) => {
    try {
      await updateStatus(bookingId, "REJECTED");
    } catch (error) {
      console.error("Erreur lors du rejet de la réservation:", error);
    }
  };

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        Aucune réservation en attente
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {bookings.map((booking) => {
          const isPending = pendingBookings.has(booking.id);
          return (
            <div
              key={booking.id}
              className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 transition-opacity duration-200 ${
                isPending ? 'opacity-50' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{booking.user.name}</h3>
                  <p className="text-sm text-gray-600">{booking.dish.title}</p>
                  {booking.user.building && (
                    <p className="text-sm text-gray-500">
                      {booking.user.building.name}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(booking.createdAt), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div>
                  <p className="text-gray-600">
                    {booking.portions} portion{booking.portions > 1 ? "s" : ""} •{" "}
                    {booking.total.toFixed(2)}€
                  </p>
                  <p className="text-gray-500">
                    Retrait : {new Date(booking.pickupTime).toLocaleString("fr-FR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReject(booking.id)}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isPending}
                  >
                    Refuser
                  </button>
                  <button
                    onClick={() => handleAccept(booking.id)}
                    className="px-3 py-1 text-white bg-primary-500 hover:bg-primary-600 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isPending}
                  >
                    Accepter
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}