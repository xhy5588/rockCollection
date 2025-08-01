# Car Rental Management System

A modern, responsive web application for managing a car rental business. Built with React, TypeScript, and Tailwind CSS.

## Features

### 🔐 Authentication System
- **Three User Types**: Client, Staff, and Administrator
- **Secure Login/Register**: Email and password authentication
- **Role-based Access Control**: Different features for different user types

### 👤 User Management
- **Client Accounts**: Can register, view their profile, upload documents (driver's license, ID), and view order history
- **Staff Accounts**: Can manage clients, create rental orders, and view all rental information
- **Admin Accounts**: Full access to all system features including user management

### 🚗 Car Fleet Management
- **Car Inventory**: Add, edit, and manage car information
- **Car Details**: Make, model, year, license plate, color, daily rate, status, mileage, fuel type, transmission, seats
- **Status Tracking**: Available, Rented, or Maintenance
- **Search & Filter**: Find cars by make, model, license plate, or status
- **Calendar View**: Visual calendar showing car bookings and availability over time
- **Availability Summary**: Quick overview of car fleet status and availability rates

### 📋 Order Management
- **Rental Orders**: Create and manage rental orders with client and car information
- **Staff Assignment**: Every order is assigned to a specific staff member
- **Order Tracking**: Pending, Confirmed, Active, Completed, or Cancelled status
- **Date Management**: Start and end dates with automatic day calculation
- **Pricing**: Automatic total calculation based on daily rate and duration
- **Staff Filtering**: Admin can filter orders by staff member

### 📊 Dashboard
- **Business Overview**: Key metrics including total cars, available cars, active rentals, revenue
- **Staff Revenue Tracking**: Admin can view each staff member's performance and revenue
- **Recent Activity**: Latest orders and available cars
- **Quick Actions**: Fast access to common tasks for staff and admin

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Beautiful Interface**: Clean, modern design with Tailwind CSS
- **Intuitive Navigation**: Sidebar navigation with role-based menu items
- **Interactive Elements**: Hover effects, loading states, and smooth transitions

## Demo Accounts

For testing purposes, you can use these demo accounts:

### Admin Account
- **Email**: admin@carrental.com
- **Password**: password
- **Features**: Full access to all system features

### Staff Accounts
- **Email**: staff1@carrental.com (Sarah Johnson)
- **Email**: staff2@carrental.com (Mike Chen)
- **Email**: staff3@carrental.com (Emily Rodriguez)
- **Email**: staff4@carrental.com (David Thompson)
- **Email**: staff5@carrental.com (Lisa Wang)
- **Password**: password
- **Features**: Can manage clients, create orders, and view their assigned orders

### Client Account
- **Email**: client@example.com
- **Password**: password
- **Features**: Can view profile and order history

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Build Tool**: Create React App

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd car-rental-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (not recommended)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx      # Main layout with navigation
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Login.tsx       # Login page
│   ├── Register.tsx    # Registration page
│   ├── Cars.tsx        # Car management
│   ├── Orders.tsx      # Order management
│   ├── Users.tsx       # User management (admin only)
│   └── Profile.tsx     # User profile
├── types/              # TypeScript type definitions
│   └── index.ts        # Interface definitions
├── App.tsx             # Main app component
├── index.tsx           # App entry point
└── index.css           # Global styles
```

## Key Features by User Role

### Client
- ✅ Register and login
- ✅ View and edit profile information
- ✅ Upload driver's license and ID photos
- ✅ View order history
- ✅ View available cars

### Staff
- ✅ All client features
- ✅ View all client information
- ✅ Create rental orders for clients
- ✅ Manage car inventory
- ✅ View all orders and their status

### Administrator
- ✅ All staff features
- ✅ Manage all users (clients and staff)
- ✅ Full system access
- ✅ View business analytics and reports

## Future Enhancements

- [ ] Backend API integration
- [ ] Real-time notifications
- [ ] Payment processing
- [ ] GPS tracking for cars
- [ ] Maintenance scheduling
- [ ] Advanced reporting and analytics
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Email notifications
- [ ] Document verification system

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@carrental.com or create an issue in the repository. 