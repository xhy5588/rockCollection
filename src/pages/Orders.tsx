import React, { useState } from 'react';
import { FileText, Plus, Search, Filter, Calendar, User, Car } from 'lucide-react';
import { RentalOrder } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [staffFilter, setStaffFilter] = useState('all');
  const [editingOrder, setEditingOrder] = useState<RentalOrder | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

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

  // Filter orders based on user role
  const userOrders = user?.role === 'client' 
    ? allOrders.filter(order => order.clientId === user.id)
    : user?.role === 'staff'
    ? allOrders.filter(order => order.staffId === user.id)
    : allOrders;

  const filteredOrders = userOrders.filter(order => {
    const matchesSearch = order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.carInfo.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.carInfo.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.staffName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesStaff = staffFilter === 'all' || order.staffId === staffFilter;
    return matchesSearch && matchesStatus && matchesStaff;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditOrder = (order: RentalOrder) => {
    setEditingOrder(order);
    setShowEditModal(true);
  };

  const handleSaveOrder = () => {
    // In a real app, this would save to the backend
    setShowEditModal(false);
    setEditingOrder(null);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingOrder(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage rental orders and track their status.
          </p>
        </div>
        {(user?.role === 'staff' || user?.role === 'admin') && (
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
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
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          {user?.role === 'admin' && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={staffFilter}
                onChange={(e) => setStaffFilter(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Staff</option>
                <option value="2">Sarah Johnson</option>
                <option value="4">Mike Chen</option>
                <option value="5">Emily Rodriguez</option>
                <option value="6">David Thompson</option>
                <option value="7">Lisa Wang</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredOrders.map((order) => (
            <li key={order.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FileText className="h-8 w-8 text-primary-600" />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">
                          Order #{order.id}
                        </p>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        {order.clientName}
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <Car className="h-4 w-4 mr-1" />
                        {order.carInfo.make} {order.carInfo.model} - {order.carInfo.licensePlate}
                      </div>
                      {(user?.role === 'admin' || user?.role === 'staff') && (
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <User className="h-4 w-4 mr-1" />
                          Staff: {order.staffName}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-gray-900">
                      ${order.totalAmount}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {order.startDate.toLocaleDateString()} - {order.endDate.toLocaleDateString()}
                    </div>
                    <p className="text-sm text-gray-500">
                      {order.totalDays} days
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button className="bg-primary-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-primary-700">
                    View Details
                  </button>
                  {(user?.role === 'staff' || user?.role === 'admin') && (
                    <button 
                      onClick={() => handleEditOrder(order)}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-200"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditModal && editingOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Order #{editingOrder.id}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select 
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    defaultValue={editingOrder.status}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                  <input 
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    defaultValue={editingOrder.totalAmount}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea 
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                    defaultValue={editingOrder.notes || ''}
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
                  onClick={handleSaveOrder}
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

export default Orders; 