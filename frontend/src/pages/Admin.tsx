import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  BookOpen,
  Users,
  ShoppingCart,
  CreditCard,
  Truck,
  PenTool,
  Building2,
  LogOut,
  Shield,
  UserCheck,
} from "lucide-react";

import { useAdminAuth } from "@/contexts/AdminAuthContext";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "./AdminDashboard";
import AuthorsManager from "@/components/admin/AuthorsManager";
import PublishersManager from "@/components/admin/PublishersManager";
import BooksManager from "@/components/admin/BooksManager";
import OrdersManager from "@/components/admin/OrdersManager";
import CustomersManager from "@/components/admin/CustomersManager";
import PaymentsManager from "@/components/admin/PaymentsManager";
import ShippingManager from "@/components/admin/ShippingManager";
import UserManager from "@/components/admin/UserManager";

export default function Admin() {
  // All hooks must be called at the top, before any conditional logic
  const { isAuthenticated, user, logout, hasPermission } = useAdminAuth();

  // State for authors management
  const [authors, setAuthors] = useState([]);
  const [authorsTitle, setAuthorsTitle] = useState("Featured Authors");
  const [authorsTitleTelugu, setAuthorsTitleTelugu] =
    useState("ప్రముఖ రచయితలు");

  // State for publishers management
  const [publishers, setPublishers] = useState([]);
  const [publishersTitle, setPublishersTitle] = useState("Featured Publishers");
  const [publishersTitleTelugu, setPublishersTitleTelugu] = useState(
    "ప్రముఖ ప్రచురణకర్తలు",
  );

  // If not authenticated, show login page (after all hooks are called)
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-800";
      case "admin":
        return "bg-blue-100 text-blue-800";
      case "order_manager":
        return "bg-green-100 text-green-800";
      case "inventory_manager":
        return "bg-purple-100 text-purple-800";
      case "support_staff":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "super_admin":
        return "Super Admin";
      case "admin":
        return "Admin";
      case "order_manager":
        return "Order Manager";
      case "inventory_manager":
        return "Inventory Manager";
      case "support_staff":
        return "Support Staff";
      default:
        return "User";
    }
  };

  // Handlers for authors
  const handleAuthorsUpdate = (
    updatedAuthors: any[],
    title: string,
    titleTelugu: string,
  ) => {
    setAuthors(updatedAuthors);
    setAuthorsTitle(title);
    setAuthorsTitleTelugu(titleTelugu);
  };

  // Handlers for publishers
  const handlePublishersUpdate = (
    updatedPublishers: any[],
    title: string,
    titleTelugu: string,
  ) => {
    setPublishers(updatedPublishers);
    setPublishersTitle(title);
    setPublishersTitleTelugu(titleTelugu);
  };

  // Mock image upload handler (in production, this would call your API)
  const handleImageUpload = async (file: File): Promise<string | null> => {
    // For now, return a placeholder URL
    // In production, upload to your server and return the URL
    return `https://via.placeholder.com/400x400?text=${encodeURIComponent(file.name)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Feb6a9d54076e488bac688c857f8339b7%2F68f0f0b566ee4fabb5929f4ee8330d25?format=webp&width=200"
                  alt="Ataka - The Ultimate Bookstore"
                  className="h-8 w-auto"
                />
              </Link>
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-gray-900">
                  Admin Dashboard
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {hasPermission("settings.view") && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </Button>
              )}
              <div className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-gray-500" />
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {user?.fullName || user?.username}
                  </p>
                  <Badge
                    className={`text-xs ${getRoleColor(user?.role || "")}`}
                  >
                    {getRoleLabel(user?.role || "")}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" onClick={logout} size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList
            className={`grid w-full ${hasPermission("*") ? "grid-cols-9" : "grid-cols-8"}`}
          >
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {hasPermission("books.view") && (
              <TabsTrigger value="books">Books</TabsTrigger>
            )}
            {hasPermission("authors.manage") && (
              <TabsTrigger value="authors">Authors</TabsTrigger>
            )}
            {hasPermission("publishers.manage") && (
              <TabsTrigger value="publishers">Publishers</TabsTrigger>
            )}
            {hasPermission("orders.view") && (
              <TabsTrigger value="orders">Orders</TabsTrigger>
            )}
            {hasPermission("customers.view") && (
              <TabsTrigger value="customers">Customers</TabsTrigger>
            )}
            {hasPermission("payments.view") && (
              <TabsTrigger value="payments">Payments</TabsTrigger>
            )}
            {hasPermission("shipping.view") && (
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            )}
            {hasPermission("*") && (
              <TabsTrigger value="users">Users</TabsTrigger>
            )}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <AdminDashboard />
          </TabsContent>

          {/* Books Tab */}
          {hasPermission("books.view") && (
            <TabsContent value="books" className="space-y-6">
              <BooksManager onUploadImage={handleImageUpload} />
            </TabsContent>
          )}

          {/* Authors Tab */}
          {hasPermission("authors.manage") && (
            <TabsContent value="authors" className="space-y-6">
              <AuthorsManager
                authors={authors}
                title={authorsTitle}
                titleTelugu={authorsTitleTelugu}
                onUpdate={handleAuthorsUpdate}
                onUploadImage={handleImageUpload}
              />
            </TabsContent>
          )}

          {/* Publishers Tab */}
          {hasPermission("publishers.manage") && (
            <TabsContent value="publishers" className="space-y-6">
              <PublishersManager
                publishers={publishers}
                title={publishersTitle}
                titleTelugu={publishersTitleTelugu}
                onUpdate={handlePublishersUpdate}
                onUploadImage={handleImageUpload}
              />
            </TabsContent>
          )}

          {/* Orders Tab */}
          {hasPermission("orders.view") && (
            <TabsContent value="orders" className="space-y-6">
              <OrdersManager />
            </TabsContent>
          )}

          {/* Customers Tab */}
          {hasPermission("customers.view") && (
            <TabsContent value="customers" className="space-y-6">
              <CustomersManager />
            </TabsContent>
          )}

          {/* Payments Tab */}
          {hasPermission("payments.view") && (
            <TabsContent value="payments" className="space-y-6">
              <PaymentsManager />
            </TabsContent>
          )}

          {/* Shipping Tab */}
          {hasPermission("shipping.view") && (
            <TabsContent value="shipping" className="space-y-6">
              <ShippingManager />
            </TabsContent>
          )}

          {/* Users Tab - Super Admin Only */}
          {hasPermission("*") && (
            <TabsContent value="users" className="space-y-6">
              <UserManager />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
