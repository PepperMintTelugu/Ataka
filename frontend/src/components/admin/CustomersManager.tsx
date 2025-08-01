import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  UserCheck,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
  Calendar,
  Star,
  Eye,
  Download,
  Search,
  Filter,
  TrendingUp,
  Heart,
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  joinDate: string;
  lastOrderDate?: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  status: "active" | "inactive";
  customerType: "new" | "regular" | "vip";
  wishlistItems: number;
  reviewsGiven: number;
  averageRating: number;
  favoriteCategory: string;
  notes?: string;
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Ramesh Kumar",
    email: "ramesh@email.com",
    phone: "+91 98765 43210",
    address: {
      street: "123 Main Street, Jubilee Hills",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500033",
    },
    joinDate: "2024-01-15",
    lastOrderDate: "2024-12-01",
    totalOrders: 8,
    totalSpent: 4250,
    averageOrderValue: 531,
    status: "active",
    customerType: "vip",
    wishlistItems: 5,
    reviewsGiven: 6,
    averageRating: 4.7,
    favoriteCategory: "Literature",
    notes: "Prefers classic Telugu literature",
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "priya@email.com",
    phone: "+91 87654 32109",
    address: {
      street: "456 Park Road, Banjara Hills",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500034",
    },
    joinDate: "2024-03-20",
    lastOrderDate: "2024-12-03",
    totalOrders: 4,
    totalSpent: 1680,
    averageOrderValue: 420,
    status: "active",
    customerType: "regular",
    wishlistItems: 8,
    reviewsGiven: 3,
    averageRating: 4.3,
    favoriteCategory: "Poetry",
  },
  {
    id: "3",
    name: "Suresh Reddy",
    email: "suresh@email.com",
    phone: "+91 76543 21098",
    address: {
      street: "789 Gandhi Road, Secunderabad",
      city: "Secunderabad",
      state: "Telangana",
      pincode: "500015",
    },
    joinDate: "2024-06-10",
    lastOrderDate: "2024-12-08",
    totalOrders: 6,
    totalSpent: 2890,
    averageOrderValue: 482,
    status: "active",
    customerType: "regular",
    wishlistItems: 3,
    reviewsGiven: 4,
    averageRating: 4.5,
    favoriteCategory: "Devotional",
  },
  {
    id: "4",
    name: "Lakshmi Devi",
    email: "lakshmi@email.com",
    phone: "+91 65432 10987",
    address: {
      street: "321 Temple Street, Kukatpally",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500072",
    },
    joinDate: "2024-09-05",
    lastOrderDate: "2024-12-09",
    totalOrders: 2,
    totalSpent: 920,
    averageOrderValue: 460,
    status: "active",
    customerType: "new",
    wishlistItems: 12,
    reviewsGiven: 1,
    averageRating: 5.0,
    favoriteCategory: "Educational",
  },
  {
    id: "5",
    name: "Venkat Rao",
    email: "venkat@email.com",
    phone: "+91 54321 09876",
    address: {
      street: "654 Market Road, Nizamabad",
      city: "Nizamabad",
      state: "Telangana",
      pincode: "503001",
    },
    joinDate: "2024-02-28",
    lastOrderDate: "2024-11-15",
    totalOrders: 3,
    totalSpent: 1150,
    averageOrderValue: 383,
    status: "inactive",
    customerType: "regular",
    wishlistItems: 2,
    reviewsGiven: 2,
    averageRating: 4.0,
    favoriteCategory: "Fiction",
    notes: "Last order cancelled, might need follow-up",
  },
  {
    id: "6",
    name: "Anjali Reddy",
    email: "anjali@email.com",
    phone: "+91 43210 98765",
    address: {
      street: "987 College Road, Warangal",
      city: "Warangal",
      state: "Telangana",
      pincode: "506002",
    },
    joinDate: "2024-04-12",
    totalOrders: 12,
    totalSpent: 6750,
    averageOrderValue: 562,
    status: "active",
    customerType: "vip",
    wishlistItems: 15,
    reviewsGiven: 10,
    averageRating: 4.8,
    favoriteCategory: "Literature",
    lastOrderDate: "2024-12-06",
  },
];

