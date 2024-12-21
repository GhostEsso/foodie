import React from 'react';

interface LoadingProps {
  message?: string;
}

export function Loading({ message = "Chargement..." }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full rotate-45">
          <div className="w-16 h-16 border-4 border-transparent border-t-primary-300 rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="text-gray-600 font-medium animate-pulse">{message}</p>
    </div>
  );
}

export function LoadingPage({ message }: LoadingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Loading message={message} />
        </div>
      </div>
    </div>
  );
} 