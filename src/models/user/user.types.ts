export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  apartment?: string;
  buildingId?: string;
  building?: {
    id: string;
    name: string;
    address: string;
  };
  createdAt: string;
  updatedAt: string;
  isBlocked: boolean;
  emailVerified: boolean;
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN"
}

export interface UserFilters {
  role?: UserRole;
  buildingId?: string;
  isBlocked?: boolean;
  emailVerified?: boolean;
  search?: string;
}

export interface UserSortOptions {
  field: keyof UserProfile;
  direction: 'asc' | 'desc';
}

export interface UserResponse {
  users: UserProfile[];
  totalCount: number;
} 