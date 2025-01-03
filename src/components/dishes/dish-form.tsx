"use client";

import React from "react";
import Button from "../ui/button";
import Image from "next/image";
import { useDishForm } from "../../hooks/useDishForm";

export function DishForm() {
  const {
    isLoading,
    error,
    ingredients,
    images,
    availableFrom,
    availableTo,
    handleImageChange,
    removeImage,
    handleSubmit,
    handleIngredientChange,
    addIngredient,
    removeIngredient,
    setAvailableFrom,
    setAvailableTo
  } = useDishForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Nom du plat *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Prix par portion (€) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            required
            min="0"
            step="0.01"
            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="portions" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de portions *
          </label>
          <input
            type="number"
            id="portions"
            name="portions"
            required
            min="1"
            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ingrédients *
        </label>
        <div className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                placeholder="Ex: Tomates, Oignons, etc."
                className="flex-1 rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
              {ingredients.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeIngredient(index)}
                >
                  Retirer
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addIngredient}
          >
            Ajouter un ingrédient
          </Button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photos du plat (optionnel)
          <span className="text-gray-500 text-xs ml-1">Maximum 3 photos</span>
        </label>
        <div className="mt-2 grid grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
          {images.length < 3 && (
            <div className="aspect-square relative">
              <label className="flex items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="mt-1 text-sm text-gray-600">Ajouter une photo</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="availableFrom" className="block text-sm font-medium text-gray-700 mb-1">
            Disponible à partir de *
          </label>
          <input
            type="datetime-local"
            id="availableFrom"
            value={availableFrom}
            onChange={(e) => setAvailableFrom(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            required
            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="availableTo" className="block text-sm font-medium text-gray-700 mb-1">
            Disponible jusqu'à
            <span className="text-gray-500 text-xs ml-1">(optionnel)</span>
          </label>
          <input
            type="datetime-local"
            id="availableTo"
            value={availableTo}
            onChange={(e) => setAvailableTo(e.target.value)}
            min={availableFrom || new Date().toISOString().slice(0, 16)}
            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Créer le plat
        </Button>
      </div>
    </form>
  );
} 