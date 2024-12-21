export interface DishStats {
    totalDishes: number;
    availableDishes: number;
    totalPortions: number;
    availablePortions: number;
    averagePrice: number;
    mostPopularDishes: {
      id: string;
      title: string;
      bookingsCount: number;
      likesCount: number;
    }[];
  }
  
  export interface BookingStats {
    totalBookings: number;
    pendingBookings: number;
    approvedBookings: number;
    rejectedBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
    averagePortionsPerBooking: number;
    bookingsByDay: {
      date: string;
      count: number;
      revenue: number;
    }[];
  }
  
  export interface UserStats {
    totalUsers: number;
    activeUsers: number;
    verifiedUsers: number;
    usersWithBuilding: number;
    usersByRole: {
      role: string;
      count: number;
    }[];
    newUsersPerDay: {
      date: string;
      count: number;
    }[];
  }
  
  export interface GlobalStats {
    dishes: DishStats;
    bookings: BookingStats;
    users: UserStats;
    conversationsCount: number;
    messagesCount: number;
    unreadMessagesCount: number;
  }
  
  export interface StatsTimeRange {
    startDate?: Date;
    endDate?: Date;
  }
  
  export interface StatsFilters extends StatsTimeRange {
    buildingId?: string;
    userId?: string;
  }