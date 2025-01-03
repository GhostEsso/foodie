import { DishCardData } from "./dish-card.types";

export type ViewMode = "grid" | "list";

export interface DishGridProps {
  dishes: DishCardData[];
  currentPage: number;
  totalPages: number;
  viewMode?: ViewMode;
  currentUserId?: string | null;
}

export interface DishGridState {
  selectedViewMode: ViewMode;
}

export interface DishGridHandlers {
  handleViewModeChange: (mode: ViewMode) => void;
  handlePageChange: (page: number) => void;
} 