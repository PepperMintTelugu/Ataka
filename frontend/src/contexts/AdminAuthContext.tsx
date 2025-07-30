import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'order_manager' | 'inventory_manager' | 'support_staff';
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

interface AdminAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Default users for the system
const defaultUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@ataka.com", 
    role: "super_admin",
    permissions: ["*"], // All permissions
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    username: "orders",
    email: "orders@ataka.com",
    role: "order_manager", 
    permissions: ["orders.view", "orders.edit", "orders.export", "customers.view", "shipping.view"],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    username: "inventory",
    email: "inventory@ataka.com",
    role: "inventory_manager",
    permissions: ["books.view", "books.edit", "books.create", "books.delete", "authors.manage", "publishers.manage"],
    isActive: true,
    createdAt: new Date().toISOString(),
  }
];

// Role-based permissions mapping
const rolePermissions = {
  super_admin: ["*"], // All permissions
  admin: [
    "dashboard.view", "books.manage", "orders.manage", "customers.manage", 
    "payments.view", "shipping.manage", "settings.view", "reports.view"
  ],
  order_manager: [
    "dashboard.view", "orders.view", "orders.edit", "orders.export", 
    "customers.view", "shipping.view", "reports.orders"
  ],
  inventory_manager: [
    "dashboard.view", "books.view", "books.edit", "books.create", "books.delete",
    "authors.manage", "publishers.manage", "reports.inventory"
  ],
  support_staff: [
    "dashboard.view", "orders.view", "customers.view", "support.manage"
  ]
};

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('adminUser');
    const sessionExpiry = localStorage.getItem('adminSessionExpiry');
    
    if (savedUser && sessionExpiry) {
      const expiryTime = new Date(sessionExpiry);
      if (expiryTime > new Date()) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // Session expired
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminSessionExpiry');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // In production, this would call your backend API
    // For now, using default credentials
    
    if ((username === "admin" && password === "admin") ||
        (username === "orders" && password === "orders") ||
        (username === "inventory" && password === "inventory")) {
      
      const userData = defaultUsers.find(u => u.username === username);
      if (userData && userData.isActive) {
        const sessionUser = {
          ...userData,
          lastLogin: new Date().toISOString()
        };
        
        // Set session (expires in 8 hours)
        const sessionExpiry = new Date();
        sessionExpiry.setHours(sessionExpiry.getHours() + 8);
        
        localStorage.setItem('adminUser', JSON.stringify(sessionUser));
        localStorage.setItem('adminSessionExpiry', sessionExpiry.toISOString());
        
        setUser(sessionUser);
        setIsAuthenticated(true);
        return true;
      }
    }
    
    return false;
  };

  const logout = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminSessionExpiry');
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.permissions.includes("*")) return true; // Super admin
    return user.permissions.includes(permission);
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  return (
    <AdminAuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      hasPermission,
      hasRole
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
