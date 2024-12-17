"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/button";
import Image from "next/image";

export function DishForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Vérifier si on ne dépasse pas 3 images
    if (images.length + files.length > 3) {
      setError("Vous ne pouvez pas ajouter plus de 3 images");
      return;
    }

    // Créer les URLs pour la prévisualisation
    const newImageUrls = Array.from(files).map(file => URL.createObjectURL(file));
    setImages([...images, ...newImageUrls]);
    setImageFiles([...imageFiles, ...Array.from(files)]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    setImages(newImages);
    setImageFiles(newImageFiles);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation des dates
    if (availableFrom && availableTo && new Date(availableFrom) >= new Date(availableTo)) {
      setError("La date de fin doit être postérieure à la date de début");
      setIsLoading(false);
      return;
    }

    try {
      const formElement = e.target as HTMLFormElement;
      const titleInput = formElement.querySelector<HTMLInputElement>('#title');
      const descriptionInput = formElement.querySelector<HTMLTextAreaElement>('#description');
      const priceInput = formElement.querySelector<HTMLInputElement>('#price');
      const portionsInput = formElement.querySelector<HTMLInputElement>('#portions');

      if (!titleInput || !descriptionInput || !priceInput || !portionsInput) {
        throw new Error("Formulaire incomplet");
      }

      // Créer d'abord les données de base du plat
      const baseData = {
        title: titleInput.value,
        description: descriptionInput.value,
        price: parseFloat(priceInput.value),
        portions: parseInt(portionsInput.value),
        ingredients: ingredients.filter(Boolean),
        available: true,
        images: [],
        availableFrom: availableFrom ? new Date(availableFrom).toISOString() : null,
        availableTo: availableTo ? new Date(availableTo).toISOString() : null,
      };

      // Si des images ont été sélectionnées, essayer de les uploader
      if (imageFiles.length > 0) {
        try {
          const uploadedImages = await Promise.all(
            imageFiles.map(async (file) => {
              const formData = new FormData();
              formData.append("file", file);
              
              const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
              });

              if (!response.ok) {
                throw new Error("Erreur lors de l'upload des images");
              }

              const data = await response.json();
              return data.url;
            })
          );
          baseData.images = uploadedImages;
        } catch (uploadError) {
          console.error("Erreur lors de l'upload des images:", uploadError);
          // Continuer sans les images
        }
      }

      // Créer le plat avec ou sans images
      const response = await fetch("/api/dishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(baseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la création du plat");
      }

      router.push("/dishes");
      router.refresh();
    } catch (error) {
      console.error("Erreur:", error);
      setError(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

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
                onChange={(e) => {
                  const newIngredients = [...ingredients];
                  newIngredients[index] = e.target.value;
                  setIngredients(newIngredients);
                }}
                placeholder="Ex: Tomates, Oignons, etc."
                className="flex-1 rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
              {ingredients.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIngredients(ingredients.filter((_, i) => i !== index))}
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
            onClick={() => setIngredients([...ingredients, ""])}
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