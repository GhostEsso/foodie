"use client";

import React from "react";
import Button from "../ui/button";
import { Search } from "lucide-react";
import { DishFiltersProps } from "../../models/dish/dish-filters.types";
import { useDishFilters } from "../../hooks/useDishFilters";

export function DishFilters({ defaultValues = {} }: DishFiltersProps) {
  const {
    isPending,
    handleSubmit,
    handleReset,
    handleSearch
  } = useDishFilters({ defaultValues });

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