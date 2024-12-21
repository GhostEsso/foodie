export interface IBooking {
  id: string;
  dishId: string;
  userId: string;
  pickupTime: Date;
  portions: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBookingCreate extends Omit<IBooking, 'id' | 'createdAt' | 'updatedAt' | 'status'> {
  status?: IBooking['status'];
}

export interface IBookingUpdate extends Partial<IBookingCreate> {
  id: string;
} 