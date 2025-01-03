"use client";

import React from "react";
import { Heart } from "lucide-react";
import { cn } from "../../lib/utils";
import { LikeCountProps } from "../../models/like/like-count.types";
import { useLikeCount } from "../../hooks/useLikeCount";

export function LikeCount({ dishId, className }: LikeCountProps) {
  const { count, isLoading } = useLikeCount({ dishId });

  if (isLoading) {
    return <div className="animate-pulse h-5 w-12 bg-gray-200 rounded" />;
  }

  return (
    <div className={cn("flex items-center gap-1 text-sm", className)}>
      <Heart className="h-4 w-4" />
      <span>{count}</span>
    </div>
  );
} 