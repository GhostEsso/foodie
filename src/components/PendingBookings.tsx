"use client";

import { useEffect } from "react";
import { useBookings } from "../hooks/useBookings";
import { Loading } from "./ui/loading";
import { formatPrice } from "../lib/utils";
import Button from "./ui/button";

export function PendingBookings() {
  console.log('Rendu PendingBookings');
  
  const { bookings, isLoading, error, updateStatus } = useBookings({
    filters: { status: "PENDING" }
  });

  useEffect(() => {
    console.log('État actuel:', { bookings, isLoading, error });
  }, [bookings, isLoading, error]);

  const handleApprove = async (bookingId: string) => {
    try {
      await updateStatus(bookingId, "APPROVED");
    } catch (error) {
      console.error("Erreur lors de l'approbation:", error);
    }
  };

  const handleReject = async (bookingId: string) => {
    try {
      await updateStatus(bookingId, "REJECTED");
    } catch (error) {
      console.error("Erreur lors du rejet:", error);
    }
  };

  if (isLoading) {
    console.log('Affichage du loading');
    return <Loading />;
  }

  if (error) {
    console.log('Affichage de l\'erreur:', error);
    return (
      <div className="text-red-500 p-4 text-center">
        Une erreur est survenue: {error}
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    console.log('Aucune réservation trouvée');
    return (
      <div className="text-gray-500 p-4 text-center">
        Aucune réservation en attente
      </div>
    );
  }

  console.log('Affichage des réservations:', bookings);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Réservations en attente</h2>
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div className="flex-grow">
            <h3 className="font-medium">{booking.dish.title}</h3>
            <p className="text-sm text-gray-600">
              Client: {booking.user.name} ({booking.user.email})
            </p>
            <p className="text-sm text-gray-600">
              {booking.portions} portion{booking.portions > 1 ? "s" : ""} •{" "}
              {formatPrice(booking.total)}
            </p>
            {booking.user.building && (
              <p className="text-sm text-gray-600">
                Bâtiment: {booking.user.building.name}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => handleApprove(booking.id)}
              variant="primary"
              size="sm"
              className="bg-green-500 hover:bg-green-600"
            >
              Accepter
            </Button>
            <Button
              onClick={() => handleReject(booking.id)}
              variant="danger"
              size="sm"
            >
              Refuser
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}