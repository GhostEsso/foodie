export interface Building {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BuildingWithUsers extends Building {
  users: {
    id: string;
    name: string;
    email: string;
  }[];
  _count: {
    users: number;
  };
}

export interface BuildingFilters {
  searchTerm?: string;
  city?: string;
  postalCode?: string;
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
  city: string;
  postalCode: string;
}

export interface UpdateBuildingData {
  name?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

export interface UseBuildingOptions {
  buildingId: string;
  includeUsers?: boolean;
}

export interface UseBuildingsOptions {
  pageSize?: number;
  initialPage?: number;
  initialFilters?: BuildingFilters;
  initialSort?: BuildingSortOptions;
}