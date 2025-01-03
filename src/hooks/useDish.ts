import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";

interface DishData {
  id: string;
  title: string;
  description: string;
  price: number;
  portions: number;
  available: boolean;
  availableFrom: string | null;
  availableTo: string | null;
  images: string[];
  ingredients: string[];
  user: {
    id: string;
    name: string;
    building: {
      name: string;
    };
  };
  bookings: Array<{
    portions: number;
  }>;
}

interface Session {
  id: string;
}

export function useDish(dishId: string) {
  const router = useRouter();
  const [dish, setDish] = useState<DishData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionRes, dishRes] = await Promise.all([
          fetch("/api/auth/session"),
          fetch(`/api/dishes/${dishId}`)
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
  }, [dishId]);

  const handleContactSeller = async () => {
    if (!dish) return;
    
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

  const isAuthor = session?.id === dish?.user.id;
  const bookedPortions = dish?.bookings.reduce((sum, booking) => sum + booking.portions, 0) ?? 0;
  const availablePortions = dish ? dish.portions - bookedPortions : 0;

  return {
    dish,
    session,
    isLoading,
    isAuthor,
    availablePortions,
    handleContactSeller
  };
} 