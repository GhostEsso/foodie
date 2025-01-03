import React from "react";
import { MyBookings } from "../../../components/dishes/my-bookings";

export default function MyBookingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Réservations de mes plats
          </h1>
          <MyBookings />
        </div>
      </div>
    </div>
  );
} 