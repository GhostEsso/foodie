import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface DishCardProps {
  dish: {
    id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    available: boolean;
    portions: number;
    user: {
      name: string;
      building: {
        name: string;
      };
    };
  };
  showActions?: boolean;
  className?: string;
  imageClassName?: string;
}

export function DishCard({ 
  dish, 
  showActions = true, 
  className,
  imageClassName 
}: DishCardProps) {
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
          <p className="text-sm text-gray-500 line-clamp-2">{dish.description}</p>
        </div>

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
            {dish.available && (
              <Button
                size="sm"
                className="flex-1"
                asChild
              >
                <Link href={`/dishes/${dish.id}/book`}>
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