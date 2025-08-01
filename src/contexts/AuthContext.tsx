import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Demo users for testing
  const demoUsers: User[] = [
    {
      id: '1',
      email: 'admin@carrental.com',
      name: 'Admin User',
      phone: '+1-555-0100',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      email: 'staff1@carrental.com',
      name: 'Sarah Johnson',
      phone: '+1-555-0101',
      role: 'staff',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      email: 'client@example.com',
      name: 'John Doe',
      phone: '+1-555-0102',
      role: 'client',
      driverLicensePhoto: '/demo-license.jpg',
      idPhoto: '/demo-id.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      email: 'staff2@carrental.com',
      name: 'Mike Chen',
      phone: '+1-555-0103',
      role: 'staff',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '5',
      email: 'staff3@carrental.com',
      name: 'Emily Rodriguez',
      phone: '+1-555-0104',
      role: 'staff',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '6',
      email: 'staff4@carrental.com',
      name: 'David Thompson',
      phone: '+1-555-0105',
      role: 'staff',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '7',
      email: 'staff5@carrental.com',
      name: 'Lisa Wang',
      phone: '+1-555-0106',
      role: 'staff',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = demoUsers.find(u => u.email === credentials.email);
    
    if (foundUser && credentials.password === 'password') {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
    } else {
      throw new Error('Invalid credentials');
    }
    
    setLoading(false);
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: data.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 