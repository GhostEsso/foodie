export interface Booking {
  id: string;
  dishId: string;
  userId: string;
  pickupTime: string;
  portions: number;
  status: BookingStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
  dish: {
    id: string;
    title: string;
    price: number;
    images: string[];
    user: {
      id: string;
      name: string;
      email: string;
      building: {
        id: string;
        name: string;
        address: string;
      } | null;
    };
  };
}

export type BookingStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface BookingFilters {
  status?: BookingStatus;
  userId?: string;
  dishId?: string;
  fromDate?: Date;
  toDate?: Date;
}

export interface BookingSortOptions {
  field: keyof Booking;
  direction: 'asc' | 'desc';
}

export interface BookingResponse {
  bookings: Booking[];
  totalCount: number;
}

export interface CreateBookingData {
  dishId: string;
  pickupTime: Date;
  portions: number;
}

export interface UpdateBookingData {
  pickupTime?: Date;
  portions?: number;
  status?: BookingStatus;
} 