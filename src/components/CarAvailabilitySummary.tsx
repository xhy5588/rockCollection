import React from 'react';
import { Car, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Car as CarType } from '../types';

interface CarAvailabilitySummaryProps {
  cars: CarType[];
}

const CarAvailabilitySummary: React.FC<CarAvailabilitySummaryProps> = ({ cars }) => {
  const totalCars = cars.length;
  const availableCars = cars.filter(car => car.status === 'available').length;
  const rentedCars = cars.filter(car => car.status === 'rented').length;
  const maintenanceCars = cars.filter(car => car.status === 'maintenance').length;
  const availabilityRate = totalCars > 0 ? Math.round((availableCars / totalCars) * 100) : 0;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Car Availability Summary</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
            <Car className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalCars}</div>
          <div className="text-sm text-gray-500">Total Cars</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{availableCars}</div>
          <div className="text-sm text-gray-500">Available</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-2">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{rentedCars}</div>
          <div className="text-sm text-gray-500">Rented</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mx-auto mb-2">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{maintenanceCars}</div>
          <div className="text-sm text-gray-500">Maintenance</div>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Availability Rate</span>
          <span className="font-medium text-gray-900">{availabilityRate}%</span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${availabilityRate}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CarAvailabilitySummary; 