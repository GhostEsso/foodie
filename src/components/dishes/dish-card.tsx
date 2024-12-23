"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "../ui/button";
import { formatPrice } from "../../lib/utils";
import { cn } from "../../lib/utils";
import { Heart } from "lucide-react";
import { DishCardProps } from "../../models/dish/dish-card.types";
import { useDishCard } from "../../hooks/useDishCard";

export function DishCard({ 
  dish, 
  currentUserId,
  showActions = true, 
  className,
  imageClassName 
}: DishCardProps) {
  const {
    isLiked,
    isLoading,
    likesCount,
    isAuthor,
    handleLike
  } = useDishCard({ dish, currentUserId, showActions, className, imageClassName });

  return (
    <div className={cn(
      "bg-white rounded-2xl shadow-soft overflow-hidden group",
      className
    )}>
      <div className={cn(
        "relative h-56",
        imageClassName
      )}>
        {dish.images[0] ? (
          <Image
            src={dish.images[0]}
            alt={dish.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
            <span className="text-primary-400">Pas d'image</span>
          </div>
        )}
        <div className="absolute top-4 right-4 flex gap-2">
          {currentUserId && !isAuthor && (
            <button
              onClick={handleLike}
              disabled={isLoading}
              className={cn(
                "p-2 rounded-full backdrop-blur-sm transition-colors flex items-center gap-1",
                isLiked 
                  ? "bg-red-500/90 text-white hover:bg-red-600/90" 
                  : "bg-gray-500/90 text-white hover:bg-gray-600/90"
              )}
            >
              <Heart className={cn(
                "w-5 h-5",
                isLiked ? "fill-current" : "stroke-current"
              )} />
              <span className="text-sm">{likesCount}</span>
            </button>
          )}
          {dish.available ? (
            <span className="bg-secondary-500/90 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
              {dish.portions} portions
            </span>
          ) : (
            <span className="bg-gray-500/90 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
              Non disponible
            </span>
          )}
        </div>
      </div>

      <div className="p-6 flex-1">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1 text-gray-900">
            {dish.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">
            {className?.includes("!flex") 
              ? dish.description 
              : dish.description.length > 50
                ? `${dish.description.substring(0, 50)}...` 
                : dish.description}
          </p>
        </div>

        {/* Disponibilité */}
        {dish.availableFrom && (
          <div className="mb-4 text-sm">
            <p className="text-gray-600">
              Disponible le{" "}
              {new Date(dish.availableFrom).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>
            {dish.availableTo && (
              <p className="text-gray-600">
                jusqu'au{" "}
                {new Date(dish.availableTo).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-primary-600">
              {formatPrice(dish.price)}
            </span>
            <span className="text-sm text-gray-500 ml-2">par portion</span>
          </div>
          <div className="text-sm text-gray-500">
            {dish.user.building.name}
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              asChild
            >
              <Link href={`/dishes/${dish.id}`}>
                Voir les détails
              </Link>
            </Button>
            {dish.available && !isAuthor && (
              <Button
                size="sm"
                className="flex-1"
                asChild
              >
                <Link href={`/dishes/${dish.id}`}>
                  Réserver
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 