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
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  Download,
  Search,
  Settings,
  BarChart3,
  Calendar,
  Phone,
  Mail,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Shipment {
  id: string;
  orderId: string;
  awbNumber: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  courierPartner: string;
  status:
    | "pending"
    | "picked_up"
    | "in_transit"
    | "out_for_delivery"
    | "delivered"
    | "returned"
    | "cancelled";
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  shippingCost: number;
  codAmount?: number;
  createdAt: string;
  pickupDate?: string;
  deliveryDate?: string;
  expectedDelivery?: string;
  trackingEvents: Array<{
    status: string;
    location: string;
    timestamp: string;
    description: string;
  }>;
  notes?: string;
}

const mockShipments: Shipment[] = [
  {
    id: "1",
    orderId: "ATK-2024-001",
    awbNumber: "AWB123456789",
    customerName: "Ramesh Kumar",
    customerPhone: "+91 98765 43210",
    shippingAddress: {
      street: "123 Main Street, Jubilee Hills",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500033",
    },
    courierPartner: "Delhivery",
    status: "delivered",
    weight: 0.8,
    dimensions: { length: 22, width: 14, height: 4 },
    shippingCost: 50,
    createdAt: "2024-12-01T10:30:00Z",
    pickupDate: "2024-12-01T15:00:00Z",
    deliveryDate: "2024-12-05T11:30:00Z",
    expectedDelivery: "2024-12-05T23:59:59Z",
    trackingEvents: [
      {
        status: "Order Placed",
        location: "Hyderabad",
        timestamp: "2024-12-01T10:30:00Z",
        description: "Order confirmed and ready for pickup",
      },
      {
        status: "Picked Up",
        location: "Hyderabad Hub",
        timestamp: "2024-12-01T15:00:00Z",
        description: "Package picked up from seller",
      },
      {
        status: "In Transit",
        location: "Hyderabad Facility",
        timestamp: "2024-12-02T08:00:00Z",
        description: "Package in transit to destination",
      },
      {
        status: "Out for Delivery",
        location: "Jubilee Hills",
        timestamp: "2024-12-05T09:00:00Z",
        description: "Package out for delivery",
      },
      {
        status: "Delivered",
        location: "Jubilee Hills",
        timestamp: "2024-12-05T11:30:00Z",
        description: "Package delivered successfully",
      },
    ],
  },
  {
    id: "2",
    orderId: "ATK-2024-002",
    awbNumber: "AWB987654321",
    customerName: "Priya Sharma",
    customerPhone: "+91 87654 32109",
    shippingAddress: {
      street: "456 Park Road, Banjara Hills",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500034",
    },
    courierPartner: "Blue Dart",
    status: "out_for_delivery",
    weight: 0.4,
    dimensions: { length: 20, width: 13, height: 2 },
    shippingCost: 0,
    createdAt: "2024-12-03T14:20:00Z",
    pickupDate: "2024-12-03T18:00:00Z",
    expectedDelivery: "2024-12-10T23:59:59Z",
    trackingEvents: [
      {
        status: "Order Placed",
        location: "Hyderabad",
        timestamp: "2024-12-03T14:20:00Z",
        description: "Order confirmed and ready for pickup",
      },
      {
        status: "Picked Up",
        location: "Hyderabad Hub",
        timestamp: "2024-12-03T18:00:00Z",
        description: "Package picked up from seller",
      },
      {
        status: "In Transit",
        location: "Hyderabad Facility",
        timestamp: "2024-12-04T10:00:00Z",
        description: "Package in transit to destination",
      },
      {
        status: "Out for Delivery",
        location: "Banjara Hills",
        timestamp: "2024-12-10T08:00:00Z",
        description: "Package out for delivery",
      },
    ],
  },
  {
    id: "3",
    orderId: "ATK-2024-003",
    awbNumber: "AWB456789123",
    customerName: "Suresh Reddy",
    customerPhone: "+91 76543 21098",
    shippingAddress: {
      street: "789 Gandhi Road, Secunderabad",
      city: "Secunderabad",
      state: "Telangana",
      pincode: "500015",
    },
    courierPartner: "DTDC",
    status: "in_transit",
    weight: 1.2,
    dimensions: { length: 24, width: 16, height: 6 },
    shippingCost: 50,
    createdAt: "2024-12-08T16:45:00Z",
    pickupDate: "2024-12-09T10:00:00Z",
    expectedDelivery: "2024-12-12T23:59:59Z",
    trackingEvents: [
      {
        status: "Order Placed",
        location: "Hyderabad",
        timestamp: "2024-12-08T16:45:00Z",
        description: "Order confirmed and ready for pickup",
      },
      {
        status: "Picked Up",
        location: "Hyderabad Hub",
        timestamp: "2024-12-09T10:00:00Z",
        description: "Package picked up from seller",
      },
      {
        status: "In Transit",
        location: "Hyderabad Facility",
        timestamp: "2024-12-10T14:00:00Z",
        description: "Package in transit to destination",
      },
    ],
  },
  {
    id: "4",
    orderId: "ATK-2024-004",
    awbNumber: "AWB789123456",
    customerName: "Lakshmi Devi",
    customerPhone: "+91 65432 10987",
    shippingAddress: {
      street: "321 Temple Street, Kukatpally",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500072",
    },
    courierPartner: "Shiprocket",
    status: "pending",
    weight: 0.7,
    dimensions: { length: 21, width: 15, height: 3 },
    shippingCost: 50,
    codAmount: 820,
    createdAt: "2024-12-09T09:15:00Z",
    expectedDelivery: "2024-12-13T23:59:59Z",
    trackingEvents: [
      {
        status: "Order Placed",
        location: "Hyderabad",
        timestamp: "2024-12-09T09:15:00Z",
        description: "Order confirmed and ready for pickup",
      },
    ],
  },
  {
    id: "5",
    orderId: "ATK-2024-005",
    awbNumber: "AWB321654987",
    customerName: "Venkat Rao",
    customerPhone: "+91 54321 09876",
    shippingAddress: {
      street: "654 Market Road, Nizamabad",
      city: "Nizamabad",
      state: "Telangana",
      pincode: "503001",
    },
    courierPartner: "Delhivery",
    status: "returned",
    weight: 0.3,
    dimensions: { length: 19, width: 12, height: 1.5 },
    shippingCost: 0,
    createdAt: "2024-12-07T11:00:00Z",
    pickupDate: "2024-12-07T16:00:00Z",
    trackingEvents: [
      {
        status: "Order Placed",
        location: "Hyderabad",
        timestamp: "2024-12-07T11:00:00Z",
        description: "Order confirmed and ready for pickup",
      },
      {
        status: "Picked Up",
        location: "Hyderabad Hub",
        timestamp: "2024-12-07T16:00:00Z",
        description: "Package picked up from seller",
      },
      {
        status: "In Transit",
        location: "Nizamabad Hub",
        timestamp: "2024-12-08T12:00:00Z",
        description: "Package reached destination facility",
      },
      {
        status: "Delivery Attempted",
        location: "Nizamabad",
        timestamp: "2024-12-09T10:00:00Z",
        description: "Delivery attempted - customer not available",
      },
      {
        status: "Returned",
        location: "Nizamabad Hub",
        timestamp: "2024-12-10T14:00:00Z",
        description:
          "Package returned to origin due to customer unavailability",
      },
    ],
    notes: "Customer was not available for delivery",
  },
];

