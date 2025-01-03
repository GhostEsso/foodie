export interface BookingFormDish {
  id: string;
  title: string;
  price: number;
  portions: number;
  availablePortions: number;
  availableFrom: string | null;
  availableTo: string | null;
}

export interface BookingFormData {
  dishId: string;
  portions: number;
  pickupTime: string;
}

export interface BookingFormState {
  portions: number;
  isLoading: boolean;
  error: string | null;
} 