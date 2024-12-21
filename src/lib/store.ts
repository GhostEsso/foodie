import { create } from 'zustand';
import { PrismaClient } from '@prisma/client';
import { IDish, IUser, IBooking } from '../models';

// Meilleure gestion de l'instance Prisma pour le développement
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

interface AppState {
  user: IUser | null;
  dishes: IDish[];
  bookings: IBooking[];
  setUser: (user: IUser | null) => void;
  setDishes: (dishes: IDish[]) => void;
  addDish: (dish: IDish) => void;
  updateDish: (dish: IDish) => void;
  setBookings: (bookings: IBooking[]) => void;
  updateBooking: (booking: IBooking) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  dishes: [],
  bookings: [],
  
  setUser: (user) => set({ user }),
  
  setDishes: (dishes) => set({ dishes }),
  addDish: (dish) => set((state) => ({ 
    dishes: [...state.dishes, dish] 
  })),
  updateDish: (dish) => set((state) => ({
    dishes: state.dishes.map(d => d.id === dish.id ? dish : d)
  })),
  
  setBookings: (bookings) => set({ bookings }),
  updateBooking: (booking) => set((state) => ({
    bookings: state.bookings.map(b => b.id === booking.id ? booking : b)
  }))
})); 