export default function ShippingManager() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPartner, setFilterPartner] = useState("all");
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
    null,
  );
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();

  // Load shipments on component mount
  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getOrders(); // Get orders with shipping info
      if (response.success && response.data) {
        // Transform orders to shipments format
        const shipmentsData = response.data
          .filter((order: any) => order.delivery?.trackingNumber)
          .map((order: any) => ({
            id: order.id,
            orderId: order.orderNumber,
            awbNumber: order.delivery.trackingNumber,
            customerName: order.shippingAddress?.fullName || 'Unknown',
            customerPhone: order.shippingAddress?.phone || '',
            shippingAddress: {
              street: order.shippingAddress?.street || '',
              city: order.shippingAddress?.city || '',
              state: order.shippingAddress?.state || '',
              pincode: order.shippingAddress?.pincode || '',
            },
            courierPartner: order.delivery.courierPartner || 'Shiprocket',
            status: order.delivery.status || 'pending',
            weight: order.delivery.weight || 0.5,
            dimensions: order.delivery.dimensions || { length: 20, width: 15, height: 3 },
            shippingCost: order.delivery.shippingCost || 0,
            codAmount: order.payment?.method === 'cod' ? order.totalAmount : undefined,
            createdAt: order.createdAt,
            pickupDate: order.delivery.pickupDate,
            deliveryDate: order.delivery.deliveryDate,
            expectedDelivery: order.delivery.estimatedDelivery,
            trackingEvents: order.delivery.trackingEvents || [],
            notes: order.delivery.notes,
          }));
        setShipments(shipmentsData);
      } else {
        // Fallback to mock data
        setShipments(mockShipments);
        toast({
          title: "Warning",
          description: "Using sample data. Connect to backend for real shipping data.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Failed to load shipments:', error);
      setShipments(mockShipments);
      toast({
        title: "Backend Connection Failed",
        description: "Using sample data. Please check backend server.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const [settings, setSettings] = useState({
    defaultCourier: "Delhivery",
    freeShippingThreshold: 500,
    codCharges: 50,
    shiprocketApiKey: "",
    delhiveryApiKey: "",
    autoSync: true,
    enableTracking: true,
  });

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.awbNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customerPhone.includes(searchTerm);
    const matchesStatus =
      filterStatus === "all" || shipment.status === filterStatus;
    const matchesPartner =
      filterPartner === "all" || shipment.courierPartner === filterPartner;
    return matchesSearch && matchesStatus && matchesPartner;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "picked_up":
        return "bg-blue-100 text-blue-800";
      case "in_transit":
        return "bg-purple-100 text-purple-800";
      case "out_for_delivery":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "returned":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const exportShipments = () => {
    const dataStr = JSON.stringify(filteredShipments, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "shipments-export.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const syncWithShiprocket = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update shipment statuses randomly for demo
      const updatedShipments = shipments.map((shipment) => {
        if (shipment.status === "pending") {
          return {
            ...shipment,
            status: "picked_up" as const,
            pickupDate: new Date().toISOString(),
          };
        }
        return shipment;
      });

      setShipments(updatedShipments);
      alert("Sync completed successfully!");
    } catch (error) {
      alert("Sync failed. Please try again.");
    }
  };

  const saveSettings = () => {
    // In production, this would save to backend
    alert("Settings saved successfully!");
    setShowSettings(false);
  };

  const totalShipments = shipments.length;
  const pendingShipments = shipments.filter(
    (s) => s.status === "pending",
  ).length;
  const inTransitShipments = shipments.filter(
    (s) => s.status === "in_transit" || s.status === "picked_up",
  ).length;
  const deliveredShipments = shipments.filter(
    (s) => s.status === "delivered",
  ).length;
  const totalShippingCost = shipments.reduce(
    (sum, s) => sum + s.shippingCost,
    0,
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                Shipping Management
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Manage shipping partners and delivery with Shiprocket
                integration
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={exportShipments}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={syncWithShiprocket}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync Shiprocket
              </Button>
              <Button size="sm" onClick={() => setShowSettings(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold">{totalShipments}</p>
                <p className="text-sm text-gray-600">Total Shipments</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold">{pendingShipments}</p>
                <p className="text-sm text-gray-600">Pending Pickup</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Truck className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold">{inTransitShipments}</p>
                <p className="text-sm text-gray-600">In Transit</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold">{deliveredShipments}</p>
                <p className="text-sm text-gray-600">Delivered</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-2xl font-bold">₹{totalShippingCost}</p>
                <p className="text-sm text-gray-600">Shipping Cost</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by order ID, AWB, customer..."
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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="picked_up">Picked Up</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="out_for_delivery">
                  Out for Delivery
                </SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPartner} onValueChange={setFilterPartner}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Courier partner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Partners</SelectItem>
                <SelectItem value="Delhivery">Delhivery</SelectItem>
                <SelectItem value="Blue Dart">Blue Dart</SelectItem>
                <SelectItem value="DTDC">DTDC</SelectItem>
                <SelectItem value="Shiprocket">Shiprocket</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Shipments Table */}
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50/50">
                    <th className="text-left p-4 font-medium">Order/AWB</th>
                    <th className="text-left p-4 font-medium">Customer</th>
                    <th className="text-left p-4 font-medium">Destination</th>
                    <th className="text-left p-4 font-medium">Courier</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Weight</th>
                    <th className="text-left p-4 font-medium">Cost</th>
                    <th className="text-left p-4 font-medium">Expected</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShipments.map((shipment) => (
                    <tr
                      key={shipment.id}
                      className="border-b hover:bg-gray-50/50"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{shipment.orderId}</p>
                          <p className="text-sm text-gray-600 font-mono">
                            {shipment.awbNumber}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{shipment.customerName}</p>
                          <p className="text-sm text-gray-600">
                            {shipment.customerPhone}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="font-medium">
                            {shipment.shippingAddress.city}
                          </p>
                          <p className="text-gray-600">
                            {shipment.shippingAddress.state}
                          </p>
                          <p className="text-gray-500">
                            {shipment.shippingAddress.pincode}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-medium">
                          {shipment.courierPartner}
                        </p>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(shipment.status)}>
                          {shipment.status
                            .replace("_", " ")
                            .charAt(0)
                            .toUpperCase() +
                            shipment.status.replace("_", " ").slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <p className="text-sm">{shipment.weight} kg</p>
                        <p className="text-xs text-gray-500">
                          {shipment.dimensions.length}×
                          {shipment.dimensions.width}×
                          {shipment.dimensions.height}
                        </p>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">
                            ₹{shipment.shippingCost}
                          </p>
                          {shipment.codAmount && (
                            <p className="text-xs text-green-600">
                              COD: ₹{shipment.codAmount}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm">
                          {shipment.expectedDelivery
                            ? new Date(
                                shipment.expectedDelivery,
                              ).toLocaleDateString()
                            : "TBD"}
                        </p>
                        {shipment.deliveryDate && (
                          <p className="text-xs text-green-600">
                            Delivered:{" "}
                            {new Date(
                              shipment.deliveryDate,
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedShipment(shipment)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600"
                          >
                            Track
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredShipments.length === 0 && (
            <div className="text-center py-12">
              <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No shipments found
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== "all" || filterPartner !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Shipment data will appear here when orders are placed"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shipment Details Dialog */}
      {selectedShipment && (
        <Dialog
          open={!!selectedShipment}
          onOpenChange={() => setSelectedShipment(null)}
        >
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Shipment Details - {selectedShipment.awbNumber}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Shipment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Order ID:</span>
                    <span className="font-medium">
                      {selectedShipment.orderId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>AWB Number:</span>
                    <span className="font-mono text-sm">
                      {selectedShipment.awbNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Courier Partner:</span>
                    <span className="font-medium">
                      {selectedShipment.courierPartner}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weight:</span>
                    <span>{selectedShipment.weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimensions:</span>
                    <span>
                      {selectedShipment.dimensions.length}×
                      {selectedShipment.dimensions.width}×
                      {selectedShipment.dimensions.height} cm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Cost:</span>
                    <span className="font-semibold">
                      ₹{selectedShipment.shippingCost}
                    </span>
                  </div>
                  {selectedShipment.codAmount && (
                    <div className="flex justify-between">
                      <span>COD Amount:</span>
                      <span className="font-semibold text-green-600">
                        ₹{selectedShipment.codAmount}
                      </span>
                    </div>
                  )}
                  <div className="pt-2">
                    <Badge className={getStatusColor(selectedShipment.status)}>
                      {selectedShipment.status
                        .replace("_", " ")
                        .charAt(0)
                        .toUpperCase() +
                        selectedShipment.status.replace("_", " ").slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Customer & Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Delivery Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center">
                    <span className="font-medium">
                      {selectedShipment.customerName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{selectedShipment.customerPhone}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500 mt-1" />
                    <div>
                      <p>{selectedShipment.shippingAddress.street}</p>
                      <p>
                        {selectedShipment.shippingAddress.city},{" "}
                        {selectedShipment.shippingAddress.state}
                      </p>
                      <p>{selectedShipment.shippingAddress.pincode}</p>
                    </div>
                  </div>

                  {selectedShipment.expectedDelivery && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">
                          Expected Delivery
                        </p>
                        <p className="font-medium">
                          {new Date(
                            selectedShipment.expectedDelivery,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedShipment.deliveryDate && (
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600">Delivered On</p>
                        <p className="font-medium text-green-600">
                          {new Date(
                            selectedShipment.deliveryDate,
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tracking Events */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Tracking History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedShipment.trackingEvents.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 relative"
                      >
                        {index < selectedShipment.trackingEvents.length - 1 && (
                          <div className="absolute left-2 top-8 w-0.5 h-12 bg-gray-200"></div>
                        )}
                        <div
                          className={`w-4 h-4 rounded-full mt-1 ${
                            event.status === "Delivered"
                              ? "bg-green-500"
                              : event.status === "Returned"
                                ? "bg-red-500"
                                : "bg-blue-500"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{event.status}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(event.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600">
                            {event.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {event.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedShipment.notes && (
                    <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-800 mb-2">
                        Notes
                      </h4>
                      <p className="text-yellow-700">
                        {selectedShipment.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Update Tracking
              </Button>
              <Button variant="outline">
                <Phone className="w-4 h-4 mr-2" />
                Contact Customer
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Print Label
              </Button>
              <Button>
                <Eye className="w-4 h-4 mr-2" />
                Track on Website
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Shipping Settings Dialog */}
      {showSettings && (
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Shipping Settings</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">
                    Default Courier Partner
                  </label>
                  <Select
                    value={settings.defaultCourier}
                    onValueChange={(value) =>
                      setSettings({ ...settings, defaultCourier: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Delhivery">Delhivery</SelectItem>
                      <SelectItem value="Blue Dart">Blue Dart</SelectItem>
                      <SelectItem value="DTDC">DTDC</SelectItem>
                      <SelectItem value="Shiprocket">Shiprocket</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Free Shipping Threshold (₹)
                  </label>
                  <Input
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        freeShippingThreshold: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">COD Charges (₹)</label>
                  <Input
                    type="number"
                    value={settings.codCharges}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        codCharges: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoSync"
                    checked={settings.autoSync}
                    onChange={(e) =>
                      setSettings({ ...settings, autoSync: e.target.checked })
                    }
                  />
                  <label htmlFor="autoSync" className="text-sm font-medium">
                    Auto Sync with Partners
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enableTracking"
                    checked={settings.enableTracking}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        enableTracking: e.target.checked,
                      })
                    }
                  />
                  <label
                    htmlFor="enableTracking"
                    className="text-sm font-medium"
                  >
                    Enable Real-time Tracking
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Shiprocket API Key
                </label>
                <Input
                  type="password"
                  value={settings.shiprocketApiKey}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      shiprocketApiKey: e.target.value,
                    })
                  }
                  placeholder="Enter Shiprocket API key"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Delhivery API Key</label>
                <Input
                  type="password"
                  value={settings.delhiveryApiKey}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      delhiveryApiKey: e.target.value,
                    })
                  }
                  placeholder="Enter Delhivery API key"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowSettings(false)}>
                Cancel
              </Button>
              <Button onClick={saveSettings}>Save Settings</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
