export type UserRole = 'USER' | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  building: {
    id: string;
    name: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserFilters {
  role?: UserRole;
  emailVerified?: boolean;
  buildingId?: string;
  searchTerm?: string;
}

export interface UserSortOptions {
  field: keyof UserProfile;
  direction: 'asc' | 'desc';
}

export interface UserResponse {
  users: UserProfile[];
  totalCount: number;
}

export interface UseUserOptions {
  userId: string;
  includeProfile?: boolean;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  buildingId?: string | null;
  role?: UserRole;
  emailVerified?: boolean;
} 