import { getSession } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { DishGrid } from "../../components/dishes/dish-grid";
import { DishFilters } from "../../components/dishes/dish-filters";
import Button from "../../components/ui/button";
import Link from "next/link";
import React from "react";
import { Prisma } from "@prisma/client";

interface SearchParams {
  search?: string;
  available?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  date?: string;
  page?: string;
  view?: "grid" | "list";
}

const ITEMS_PER_PAGE = 9;

async function getDishes(searchParams: SearchParams) {
  const {
    search,
    available,
    sort = "recent",
    minPrice,
    maxPrice,
    date,
    page = "1",
  } = searchParams;

  const where: Prisma.DishWhereInput = {
    AND: [
      search
        ? {
            OR: [
              { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { description: { contains: search, mode: Prisma.QueryMode.insensitive } },
            ],
          }
        : {},
      available === "true" ? { available: true } : {},
      minPrice ? { price: { gte: parseFloat(minPrice) } } : {},
      maxPrice ? { price: { lte: parseFloat(maxPrice) } } : {},
      date
        ? {
            bookings: {
              some: {
                pickupTime: {
                  gte: new Date(date),
                  lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
                },
              },
            },
          }
        : {},
    ],
  };

  const orderBy: Prisma.DishOrderByWithRelationInput = {
    ...(sort === "price-asc" && { price: Prisma.SortOrder.asc }),
    ...(sort === "price-desc" && { price: Prisma.SortOrder.desc }),
    ...(sort === "recent" && { createdAt: Prisma.SortOrder.desc }),
  };

  // Calculer le nombre total de plats
  const totalDishes = await prisma.dish.count({ where });
  const totalPages = Math.ceil(totalDishes / ITEMS_PER_PAGE);
  const currentPage = Math.min(Math.max(1, parseInt(page)), totalPages);
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const dishes = await prisma.dish.findMany({
    where,
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
    },
    orderBy,
    skip,
    take: ITEMS_PER_PAGE,
  });

  return {
    dishes,
    pagination: {
      totalDishes,
      totalPages,
      currentPage,
    },
  };
}

async function getBuildings() {
  return prisma.building.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export default async function DishesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getSession();
  const { dishes, pagination } = await getDishes(searchParams);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Plats disponibles
            </h1>
            {session && (
              <Button asChild>
                <Link href="/dishes/new">Proposer un plat</Link>
              </Button>
            )}
          </div>

          {/* Filtres */}
          <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
            <DishFilters
              defaultValues={searchParams}
            />
          </div>

          {/* Liste des plats */}
          {dishes.length > 0 ? (
            <DishGrid
              dishes={dishes}
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              viewMode={searchParams.view || "grid"}
              currentUserId={session?.id}
            />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun plat trouvé
              </h2>
              <p className="text-gray-600">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 