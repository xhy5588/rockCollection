export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'client' | 'staff' | 'admin';
  driverLicensePhoto?: string;
  idPhoto?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StaffRevenue {
  staffId: string;
  staffName: string;
  totalOrders: number;
  totalRevenue: number;
  completedOrders: number;
  pendingOrders: number;
  activeOrders: number;
  averageOrderValue: number;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  dailyRate: number;
  status: 'available' | 'rented' | 'maintenance';
  image?: string;
  description?: string;
  mileage: number;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  transmission: 'manual' | 'automatic';
  seats: number;
}

export interface RentalOrder {
  id: string;
  clientId: string;
  clientName: string;
  carId: string;
  carInfo: {
    make: string;
    model: string;
    licensePlate: string;
  };
  staffId: string; // Made required - every order must have a staff member
  staffName: string; // Made required - every order must have a staff member
  startDate: Date;
  endDate: Date;
  totalDays: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface DashboardStats {
  totalCars: number;
  availableCars: number;
  activeRentals: number;
  totalRevenue: number;
  pendingOrders: number;
  totalStaff?: number;
  staffRevenue?: StaffRevenue[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: 'client' | 'staff';
} 