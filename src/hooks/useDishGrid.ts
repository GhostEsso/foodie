import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ViewMode, DishGridProps } from "../models/dish/dish-grid.types";

export function useDishGrid({ viewMode = "grid" }: Pick<DishGridProps, "viewMode">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedViewMode, setSelectedViewMode] = useState<ViewMode>(viewMode);

  const handleViewModeChange = (mode: ViewMode) => {
    setSelectedViewMode(mode);
    const params = new URLSearchParams(searchParams);
    params.set("view", mode);
    router.push(`/dishes?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/dishes?${params.toString()}`);
  };

  const getGridClassName = () => {
    return selectedViewMode === "grid"
      ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      : "space-y-4";
  };

  const getCardClassName = () => {
    return selectedViewMode === "list" ? "!flex gap-6" : "";
  };

  const getImageClassName = () => {
    return selectedViewMode === "list" ? "!w-48 !h-48" : "";
  };

  return {
    selectedViewMode,
    handleViewModeChange,
    handlePageChange,
    getGridClassName,
    getCardClassName,
    getImageClassName
  };
} 