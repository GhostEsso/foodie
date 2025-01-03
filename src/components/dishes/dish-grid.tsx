"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DishCard } from "./dish-card";
import Button from "../ui/button";
import { Grid2X2, List } from "lucide-react";
import { DishGridProps } from "../../models/dish/dish-grid.types";
import { useDishGrid } from "../../hooks/useDishGrid";

export function DishGrid({
  dishes,
  currentPage,
  totalPages,
  viewMode = "grid",
  currentUserId,
}: DishGridProps) {
  const {
    selectedViewMode,
    handleViewModeChange,
    handlePageChange,
    getGridClassName,
    getCardClassName,
    getImageClassName
  } = useDishGrid({ viewMode });

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <Button
          variant={selectedViewMode === "grid" ? "primary" : "ghost"}
          size="sm"
          onClick={() => handleViewModeChange("grid")}
        >
          <Grid2X2 className="w-4 h-4" />
        </Button>
        <Button
          variant={selectedViewMode === "list" ? "primary" : "ghost"}
          size="sm"
          onClick={() => handleViewModeChange("list")}
        >
          <List className="w-4 h-4" />
        </Button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedViewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={getGridClassName()}
        >
          {dishes.map((dish) => (
            <motion.div
              key={dish.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <DishCard
                dish={dish}
                currentUserId={currentUserId}
                className={getCardClassName()}
                imageClassName={getImageClassName()}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Précédent
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "primary" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
} 