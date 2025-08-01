import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Car, 
  Users, 
  DollarSign, 
  Clock, 
  TrendingUp,
  Calendar,
  MapPin,
  BarChart3
} from 'lucide-react';
import { DashboardStats, RentalOrder, Car as CarType, StaffRevenue } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalCars: 0,
    availableCars: 0,
    activeRentals: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });

  // Demo data
  const demoStats: DashboardStats = {
    totalCars: 25,
    availableCars: 18,
    activeRentals: 7,
    totalRevenue: 3530,
    pendingOrders: 2,
    totalStaff: 5
  };

  const allOrders: RentalOrder[] = [
    {
      id: '1',
      clientId: '3',
      clientName: 'John Doe',
      carId: '1',
      carInfo: { make: 'Toyota', model: 'Camry', licensePlate: 'ABC-123' },
      staffId: '2',
      staffName: 'Sarah Johnson',
      startDate: new Date('2025-07-15'),
      endDate: new Date('2025-07-18'),
      totalDays: 3,
      totalAmount: 450,
      status: 'active',
      createdAt: new Date('2025-07-14'),
      updatedAt: new Date('2025-07-14')
    },
    {
      id: '2',
      clientId: '8',
      clientName: 'Jane Smith',
      carId: '2',
      carInfo: { make: 'Honda', model: 'Civic', licensePlate: 'XYZ-789' },
      staffId: '4',
      staffName: 'Mike Chen',
      startDate: new Date('2025-07-20'),
      endDate: new Date('2025-07-22'),
      totalDays: 2,
      totalAmount: 320,
      status: 'pending',
      createdAt: new Date('2025-07-19'),
      updatedAt: new Date('2025-07-19')
    },
    {
      id: '3',
      clientId: '9',
      clientName: 'Mike Johnson',
      carId: '3',
      carInfo: { make: 'Tesla', model: 'Model 3', licensePlate: 'TES-001' },
      staffId: '2',
      staffName: 'Sarah Johnson',
      startDate: new Date('2025-07-10'),
      endDate: new Date('2025-07-12'),
      totalDays: 2,
      totalAmount: 400,
      status: 'completed',
      createdAt: new Date('2025-07-09'),
      updatedAt: new Date('2025-07-12')
    },
    {
      id: '4',
      clientId: '10',
      clientName: 'Alice Brown',
      carId: '4',
      carInfo: { make: 'BMW', model: 'X5', licensePlate: 'BMW-456' },
      staffId: '5',
      staffName: 'Emily Rodriguez',
      startDate: new Date('2025-07-25'),
      endDate: new Date('2025-07-28'),
      totalDays: 3,
      totalAmount: 600,
      status: 'active',
      createdAt: new Date('2025-07-24'),
      updatedAt: new Date('2025-07-24')
    },
    {
      id: '5',
      clientId: '11',
      clientName: 'Robert Wilson',
      carId: '5',
      carInfo: { make: 'Audi', model: 'A4', licensePlate: 'AUD-789' },
      staffId: '6',
      staffName: 'David Thompson',
      startDate: new Date('2025-07-30'),
      endDate: new Date('2025-08-02'),
      totalDays: 3,
      totalAmount: 480,
      status: 'pending',
      createdAt: new Date('2025-07-29'),
      updatedAt: new Date('2025-07-29')
    },
    {
      id: '6',
      clientId: '12',
      clientName: 'Maria Garcia',
      carId: '6',
      carInfo: { make: 'Mercedes', model: 'C-Class', licensePlate: 'MER-012' },
      staffId: '7',
      staffName: 'Lisa Wang',
      startDate: new Date('2025-07-05'),
      endDate: new Date('2025-07-08'),
      totalDays: 3,
      totalAmount: 540,
      status: 'completed',
      createdAt: new Date('2025-07-04'),
      updatedAt: new Date('2025-07-08')
    },
    {
      id: '7',
      clientId: '13',
      clientName: 'James Lee',
      carId: '7',
      carInfo: { make: 'Ford', model: 'Mustang', licensePlate: 'FOR-345' },
      staffId: '4',
      staffName: 'Mike Chen',
      startDate: new Date('2025-08-05'),
      endDate: new Date('2025-08-07'),
      totalDays: 2,
      totalAmount: 380,
      status: 'active',
      createdAt: new Date('2025-08-04'),
      updatedAt: new Date('2025-08-04')
    },
    {
      id: '8',
      clientId: '14',
      clientName: 'Patricia Davis',
      carId: '8',
      carInfo: { make: 'Volkswagen', model: 'Golf', licensePlate: 'VW-678' },
      staffId: '5',
      staffName: 'Emily Rodriguez',
      startDate: new Date('2025-07-12'),
      endDate: new Date('2025-07-15'),
      totalDays: 3,
      totalAmount: 360,
      status: 'completed',
      createdAt: new Date('2025-07-11'),
      updatedAt: new Date('2025-07-15')
    }
  ];

  // Calculate staff revenue for admin users
  const calculateStaffRevenue = (): StaffRevenue[] => {
    const staffMap = new Map<string, StaffRevenue>();
    
    allOrders.forEach(order => {
      const existing = staffMap.get(order.staffId);
      if (existing) {
        existing.totalOrders++;
        existing.totalRevenue += order.totalAmount;
        if (order.status === 'completed') existing.completedOrders++;
        else if (order.status === 'pending') existing.pendingOrders++;
        else if (order.status === 'active') existing.activeOrders++;
      } else {
        const newStaff: StaffRevenue = {
          staffId: order.staffId,
          staffName: order.staffName,
          totalOrders: 1,
          totalRevenue: order.totalAmount,
          completedOrders: order.status === 'completed' ? 1 : 0,
          pendingOrders: order.status === 'pending' ? 1 : 0,
          activeOrders: order.status === 'active' ? 1 : 0,
          averageOrderValue: order.totalAmount
        };
        staffMap.set(order.staffId, newStaff);
      }
    });

    // Calculate average order values
    staffMap.forEach(staff => {
      staff.averageOrderValue = Math.round(staff.totalRevenue / staff.totalOrders);
    });

    return Array.from(staffMap.values()).sort((a, b) => b.totalRevenue - a.totalRevenue);
  };

  // Filter orders based on user role
  const recentOrders = user?.role === 'client' 
    ? allOrders.filter(order => order.clientId === user.id)
    : allOrders;

  const availableCars: CarType[] = [
    {
      id: '1',
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      licensePlate: 'ABC-123',
      color: 'Silver',
      dailyRate: 150,
      status: 'available',
      mileage: 15000,
      fuelType: 'gasoline',
      transmission: 'automatic',
      seats: 5
    },
    {
      id: '2',
      make: 'Honda',
      model: 'Civic',
      year: 2022,
      licensePlate: 'XYZ-789',
      color: 'Blue',
      dailyRate: 120,
      status: 'available',
      mileage: 22000,
      fuelType: 'gasoline',
      transmission: 'automatic',
      seats: 5
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats(demoStats);
    }, 500);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.name}. Here's what's happening with your car rental business.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Car className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Cars</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalCars}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Car className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Available Cars</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.availableCars}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Rentals</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.activeRentals}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                    <dd className="text-lg font-medium text-gray-900">${stats.totalRevenue.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Orders
            </h3>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {order.clientName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {order.carInfo.make} {order.carInfo.model} - {order.carInfo.licensePlate}
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {order.startDate.toLocaleDateString()} - {order.endDate.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${order.totalAmount}
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Available Cars */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Available Cars
            </h3>
            <div className="space-y-4">
              {availableCars.map((car) => (
                <div key={car.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {car.make} {car.model} ({car.year})
                      </h4>
                      <p className="text-sm text-gray-500">
                        {car.color} • {car.transmission} • {car.seats} seats
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        License: {car.licensePlate} • Mileage: {car.mileage.toLocaleString()} km
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${car.dailyRate}/day
                      </p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Staff Revenue (Admin Only) */}
      {user?.role === 'admin' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Staff Revenue Performance
              </h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Staff Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg. Order Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status Breakdown
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {calculateStaffRevenue().map((staff) => (
                    <tr key={staff.staffId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{staff.staffName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{staff.totalOrders}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">
                          ${staff.totalRevenue.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${staff.averageOrderValue}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {staff.completedOrders} completed
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {staff.activeOrders} active
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {staff.pendingOrders} pending
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {(user?.role === 'staff' || user?.role === 'admin') && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                <Car className="h-4 w-4 mr-2" />
                Add New Car
              </button>
              <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                <Users className="h-4 w-4 mr-2" />
                Create Order
              </button>
              <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Reports
              </button>
              <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                <MapPin className="h-4 w-4 mr-2" />
                Manage Locations
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 