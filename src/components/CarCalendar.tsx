import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { RentalOrder, Car as CarType } from '../types';

interface CarCalendarProps {
  cars: CarType[];
  orders: RentalOrder[];
  onDateClick?: (date: Date, carId: string) => void;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  bookings: Array<{
    carId: string;
    carName: string;
    clientName: string;
    orderId: string;
    isStart: boolean;
    isEnd: boolean;
    isActive: boolean;
  }>;
}

const CarCalendar: React.FC<CarCalendarProps> = ({ cars, orders, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get calendar days for the current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const days: CalendarDay[] = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      const dayBookings = orders
        .filter(order => {
          const orderStart = new Date(order.startDate);
          const orderEnd = new Date(order.endDate);
          const currentDate = new Date(current);
          currentDate.setHours(0, 0, 0, 0);
          
          return currentDate >= orderStart && currentDate <= orderEnd;
        })
        .map(order => ({
          carId: order.carId,
          carName: `${order.carInfo.make} ${order.carInfo.model}`,
          clientName: order.clientName,
          orderId: order.id,
          isStart: new Date(order.startDate).toDateString() === current.toDateString(),
          isEnd: new Date(order.endDate).toDateString() === current.toDateString(),
          isActive: order.status === 'active'
        }));

      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        isToday: current.toDateString() === new Date().toDateString(),
        bookings: dayBookings
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }, [currentDate, orders]);

  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getBookingColor = (isActive: boolean) => {
    return isActive ? 'bg-blue-500' : 'bg-gray-400';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Calendar Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CalendarIcon className="h-6 w-6 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">
              {formatDate(currentDate)}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Today
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-50 px-3 py-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`min-h-[120px] bg-white p-2 ${
                !day.isCurrentMonth ? 'bg-gray-50' : ''
              } ${day.isToday ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className={`text-sm font-medium ${
                day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
              } ${day.isToday ? 'text-blue-600' : ''}`}>
                {day.date.getDate()}
              </div>
              
              {/* Bookings */}
              <div className="mt-1 space-y-1">
                {day.bookings.map((booking, bookingIndex) => (
                  <div
                    key={bookingIndex}
                    className={`text-xs p-1 rounded truncate cursor-pointer ${
                      getBookingColor(booking.isActive)
                    } text-white`}
                    title={`${booking.carName} - ${booking.clientName}`}
                    onClick={() => onDateClick?.(day.date, booking.carId)}
                  >
                    <div className="font-medium truncate">
                      {booking.carName}
                    </div>
                    <div className="truncate opacity-90">
                      {booking.clientName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Active Rental</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded"></div>
            <span className="text-gray-600">Completed/Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCalendar; 