"use client";

import { PendingBookings } from "../../../components/PendingBookings";
import { useRouter } from "next/navigation";
import { Loading } from "../../../components/ui/loading";
import { useBookings } from "../../../hooks/useBookings";

export default function MyReservationsPage() {
  const router = useRouter();
  const { bookings, isLoading, error, refreshBookings } = useBookings();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Loading message="Chargement des réservations..." />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-red-600">Erreur: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Réservations en attente
          </h1>
          <PendingBookings 
            bookings={bookings} 
            onStatusChange={() => {
              refreshBookings();
              router.refresh();
            }} 
          />
        </div>
      </div>
    </div>
  );
} 