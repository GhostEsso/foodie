import React from "react";

interface LoadingProps {
  message?: string;
}

export function Loading({ message = "Chargement..." }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-100 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  );
} 