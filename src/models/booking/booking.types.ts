import { IBooking } from './booking.interface';

export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export type BookingWithDetails = Omit<IBooking, 'dish'> & {
  dish: {
    title: string;
    price: number;
    images: string[];
    user: {
      name: string;
      building: { name: string; } | null | undefined;
    };
  };
};

export type BookingFormDish = {
  id: string;
  title: string;
  price: number;
  portions: number;
  availablePortions: number;
  availableFrom: string | null;
  availableTo: string | null;
};

export type BookingFormData = {
  dishId: string;
  portions: number;
  pickupTime: string;
};

export type BookingFilters = {
  status?: BookingStatus;
  userId?: string;
  dishId?: string;
  fromDate?: Date;
  toDate?: Date;
};

export type BookingSortOptions = {
  field: keyof IBooking;
  direction: 'asc' | 'desc';
}; 