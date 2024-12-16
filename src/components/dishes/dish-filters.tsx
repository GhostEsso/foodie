"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import Button from "../ui/button";
import { Search } from "lucide-react";

interface DishFiltersProps {
  defaultValues?: {
    search?: string;
    available?: string;
    sort?: string;
  };
}

export function DishFilters({ defaultValues = {} }: DishFiltersProps) {
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    startTransition(() => {
      router.push(`/dishes?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Barre de recherche */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          name="search"
          placeholder="Rechercher un plat..."
          defaultValue={defaultValues.search}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2 rounded-xl border-gray-200 focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Disponibilité */}
        <select
          name="available"
          defaultValue={defaultValues.available}
          className="rounded-xl border-gray-200 focus:border-primary-500 focus:ring-primary-500 bg-white py-2 px-4 text-sm"
        >
          <option value="">Tous les plats</option>
          <option value="true">Disponibles uniquement</option>
        </select>

        {/* Tri */}
        <select
          name="sort"
          defaultValue={defaultValues.sort}
          className="rounded-xl border-gray-200 focus:border-primary-500 focus:ring-primary-500 bg-white py-2 px-4 text-sm"
        >
          <option value="recent">Plus récents</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
        </select>

        {/* Boutons */}
        <div className="flex gap-2 ml-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={isPending}
          >
            Réinitialiser
          </Button>
          <Button type="submit" size="sm" disabled={isPending}>
            Appliquer
          </Button>
        </div>
      </div>
    </form>
  );
} 