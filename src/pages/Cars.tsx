import React, { useState } from 'react';
import { Car, Plus, Search, Filter, Calendar, List } from 'lucide-react';
import { Car as CarType, RentalOrder } from '../types';
import CarCalendar from '../components/CarCalendar';
import CarAvailabilitySummary from '../components/CarAvailabilitySummary';

const Cars: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [editingCar, setEditingCar] = useState<CarType | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const cars: CarType[] = [
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
      status: 'rented',
      mileage: 22000,
      fuelType: 'gasoline',
      transmission: 'automatic',
      seats: 5
    },
    {
      id: '3',
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      licensePlate: 'TES-001',
      color: 'White',
      dailyRate: 200,
      status: 'available',
      mileage: 8000,
      fuelType: 'electric',
      transmission: 'automatic',
      seats: 5
    },
    {
      id: '4',
      make: 'BMW',
      model: 'X5',
      year: 2022,
      licensePlate: 'BMW-456',
      color: 'Black',
      dailyRate: 250,
      status: 'rented',
      mileage: 12000,
      fuelType: 'gasoline',
      transmission: 'automatic',
      seats: 7
    },
    {
      id: '5',
      make: 'Audi',
      model: 'A4',
      year: 2023,
      licensePlate: 'AUD-789',
      color: 'Silver',
      dailyRate: 180,
      status: 'available',
      mileage: 9000,
      fuelType: 'gasoline',
      transmission: 'automatic',
      seats: 5
    },
    {
      id: '6',
      make: 'Mercedes',
      model: 'C-Class',
      year: 2022,
      licensePlate: 'MER-012',
      color: 'White',
      dailyRate: 220,
      status: 'maintenance',
      mileage: 15000,
      fuelType: 'gasoline',
      transmission: 'automatic',
      seats: 5
    },
    {
      id: '7',
      make: 'Ford',
      model: 'Mustang',
      year: 2023,
      licensePlate: 'FOR-345',
      color: 'Red',
      dailyRate: 190,
      status: 'available',
      mileage: 5000,
      fuelType: 'gasoline',
      transmission: 'manual',
      seats: 4
    },
    {
      id: '8',
      make: 'Volkswagen',
      model: 'Golf',
      year: 2022,
      licensePlate: 'VW-678',
      color: 'Blue',
      dailyRate: 130,
      status: 'available',
      mileage: 18000,
      fuelType: 'gasoline',
      transmission: 'automatic',
      seats: 5
    }
  ];

  // Demo orders for calendar view
  const orders: RentalOrder[] = [
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
      carId: '1',
      carInfo: { make: 'Toyota', model: 'Camry', licensePlate: 'ABC-123' },
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
      carId: '2',
      carInfo: { make: 'Honda', model: 'Civic', licensePlate: 'XYZ-789' },
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
      carId: '4',
      carInfo: { make: 'BMW', model: 'X5', licensePlate: 'BMW-456' },
      staffId: '7',
      staffName: 'Lisa Wang',
      startDate: new Date('2025-07-05'),
      endDate: new Date('2025-07-08'),
      totalDays: 3,
      totalAmount: 750,
      status: 'completed',
      createdAt: new Date('2025-07-04'),
      updatedAt: new Date('2025-07-08')
    },
    {
      id: '7',
      clientId: '13',
      clientName: 'James Lee',
      carId: '5',
      carInfo: { make: 'Audi', model: 'A4', licensePlate: 'AUD-789' },
      staffId: '4',
      staffName: 'Mike Chen',
      startDate: new Date('2025-08-05'),
      endDate: new Date('2025-08-07'),
      totalDays: 2,
      totalAmount: 360,
      status: 'active',
      createdAt: new Date('2025-08-04'),
      updatedAt: new Date('2025-08-04')
    },
    {
      id: '8',
      clientId: '14',
      clientName: 'Patricia Davis',
      carId: '7',
      carInfo: { make: 'Ford', model: 'Mustang', licensePlate: 'FOR-345' },
      staffId: '5',
      staffName: 'Emily Rodriguez',
      startDate: new Date('2025-07-12'),
      endDate: new Date('2025-07-15'),
      totalDays: 3,
      totalAmount: 570,
      status: 'completed',
      createdAt: new Date('2025-07-11'),
      updatedAt: new Date('2025-07-15')
    },
    {
      id: '9',
      clientId: '15',
      clientName: 'Thomas Anderson',
      carId: '8',
      carInfo: { make: 'Volkswagen', model: 'Golf', licensePlate: 'VW-678' },
      staffId: '6',
      staffName: 'David Thompson',
      startDate: new Date('2025-07-18'),
      endDate: new Date('2025-07-20'),
      totalDays: 2,
      totalAmount: 260,
      status: 'active',
      createdAt: new Date('2025-07-17'),
      updatedAt: new Date('2025-07-17')
    }
  ];

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || car.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'rented': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditCar = (car: CarType) => {
    setEditingCar(car);
    setShowEditModal(true);
  };

  const handleSaveCar = () => {
    // In a real app, this would save to the backend
    setShowEditModal(false);
    setEditingCar(null);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingCar(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cars</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your car fleet and view vehicle information.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="h-4 w-4" />
            </button>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Car
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* View Content */}
      {viewMode === 'list' ? (
        <>
          {/* Availability Summary */}
          <CarAvailabilitySummary cars={filteredCars} />
          
          {/* Cars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <div key={car.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Car className="h-8 w-8 text-primary-600" />
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {car.make} {car.model}
                        </h3>
                        <p className="text-sm text-gray-500">{car.year}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(car.status)}`}>
                      {car.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">License Plate:</span>
                      <span className="font-medium">{car.licensePlate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Color:</span>
                      <span className="font-medium">{car.color}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Daily Rate:</span>
                      <span className="font-medium text-green-600">${car.dailyRate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Mileage:</span>
                      <span className="font-medium">{car.mileage.toLocaleString()} km</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Fuel Type:</span>
                      <span className="font-medium capitalize">{car.fuelType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Transmission:</span>
                      <span className="font-medium capitalize">{car.transmission}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Seats:</span>
                      <span className="font-medium">{car.seats}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <button 
                      onClick={() => handleEditCar(car)}
                      className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
                    >
                      Edit
                    </button>
                    <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCars.length === 0 && (
            <div className="text-center py-12">
              <Car className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No cars found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </>
      ) : (
        /* Calendar View */
        <CarCalendar 
          cars={filteredCars}
          orders={orders}
          onDateClick={(date, carId) => {
            console.log('Clicked on date:', date, 'for car:', carId);
            // You can add navigation to order details or create new order here
          }}
        />
      )}

      {/* Edit Car Modal */}
      {showEditModal && editingCar && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Car - {editingCar.make} {editingCar.model}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select 
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    defaultValue={editingCar.status}
                  >
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Daily Rate ($)</label>
                  <input 
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    defaultValue={editingCar.dailyRate}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mileage (km)</label>
                  <input 
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    defaultValue={editingCar.mileage}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Color</label>
                  <input 
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    defaultValue={editingCar.color}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveCar}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cars; 