export interface IUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  googleId?: string;
  apartment?: string;
  buildingId?: string;
  createdAt: Date;
  updatedAt: Date;
  isBlocked: boolean;
  emailVerified: boolean;
  verificationCode?: string;
  verificationCodeExpires?: Date;
}

export interface IUserCreate extends Omit<IUser, 'id' | 'createdAt' | 'updatedAt' | 'isBlocked' | 'emailVerified'> {
  password: string;
}

export interface IUserUpdate extends Partial<Omit<IUserCreate, 'password'>> {
  id: string;
  password?: string;
} 