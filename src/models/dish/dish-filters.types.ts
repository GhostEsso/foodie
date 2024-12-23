export interface DishFiltersDefaultValues {
  search?: string;
  available?: string;
  sort?: string;
}

export interface DishFiltersProps {
  defaultValues?: DishFiltersDefaultValues;
}

export interface DishFiltersState {
  isPending: boolean;
}

export type SortOption = "recent" | "price-asc" | "price-desc";

export interface DishFiltersHandlers {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleReset: () => void;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
} 