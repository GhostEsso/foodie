import { BookingStatus } from "../booking/booking.types";

export interface BookingUser {
  name: string;
  email: string;
  apartment: string;
  building: {
    name: string;
  };
}

export interface DishBooking {
  id: string;
  portions: number;
  total: number;
  status: BookingStatus;
  pickupTime: string;
  user: BookingUser;
}

export interface DishWithBookings {
  id: string;
  title: string;
  bookings: DishBooking[];
}

export interface MyBookingsState {
  dishes: DishWithBookings[];
  isLoading: boolean;
  error: string;
}

export interface MyBookingsHandlers {
  fetchBookings: () => Promise<void>;
  getStatusLabel: (status: BookingStatus) => string;
} 