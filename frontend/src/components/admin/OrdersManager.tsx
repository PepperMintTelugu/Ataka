import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ShoppingCart,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  Filter,
  Search,
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  Calendar
} from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  items: Array<{
    title: string;
    author: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  orderDate: string;
  deliveryDate?: string;
  trackingNumber?: string;
  notes?: string;
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ATK-2024-001",
    customerName: "Ramesh Kumar",
    customerEmail: "ramesh@email.com",
    customerPhone: "+91 98765 43210",
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "Razorpay",
    items: [
      { title: "Veyipadagalu", author: "Viswanatha Satyanarayana", quantity: 1, price: 450 },
      { title: "Mahaprasthanam", author: "Sri Sri", quantity: 2, price: 275 }
    ],
    subtotal: 1000,
    shipping: 50,
    tax: 100,
    total: 1150,
    shippingAddress: {
      street: "123 Main Street, Jubilee Hills",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500033"
    },
    orderDate: "2024-12-01",
    deliveryDate: "2024-12-05",
    trackingNumber: "AWB123456789",
    notes: "Delivered successfully"
  },
  {
    id: "2",
    orderNumber: "ATK-2024-002",
    customerName: "Priya Sharma",
    customerEmail: "priya@email.com",
    customerPhone: "+91 87654 32109",
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "Razorpay",
    items: [
      { title: "Kanyasulkam", author: "Kandukuri Veeresalingam", quantity: 1, price: 350 }
    ],
    subtotal: 350,
    shipping: 0,
    tax: 35,
    total: 385,
    shippingAddress: {
      street: "456 Park Road, Banjara Hills",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500034"
    },
    orderDate: "2024-12-03",
    trackingNumber: "AWB987654321"
  },
  {
    id: "3",
    orderNumber: "ATK-2024-003",
    customerName: "Suresh Reddy",
    customerEmail: "suresh@email.com",
    customerPhone: "+91 76543 21098",
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "Razorpay",
    items: [
      { title: "Ramayana Kalpavruksham", author: "Viswanatha Satyanarayana", quantity: 1, price: 650 },
      { title: "Barrister Parvateesam", author: "Mokkapati Narasimha Sastry", quantity: 1, price: 325 }
    ],
    subtotal: 975,
    shipping: 50,
    tax: 98,
    total: 1123,
    shippingAddress: {
      street: "789 Gandhi Road, Secunderabad",
      city: "Secunderabad",
      state: "Telangana",
      pincode: "500015"
    },
    orderDate: "2024-12-08"
  },
  {
    id: "4",
    orderNumber: "ATK-2024-004",
    customerName: "Lakshmi Devi",
    customerEmail: "lakshmi@email.com",
    customerPhone: "+91 65432 10987",
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "COD",
    items: [
      { title: "Telugu Vyakaranam", author: "C.P. Brown", quantity: 2, price: 350 }
    ],
    subtotal: 700,
    shipping: 50,
    tax: 70,
    total: 820,
    shippingAddress: {
      street: "321 Temple Street, Kukatpally",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500072"
    },
    orderDate: "2024-12-09"
  },
  {
    id: "5",
    orderNumber: "ATK-2024-005",
    customerName: "Venkat Rao",
    customerEmail: "venkat@email.com",
    customerPhone: "+91 54321 09876",
    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "Razorpay",
    items: [
      { title: "Mahaprasthanam", author: "Sri Sri", quantity: 1, price: 275 }
    ],
    subtotal: 275,
    shipping: 0,
    tax: 28,
    total: 303,
    shippingAddress: {
      street: "654 Market Road, Nizamabad",
      city: "Nizamabad",
      state: "Telangana",
      pincode: "503001"
    },
    orderDate: "2024-12-07",
    notes: "Cancelled by customer"
  }
];

export default function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus as any } : order
    ));
  };

  const exportOrders = () => {
    const dataStr = JSON.stringify(filteredOrders, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'orders-export.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (order.paymentStatus === 'paid' ? order.total : 0), 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const processingOrders = orders.filter(order => order.status === 'processing').length;
  const shippedOrders = orders.filter(order => order.status === 'shipped').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Orders Management
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Manage customer orders and track shipments
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={exportOrders}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync ShipRocket
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
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold">{orders.length}</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold">{pendingOrders + processingOrders}</p>
                <p className="text-sm text-gray-600">Pending/Processing</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Truck className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-2xl font-bold">{shippedOrders}</p>
                <p className="text-sm text-gray-600">Shipped</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search orders, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders Table */}
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50/50">
                    <th className="text-left p-4 font-medium">Order</th>
                    <th className="text-left p-4 font-medium">Customer</th>
                    <th className="text-left p-4 font-medium">Items</th>
                    <th className="text-left p-4 font-medium">Total</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Payment</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50/50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{order.orderNumber}</p>
                          {order.trackingNumber && (
                            <p className="text-xs text-gray-500">AWB: {order.trackingNumber}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-gray-600">{order.customerEmail}</p>
                          <p className="text-xs text-gray-500">{order.customerPhone}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {order.items.map((item, index) => (
                            <div key={index} className="mb-1">
                              <span className="font-medium">{item.title}</span>
                              <span className="text-gray-500"> x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold">₹{order.total}</p>
                        <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <p className="text-sm">{new Date(order.orderDate).toLocaleDateString()}</p>
                        {order.deliveryDate && (
                          <p className="text-xs text-gray-500">Delivered: {new Date(order.deliveryDate).toLocaleDateString()}</p>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-32 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Orders will appear here when customers make purchases"
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder.orderNumber}</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{selectedOrder.customerEmail}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{selectedOrder.customerPhone}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500 mt-1" />
                    <div>
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                      <p>{selectedOrder.shippingAddress.pincode}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>₹{selectedOrder.shipping}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>₹{selectedOrder.tax}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>₹{selectedOrder.total}</span>
                  </div>
                  <div className="pt-2">
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </Badge>
                    <Badge className={`ml-2 ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                      {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-600">by {item.author}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{item.price} x {item.quantity}</p>
                          <p className="text-sm text-gray-600">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tracking Information */}
              {selectedOrder.trackingNumber && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Tracking Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">AWB Number: {selectedOrder.trackingNumber}</p>
                        <p className="text-sm text-gray-600">Order Date: {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                        {selectedOrder.deliveryDate && (
                          <p className="text-sm text-gray-600">Delivery Date: {new Date(selectedOrder.deliveryDate).toLocaleDateString()}</p>
                        )}
                      </div>
                      <Button variant="outline">
                        <Truck className="w-4 h-4 mr-2" />
                        Track Package
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
