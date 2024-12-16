"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

interface Building {
  id: string;
  name: string;
}

interface DishFiltersProps {
  buildings: Building[];
  defaultValues?: {
    search?: string;
    building?: string;
    available?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    date?: string;
  };
}

export function DishFilters({ buildings, defaultValues = {} }: DishFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams(searchParams);

    // Mettre à jour les paramètres de recherche
    formData.forEach((value, key) => {
      if (value) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    startTransition(() => {
      router.push(`/dishes?${params.toString()}`);
    });
  };

  const handleReset = () => {
    startTransition(() => {
      router.push("/dishes");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Recherche et filtres principaux */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <input
          type="text"
          name="search"
          placeholder="Rechercher un plat..."
          defaultValue={defaultValues.search}
          className="rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
        />
        
        <select
          name="building"
          defaultValue={defaultValues.building}
          className="rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">Tous les bâtiments</option>
          {buildings.map((building) => (
            <option key={building.id} value={building.id}>
              {building.name}
            </option>
          ))}
        </select>

        <select
          name="available"
          defaultValue={defaultValues.available}
          className="rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">Tous les plats</option>
          <option value="true">Disponibles uniquement</option>
        </select>

        <select
          name="sort"
          defaultValue={defaultValues.sort}
          className="rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="recent">Plus récents</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
        </select>
      </div>

      {/* Filtres avancés */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Fourchette de prix
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              name="minPrice"
              placeholder="Min"
              min="0"
              step="0.01"
              defaultValue={defaultValues.minPrice}
              className="rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              min="0"
              step="0.01"
              defaultValue={defaultValues.maxPrice}
              className="rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Date de disponibilité
          </label>
          <input
            type="date"
            name="date"
            defaultValue={defaultValues.date}
            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="ghost"
          onClick={handleReset}
          disabled={isPending}
        >
          Réinitialiser
        </Button>
        <Button type="submit" disabled={isPending}>
          Appliquer les filtres
        </Button>
      </div>
    </form>
  );
} 