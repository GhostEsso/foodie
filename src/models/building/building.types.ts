export interface Building {
  id: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface BuildingWithUsers extends Building {
  users: {
    id: string;
    name: string;
    email: string;
    apartment: string | null;
  }[];
  _count: {
    users: number;
  };
}

export interface BuildingFilters {
  search?: string;
  hasUsers?: boolean;
}

export interface BuildingSortOptions {
  field: keyof Building;
  direction: 'asc' | 'desc';
}

export interface BuildingResponse {
  buildings: BuildingWithUsers[];
  totalCount: number;
}

export interface CreateBuildingData {
  name: string;
  address: string;
}

export interface UpdateBuildingData {
  name?: string;
  address?: string;
} 