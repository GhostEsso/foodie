"use client";

import { useEffect, useState } from "react";
import { PendingBookings } from "../../../components/PendingBookings";
import { useRouter } from "next/navigation";

export default function MyReservationsPage() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/dishes/pending-bookings");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des réservations");
      }
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (isLoading) {
    return <div>Chargement...</div>;
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
              fetchBookings();
              router.refresh();
            }} 
          />
        </div>
      </div>
    </div>
  );
} 