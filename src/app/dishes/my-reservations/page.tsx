"use client";

import React from "react";
import { PendingBookings } from "../../../components/PendingBookings";
import { useRouter } from "next/navigation";
import { useBookings } from "../../../hooks/useBookings";
import { LoadingPage } from "../../../components/ui/loading";

export default function MyReservationsPage() {
  const router = useRouter();
  const { bookings, isLoading, error, refetch } = useBookings();

  if (isLoading) {
    return <LoadingPage message="Chargement de vos réservations..." />;
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
              refetch();
              router.refresh();
            }} 
          />
        </div>
      </div>
    </div>
  );
} 