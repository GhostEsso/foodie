import React from "react";
import { getSession } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { redirect } from "next/navigation";
import { formatPrice } from "../../lib/utils";
import Button from "../../components/ui/button";
import Link from "next/link";

async function getBookings() {
  const session = await getSession();
  if (!session) redirect("/login");

  return prisma.booking.findMany({
    where: {
      userId: session.id,
    },
    include: {
      dish: {
        select: {
          title: true,
          price: true,
          images: true,
          user: {
            select: {
              name: true,
              building: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export default async function BookingsPage() {
  const bookings = await getBookings();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Mes réservations
          </h1>

          <div className="space-y-6">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl shadow-soft p-6"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {booking.dish.title}
                      </h3>
                      <p className="text-gray-600 mb-1">
                        Par {booking.dish.user.name} • {booking.dish.user.building.name}
                      </p>
                      <p className="text-gray-600 mb-4">
                        {booking.portions} portions • {formatPrice(booking.dish.price * booking.portions)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Retrait le {new Date(booking.pickupTime).toLocaleDateString("fr-FR")} à{" "}
                        {new Date(booking.pickupTime).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {booking.status === "confirmed"
                          ? "Confirmée"
                          : booking.status === "cancelled"
                          ? "Annulée"
                          : "En attente"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucune réservation
                </h2>
                <p className="text-gray-600 mb-6">
                  Vous n'avez pas encore effectué de réservation
                </p>
                <Button asChild>
                  <Link href="/dishes">Voir les plats disponibles</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 