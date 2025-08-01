import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/components/ui/sonner';
import { format } from 'date-fns';
import { FileText, Package } from 'lucide-react';
import OrderPaymentStatus from './OrderPaymentStatus';

// Order type definition
interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
  items: OrderItem[];
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod?: string;
  notes?: string;
}

// Mock order data - in a real app, this would come from an API
const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    customer: 'Rahul Sharma',
    email: 'rahul@example.com',
    date: '2025-04-15',
    total: 1250,
    status: 'Delivered',
    items: [
      { id: 'book-1', title: 'Telugu Stories for Kids', quantity: 2, price: 350 },
      { id: 'book-3', title: 'History of Telugu Literature', quantity: 1, price: 550 }
    ],
    shippingAddress: {
      street: '123 Main St',
      city: 'Hyderabad',
      state: 'Telangana',
      zipCode: '500001',
      country: 'India'
    },
    paymentMethod: 'Cash on Delivery'
  },
  {
    id: 'ORD-002',
    customer: 'Priya Patel',
    email: 'priya@example.com',
    date: '2025-04-17',
    total: 980,
    status: 'Processing',
    items: [
      { id: 'book-5', title: 'Modern Telugu Poetry', quantity: 1, price: 580 },
      { id: 'book-7', title: 'Telugu Folk Tales', quantity: 1, price: 400 }
    ],
    shippingAddress: {
      street: '456 Park Ave',
      city: 'Visakhapatnam',
      state: 'Andhra Pradesh',
      zipCode: '530001',
      country: 'India'
    },
    paymentMethod: 'Credit Card'
  },
  {
    id: 'ORD-003',
    customer: 'Arjun Reddy',
    email: 'arjun@example.com',
    date: '2025-04-18',
    total: 1780,
    status: 'Shipped',
    items: [
      { id: 'book-4', title: 'Telugu Dictionary', quantity: 1, price: 850 },
      { id: 'book-12', title: 'Classical Telugu Drama', quantity: 1, price: 930 }
    ],
    shippingAddress: {
      street: '789 Hill Rd',
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      zipCode: '520001',
      country: 'India'
    },
    paymentMethod: 'UPI'
  },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem('adminOrders');
    return savedOrders ? JSON.parse(savedOrders) : MOCK_ORDERS;
  });
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Save orders to localStorage when they change
  React.useEffect(() => {
    localStorage.setItem('adminOrders', JSON.stringify(orders));
  }, [orders]);

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleUpdateNotes = (orderId: string, notes: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, notes } : order
    ));
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, notes });
    }
  };

  const handleGenerateInvoice = (order: Order) => {
    // In a real app, this would generate a PDF or redirect to an invoice page
    toast.success(`Invoice for order ${order.id} generated!`);
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <FileText className="mr-2 h-5 w-5" />
        <h2 className="text-2xl font-bold">Manage Orders</h2>
      </div>
      
      {!selectedOrder ? (
        <>
          {/* Filters and search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by order ID or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Order stats */}
          <div className="bg-muted p-4 rounded-md mb-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {orders.filter(order => order.status === 'Processing').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Shipped</p>
                <p className="text-2xl font-bold text-blue-500">
                  {orders.filter(order => order.status === 'Shipped').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold text-green-500">
                  {orders.filter(order => order.status === 'Delivered').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cancelled/Returned</p>
                <p className="text-2xl font-bold text-red-500">
                  {orders.filter(order => 
                    order.status === 'Cancelled' || order.status === 'Returned'
                  ).length}
                </p>
              </div>
            </div>
          </div>
          
          {/* Orders table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div>{order.customer}</div>
                      <div className="text-xs text-muted-foreground">{order.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(order.date)}</TableCell>
                  <TableCell>₹{order.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <OrderPaymentStatus orderId={order.id} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(order)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    <p>No orders match your filters.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </>
      ) : (
        // Order detail view
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <h3 className="text-xl font-bold">Order {selectedOrder.id}</h3>
              <span className={`ml-3 px-2 py-1 rounded-full text-xs ${
                selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                selectedOrder.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                selectedOrder.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {selectedOrder.status}
              </span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setSelectedOrder(null)}
            >
              Back to Orders
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Customer Information</h4>
                <div className="bg-muted p-3 rounded-md">
                  <p className="font-medium">{selectedOrder.customer}</p>
                  <p>{selectedOrder.email}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Order Details</h4>
                <div className="bg-muted p-3 rounded-md">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p>{formatDate(selectedOrder.date)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Payment Method</p>
                      <p>{selectedOrder.paymentMethod || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedOrder.shippingAddress && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Shipping Address</h4>
                  <div className="bg-muted p-3 rounded-md">
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Update Status</h4>
                <div className="flex gap-2">
                  <Select 
                    value={selectedOrder.status} 
                    onValueChange={(value: Order['status']) => handleUpdateStatus(selectedOrder.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="Returned">Returned</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => toast.success(`Email notification sent to customer about order ${selectedOrder.id}`)}>
                    Send Update
                  </Button>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Order Notes</h4>
                <div>
                  <textarea 
                    className="w-full min-h-[100px] p-3 border rounded-md"
                    placeholder="Add notes about this order..."
                    value={selectedOrder.notes || ''}
                    onChange={(e) => handleUpdateNotes(selectedOrder.id, e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Order Items</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedOrder.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>₹{item.price.toLocaleString()}</TableCell>
                    <TableCell>₹{(item.quantity * item.price).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">Total:</TableCell>
                  <TableCell className="font-bold">₹{selectedOrder.total.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-6 flex space-x-4">
            <Button onClick={() => handleGenerateInvoice(selectedOrder)}>
              <Package className="h-4 w-4 mr-2" /> Print Invoice
            </Button>
            <Button variant="outline">
              Update Shipping
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
