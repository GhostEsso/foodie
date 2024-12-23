import { useState } from "react";
import { useRouter } from "next/navigation";
import { DishFormState, DishFormData } from "../models/dish/dish-form.types";

export function useDishForm() {
  const router = useRouter();
  const [state, setState] = useState<DishFormState>({
    isLoading: false,
    error: "",
    ingredients: [""],
    images: [],
    imageFiles: [],
    availableFrom: "",
    availableTo: ""
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (state.images.length + files.length > 3) {
      setState(prev => ({ ...prev, error: "Vous ne pouvez pas ajouter plus de 3 images" }));
      return;
    }

    const newImageUrls = Array.from(files).map(file => URL.createObjectURL(file));
    setState(prev => ({
      ...prev,
      images: [...prev.images, ...newImageUrls],
      imageFiles: [...prev.imageFiles, ...Array.from(files)]
    }));
  };

  const removeImage = (index: number) => {
    setState(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageFiles: prev.imageFiles.filter((_, i) => i !== index)
    }));
  };

  const handleIngredientChange = (index: number, value: string) => {
    setState(prev => {
      const newIngredients = [...prev.ingredients];
      newIngredients[index] = value;
      return { ...prev, ingredients: newIngredients };
    });
  };

  const addIngredient = () => {
    setState(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, ""]
    }));
  };

  const removeIngredient = (index: number) => {
    setState(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState(prev => ({ ...prev, isLoading: true, error: "" }));

    if (state.availableFrom && state.availableTo && new Date(state.availableFrom) >= new Date(state.availableTo)) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "La date de fin doit être postérieure à la date de début"
      }));
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

      const baseData: DishFormData = {
        title: titleInput.value,
        description: descriptionInput.value,
        price: parseFloat(priceInput.value),
        portions: parseInt(portionsInput.value),
        ingredients: state.ingredients.filter(Boolean),
        available: true,
        images: [],
        availableFrom: state.availableFrom ? new Date(state.availableFrom).toISOString() : null,
        availableTo: state.availableTo ? new Date(state.availableTo).toISOString() : null,
      };

      if (state.imageFiles.length > 0) {
        try {
          const uploadedImages = await Promise.all(
            state.imageFiles.map(async (file) => {
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
        }
      }

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
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Une erreur est survenue"
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return {
    ...state,
    handleImageChange,
    removeImage,
    handleSubmit,
    handleIngredientChange,
    addIngredient,
    removeIngredient,
    setAvailableFrom: (value: string) => setState(prev => ({ ...prev, availableFrom: value })),
    setAvailableTo: (value: string) => setState(prev => ({ ...prev, availableTo: value }))
  };
}