"use client";

import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
// import { getSession } from "../../../lib/auth";
// import { prisma } from "../../../lib/prisma";
import { BookingForm } from "../../../components/bookings/booking-form";
import Button from "../../../components/ui/button";
import { formatPrice } from "../../../lib/utils";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

interface DishPageProps {
  params: { id: string };
}

export default function DishPage({ params }: DishPageProps) {
  const router = useRouter();
  const [dish, setDish] = React.useState<any>(null);
  const [session, setSession] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionRes, dishRes] = await Promise.all([
          fetch("/api/auth/session"),
          fetch(`/api/dishes/${params.id}`)
        ]);

        const sessionData = await sessionRes.json();
        const dishData = await dishRes.json();

        if (!dishData || dishData.error) {
          notFound();
        }

        setSession(sessionData);
        setDish(dishData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!dish) {
    return notFound();
  }

  const isAuthor = session?.id === dish.user.id;
  const bookedPortions = dish.bookings.reduce((sum: number, booking: any) => sum + booking.portions, 0);
  const availablePortions = dish.portions - bookedPortions;

  const handleContactSeller = async () => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dishId: dish.id,
          otherUserId: dish.user.id,
        }),
      });
      
      if (response.ok) {
        const conversation = await response.json();
        router.push(`/messages?conversation=${conversation.id}`);
      }
    } catch (error) {
      console.error("Erreur lors de la création de la conversation:", error);
    }
  };

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
              <div className="grid gap-8 md:grid-cols-2">
                {/* Colonne de gauche */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold">{dish.title}</h1>
                    <div className="mt-2 flex items-center gap-4">
                      <span className="text-2xl font-bold text-primary-600">
                        {formatPrice(dish.price)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {availablePortions} portions disponibles
                      </span>
                    </div>
                  </div>

                  {/* Informations de disponibilité */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Disponibilité</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      {dish.availableFrom && dish.availableTo ? (
                        <>
                          <p>Disponible à partir du : {new Date(dish.availableFrom).toLocaleString('fr-FR', {
                            dateStyle: 'full',
                            timeStyle: 'short'
                          })}</p>
                          <p>Jusqu'au : {new Date(dish.availableTo).toLocaleString('fr-FR', {
                            dateStyle: 'full',
                            timeStyle: 'short'
                          })}</p>
                        </>
                      ) : (
                        <p>Disponible immédiatement</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h2 className="font-medium mb-2">Description</h2>
                    <p className="text-gray-600">{dish.description}</p>
                  </div>
                </div>

                {/* Colonne de droite */}
                <div className="space-y-6">
                  <div>
                    <h2 className="font-medium mb-2">Proposé par</h2>
                    <p className="text-gray-600">{dish.user.name} • {dish.user.building.name}</p>
                  </div>

                  {dish.ingredients.length > 0 && (
                    <>
                      <h2 className="font-medium mb-2">Ingrédients</h2>
                      <ul className="list-disc list-inside text-gray-600">
                        {dish.ingredients.map((ingredient: string, index: number) => (
                          <li key={index}>{ingredient}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>

              {session ? (
                isAuthor ? (
                  <div className="border-t pt-8 text-center">
                    <p className="text-gray-600 mb-4">
                      Vous êtes l'auteur de ce plat
                    </p>
                  </div>
                ) : dish.available && availablePortions > 0 ? (
                  <div className="border-t pt-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">Réserver ce plat</h2>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleContactSeller}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contacter le vendeur
                      </Button>
                    </div>
                    <BookingForm
                      dish={{
                        id: dish.id,
                        title: dish.title,
                        price: dish.price,
                        portions: dish.portions,
                        availablePortions,
                        availableFrom: dish.availableFrom,
                        availableTo: dish.availableTo,
                      }}
                      onSubmit={async (data) => {
                        const response = await fetch("/api/bookings", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(data),
                        });

                        if (!response.ok) {
                          throw new Error("Erreur lors de la réservation");
                        }

                        router.push("/bookings");
                      }}
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