"use client";

import { useEffect, useState } from "react";
import Button from "../components/ui/button";
import Link from "next/link";
import { Loading } from "../components/ui/loading";

interface Dish {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  user: {
    name: string;
    building?: {
      name: string;
    };
  };
}

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [recentDishes, setRecentDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionRes, dishesRes] = await Promise.all([
          fetch("/api/auth/session"),
          fetch("/api/dishes/recent")
        ]);

        const [sessionData, dishesData] = await Promise.all([
          sessionRes.json(),
          dishesRes.json()
        ]);

        setSession(sessionData);
        setRecentDishes(dishesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Loading message="Chargement..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              Partagez des plats faits maison avec vos voisins
            </h1>
            <p className="text-lg sm:text-xl mb-8 text-gray-100">
              Découvrez les talents culinaires de votre immeuble et partagez vos propres créations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/dishes">
                  Découvrir les plats
                </Link>
              </Button>
              {!session && (
                <Button size="lg" variant="outline" className="bg-white/10" asChild>
                  <Link href="/signup">
                    Créer un compte
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-gray-600">
              Trois étapes simples pour commencer à partager
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-soft text-center">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Créez votre compte</h3>
              <p className="text-gray-600">
                Inscrivez-vous et sélectionnez votre immeuble pour rejoindre votre communauté
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-soft text-center">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Proposez vos plats</h3>
              <p className="text-gray-600">
                Partagez vos créations culinaires avec vos voisins
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-soft text-center">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Réservez des plats</h3>
              <p className="text-gray-600">
                Découvrez et réservez les plats proposés par vos voisins
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Dishes Section */}
      {recentDishes.length > 0 && (
        <div className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Derniers plats ajoutés
              </h2>
              <p className="text-lg text-gray-600">
                Découvrez les dernières créations de vos voisins
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {recentDishes.map((dish) => (
                <div key={dish.id} className="bg-white rounded-2xl shadow-soft overflow-hidden">
                  <div className="relative h-48 bg-gradient-to-br from-primary-50 to-primary-100">
                    <div className="absolute inset-0 flex items-center justify-center text-primary-400">
                      {dish.images[0] ? "Image du plat" : "Pas d'image"}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{dish.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{dish.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-primary-600 font-bold">{dish.price}€</span>
                      <Button size="sm" asChild>
                        <Link href={`/dishes/${dish.id}`}>
                          Voir les détails
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button size="lg" variant="outline" asChild>
                <Link href="/dishes">
                  Voir tous les plats
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}