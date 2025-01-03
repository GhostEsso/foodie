import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

export function formatRelativeTime(date: Date) {
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: fr,
  });
}

export function formatName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}