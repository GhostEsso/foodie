import React from "react";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { getSession } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { BookingForm } from "../../../components/bookings/booking-form";
import Button from "../../../components/ui/button";
import { formatPrice } from "../../../lib/utils";
import Link from "next/link";

async function createBooking(data: { dishId: string; portions: number; pickupTime: string }): Promise<void> {
  "use server";
  
  const session = await getSession();
  if (!session) {
    throw new Error("Non autorisé");
  }

  const dish = await prisma.dish.findUnique({
    where: { id: data.dishId },
    select: { price: true }
  });

  if (!dish) {
    throw new Error("Plat non trouvé");
  }

  await prisma.booking.create({
    data: {
      userId: session.id,
      dishId: data.dishId,
      portions: data.portions,
      pickupTime: new Date(data.pickupTime),
      status: "confirmed",
      total: dish.price * data.portions,
    },
  });

  redirect("/bookings");
}

async function getDish(id: string) {
  const dish = await prisma.dish.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          building: {
            select: {
              name: true,
            },
          },
        },
      },
      bookings: {
        where: {
          status: "confirmed",
        },
        select: {
          portions: true,
        },
      },
    },
  });

  if (!dish) notFound();

  const bookedPortions = dish.bookings.reduce((sum, booking) => sum + booking.portions, 0);
  const availablePortions = dish.portions - bookedPortions;

  return {
    ...dish,
    availablePortions,
  };
}

export default async function DishPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  const dish = await getDish(params.id);
  const isAuthor = session?.id === dish.user.id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="relative h-96">
              {dish.images[0] ? (
                <Image
                  src={dish.images[0]}
                  alt={dish.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                  <span className="text-primary-400">Pas d'image</span>
                </div>
              )}
            </div>

            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {dish.title}
                  </h1>
                  <p className="text-gray-500">
                    Proposé par {dish.user.name} • {dish.user.building.name}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">
                    {formatPrice(dish.price)}
                  </div>
                  <p className="text-sm text-gray-500">par portion</p>
                </div>
              </div>

              <div className="prose prose-lg mb-8">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-600">{dish.description}</p>

                {dish.ingredients.length > 0 && (
                  <>
                    <h2 className="text-xl font-semibold mb-2 mt-6">Ingrédients</h2>
                    <ul className="list-disc list-inside text-gray-600">
                      {dish.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {session ? (
                isAuthor ? (
                  <div className="border-t pt-8 text-center">
                    <p className="text-gray-600 mb-4">
                      Vous êtes l'auteur de ce plat
                    </p>
                  </div>
                ) : dish.available && dish.availablePortions > 0 ? (
                  <div className="border-t pt-8">
                    <h2 className="text-xl font-semibold mb-6">Réserver ce plat</h2>
                    <BookingForm
                      dish={{
                        id: dish.id,
                        title: dish.title,
                        price: dish.price,
                        portions: dish.portions,
                        availablePortions: dish.availablePortions,
                      }}
                      onSubmit={createBooking}
                    />
                  </div>
                ) : (
                  <div className="border-t pt-8">
                    <p className="text-center text-gray-600">
                      {!dish.available
                        ? "Ce plat n'est plus disponible"
                        : "Toutes les portions ont été réservées"}
                    </p>
                  </div>
                )
              ) : (
                <div className="border-t pt-8 text-center">
                  <p className="text-gray-600 mb-4">
                    Connectez-vous pour réserver ce plat
                  </p>
                  <Button asChild>
                    <Link href="/login">Se connecter</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 