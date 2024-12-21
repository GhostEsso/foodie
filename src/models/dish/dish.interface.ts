export interface IDish {
  id: string;
  title: string;
  description: string;
  price: number;
  ingredients: string[];
  images: string[];
  available: boolean;
  portions: number;
  likesCount: number;
  availableFrom: Date | null;
  availableTo: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    name: string;
    building: {
      name: string;
    } | null;
  };
}

export interface IDishCreate extends Omit<IDish, 'id' | 'createdAt' | 'updatedAt' | 'likesCount' | 'images' | 'user'> {
  images?: File[];
}

export interface IDishUpdate extends Partial<IDishCreate> {
  id: string;
} 