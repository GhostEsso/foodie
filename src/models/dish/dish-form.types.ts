export interface DishFormData {
  title: string;
  description: string;
  price: number;
  portions: number;
  ingredients: string[];
  available: boolean;
  images: string[];
  availableFrom: string | null;
  availableTo: string | null;
}

export interface DishFormState {
  isLoading: boolean;
  error: string;
  ingredients: string[];
  images: string[];
  imageFiles: File[];
  availableFrom: string;
  availableTo: string;
}

export interface DishFormHandlers {
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleIngredientChange: (index: number, value: string) => void;
  addIngredient: () => void;
  removeIngredient: (index: number) => void;
} 