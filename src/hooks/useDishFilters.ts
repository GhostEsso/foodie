import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { DishFiltersProps, DishFiltersHandlers } from "../models/dish/dish-filters.types";

export function useDishFilters({ defaultValues = {} }: DishFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSubmit: DishFiltersHandlers["handleSubmit"] = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams(searchParams);

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

  const handleReset: DishFiltersHandlers["handleReset"] = () => {
    startTransition(() => {
      router.push("/dishes");
    });
  };

  const handleSearch: DishFiltersHandlers["handleSearch"] = (e) => {
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

  return {
    isPending,
    defaultValues,
    handleSubmit,
    handleReset,
    handleSearch
  };
} 