export default function CustomersManager() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
    status: "active",
    customerType: "new",
    notes: "",
  });

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesType =
      filterType === "all" || customer.customerType === filterType;
    const matchesStatus =
      filterStatus === "all" || customer.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "regular":
        return "bg-green-100 text-green-800";
      case "vip":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const exportCustomers = () => {
    const dataStr = JSON.stringify(filteredCustomers, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "customers-export.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const vipCustomers = customers.filter((c) => c.customerType === "vip").length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      alert("Please fill in all required fields");
      return;
    }

    const customer: Customer = {
      id: String(customers.length + 1),
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      address: newCustomer.address || {
        street: "",
        city: "",
        state: "",
        pincode: "",
      },
      joinDate: new Date().toISOString().split("T")[0],
      totalOrders: 0,
      totalSpent: 0,
      averageOrderValue: 0,
      status: newCustomer.status || "active",
      customerType: newCustomer.customerType || "new",
      wishlistItems: 0,
      reviewsGiven: 0,
      averageRating: 0,
      favoriteCategory: "General",
      notes: newCustomer.notes,
    };

    setCustomers([...customers, customer]);
    setShowAddCustomer(false);
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        pincode: "",
      },
      status: "active",
      customerType: "new",
      notes: "",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Customer Management
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Manage customer accounts and relationships
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={exportCustomers}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" onClick={() => setShowAddCustomer(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold">{totalCustomers}</p>
                <p className="text-sm text-gray-600">Total Customers</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold">{activeCustomers}</p>
                <p className="text-sm text-gray-600">Active Customers</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold">{vipCustomers}</p>
                <p className="text-sm text-gray-600">VIP Customers</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-2xl font-bold">
                  ₹{totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Customer LTV</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search customers by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Customers Table */}
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50/50">
                    <th className="text-left p-4 font-medium">Customer</th>
                    <th className="text-left p-4 font-medium">Contact</th>
                    <th className="text-left p-4 font-medium">Orders</th>
                    <th className="text-left p-4 font-medium">Spent</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Last Order</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b hover:bg-gray-50/50"
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-gray-600">
                              {customer.favoriteCategory}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div className="flex items-center mb-1">
                            <Mail className="w-3 h-3 mr-2 text-gray-400" />
                            <span>{customer.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 mr-2 text-gray-400" />
                            <span>{customer.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-center">
                          <p className="font-semibold text-lg">
                            {customer.totalOrders}
                          </p>
                          <p className="text-xs text-gray-500">
                            ₹{customer.averageOrderValue} avg
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold">
                          ₹{customer.totalSpent.toLocaleString()}
                        </p>
                      </td>
                      <td className="p-4">
                        <Badge
                          className={getCustomerTypeColor(
                            customer.customerType,
                          )}
                        >
                          {customer.customerType.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(customer.status)}>
                          {customer.status.charAt(0).toUpperCase() +
                            customer.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <p className="text-sm">
                          {customer.lastOrderDate
                            ? new Date(
                                customer.lastOrderDate,
                              ).toLocaleDateString()
                            : "Never"}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCustomer(customer)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No customers found
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterType !== "all" || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Customer data will appear here as users register"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      {selectedCustomer && (
        <Dialog
          open={!!selectedCustomer}
          onOpenChange={() => setSelectedCustomer(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Customer Details - {selectedCustomer.name}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500 mt-1" />
                    <div>
                      <p>{selectedCustomer.address.street}</p>
                      <p>
                        {selectedCustomer.address.city},{" "}
                        {selectedCustomer.address.state}
                      </p>
                      <p>{selectedCustomer.address.pincode}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <span>
                      Joined{" "}
                      {new Date(selectedCustomer.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Orders:</span>
                    <span className="font-semibold">
                      {selectedCustomer.totalOrders}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Spent:</span>
                    <span className="font-semibold">
                      ₹{selectedCustomer.totalSpent.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Order Value:</span>
                    <span className="font-semibold">
                      ₹{selectedCustomer.averageOrderValue}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wishlist Items:</span>
                    <span className="font-semibold">
                      {selectedCustomer.wishlistItems}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reviews Given:</span>
                    <span className="font-semibold">
                      {selectedCustomer.reviewsGiven}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Rating:</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="font-semibold">
                        {selectedCustomer.averageRating}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Preferences */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Preferences & Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Customer Type
                      </p>
                      <Badge
                        className={getCustomerTypeColor(
                          selectedCustomer.customerType,
                        )}
                      >
                        {selectedCustomer.customerType.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <Badge
                        className={getStatusColor(selectedCustomer.status)}
                      >
                        {selectedCustomer.status.charAt(0).toUpperCase() +
                          selectedCustomer.status.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Favorite Category
                      </p>
                      <Badge variant="outline">
                        {selectedCustomer.favoriteCategory}
                      </Badge>
                    </div>
                  </div>

                  {selectedCustomer.lastOrderDate && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-1">Last Order</p>
                      <p className="font-medium">
                        {new Date(
                          selectedCustomer.lastOrderDate,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {selectedCustomer.notes && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-1">Notes</p>
                      <p className="text-sm bg-gray-50 p-3 rounded-lg">
                        {selectedCustomer.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline">
                <ShoppingCart className="w-4 h-4 mr-2" />
                View Orders
              </Button>
              <Button>Edit Customer</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Customer Dialog */}
      {showAddCustomer && (
        <Dialog open={showAddCustomer} onOpenChange={setShowAddCustomer}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name *</label>
                  <Input
                    value={newCustomer.name || ""}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, name: e.target.value })
                    }
                    placeholder="Customer name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email *</label>
                  <Input
                    type="email"
                    value={newCustomer.email || ""}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, email: e.target.value })
                    }
                    placeholder="customer@email.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone *</label>
                  <Input
                    value={newCustomer.phone || ""}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, phone: e.target.value })
                    }
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Customer Type</label>
                  <Select
                    value={newCustomer.customerType || "new"}
                    onValueChange={(value) =>
                      setNewCustomer({
                        ...newCustomer,
                        customerType: value as "new" | "regular" | "vip",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Street Address</label>
                  <Input
                    value={newCustomer.address?.street || ""}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        address: {
                          ...(newCustomer.address || {}),
                          street: e.target.value,
                        },
                      })
                    }
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">City</label>
                  <Input
                    value={newCustomer.address?.city || ""}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        address: {
                          ...(newCustomer.address || {}),
                          city: e.target.value,
                        },
                      })
                    }
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">State</label>
                  <Input
                    value={newCustomer.address?.state || ""}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        address: {
                          ...(newCustomer.address || {}),
                          state: e.target.value,
                        },
                      })
                    }
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Pincode</label>
                  <Input
                    value={newCustomer.address?.pincode || ""}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        address: {
                          ...(newCustomer.address || {}),
                          pincode: e.target.value,
                        },
                      })
                    }
                    placeholder="Pincode"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Notes</label>
                <Input
                  value={newCustomer.notes || ""}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, notes: e.target.value })
                  }
                  placeholder="Additional notes about the customer"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAddCustomer(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddCustomer}>Add Customer</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
