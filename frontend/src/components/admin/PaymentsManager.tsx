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
  CreditCard,
  DollarSign,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Search,
  Calendar,
  Receipt,
  Banknote,
  Smartphone,
  Settings,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Payment {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: "pending" | "success" | "failed" | "refunded" | "partial_refund";
  paymentMethod: "razorpay" | "cod" | "bank_transfer" | "upi";
  gateway: string;
  transactionId?: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  createdAt: string;
  updatedAt: string;
  refundAmount?: number;
  refundReason?: string;
  failureReason?: string;
  fee: number;
  tax: number;
  netAmount: number;
}

const mockPayments: Payment[] = [
  {
    id: "1",
    orderId: "ATK-2024-001",
    customerName: "Ramesh Kumar",
    customerEmail: "ramesh@email.com",
    amount: 1150,
    status: "success",
    paymentMethod: "razorpay",
    gateway: "Razorpay",
    transactionId: "txn_abcd1234",
    razorpayPaymentId: "pay_abcd1234567890",
    razorpayOrderId: "order_xyz9876543210",
    razorpaySignature: "signature_hash_here",
    createdAt: "2024-12-01T10:30:00Z",
    updatedAt: "2024-12-01T10:35:00Z",
    fee: 23,
    tax: 4,
    netAmount: 1123,
  },
  {
    id: "2",
    orderId: "ATK-2024-002",
    customerName: "Priya Sharma",
    customerEmail: "priya@email.com",
    amount: 385,
    status: "success",
    paymentMethod: "upi",
    gateway: "Razorpay",
    transactionId: "txn_efgh5678",
    razorpayPaymentId: "pay_efgh5678901234",
    createdAt: "2024-12-03T14:20:00Z",
    updatedAt: "2024-12-03T14:22:00Z",
    fee: 8,
    tax: 1,
    netAmount: 376,
  },
  {
    id: "3",
    orderId: "ATK-2024-003",
    customerName: "Suresh Reddy",
    customerEmail: "suresh@email.com",
    amount: 1123,
    status: "pending",
    paymentMethod: "razorpay",
    gateway: "Razorpay",
    razorpayOrderId: "order_pending123",
    createdAt: "2024-12-08T16:45:00Z",
    updatedAt: "2024-12-08T16:45:00Z",
    fee: 22,
    tax: 4,
    netAmount: 1097,
  },
  {
    id: "4",
    orderId: "ATK-2024-004",
    customerName: "Lakshmi Devi",
    customerEmail: "lakshmi@email.com",
    amount: 820,
    status: "pending",
    paymentMethod: "cod",
    gateway: "Cash on Delivery",
    createdAt: "2024-12-09T09:15:00Z",
    updatedAt: "2024-12-09T09:15:00Z",
    fee: 0,
    tax: 0,
    netAmount: 820,
  },
  {
    id: "5",
    orderId: "ATK-2024-005",
    customerName: "Venkat Rao",
    customerEmail: "venkat@email.com",
    amount: 303,
    status: "refunded",
    paymentMethod: "razorpay",
    gateway: "Razorpay",
    transactionId: "txn_refund123",
    razorpayPaymentId: "pay_refund567890",
    createdAt: "2024-12-07T11:00:00Z",
    updatedAt: "2024-12-07T15:30:00Z",
    refundAmount: 303,
    refundReason: "Order cancelled by customer",
    fee: 6,
    tax: 1,
    netAmount: 296,
  },
  {
    id: "6",
    orderId: "ATK-2024-006",
    customerName: "Anjali Reddy",
    customerEmail: "anjali@email.com",
    amount: 1250,
    status: "failed",
    paymentMethod: "razorpay",
    gateway: "Razorpay",
    failureReason: "Insufficient balance",
    createdAt: "2024-12-06T13:30:00Z",
    updatedAt: "2024-12-06T13:31:00Z",
    fee: 0,
    tax: 0,
    netAmount: 0,
  },
];

export default function PaymentsManager() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();

  // Load payments on component mount
  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getOrders(); // Get orders which include payment info
      if (response.success && response.data) {
        // Transform orders to payments format
        const paymentsData = response.data
          .filter((order: any) => order.payment)
          .map((order: any) => ({
            id: order.payment.id || order.id,
            orderId: order.orderNumber,
            customerName: order.shippingAddress?.fullName || "Unknown",
            customerEmail: order.shippingAddress?.email || "unknown@email.com",
            amount: order.totalAmount,
            status: order.payment.status,
            paymentMethod: order.payment.method,
            gateway: order.payment.gateway || "Razorpay",
            transactionId: order.payment.transactionId,
            razorpayPaymentId: order.payment.razorpayPaymentId,
            razorpayOrderId: order.payment.razorpayOrderId,
            razorpaySignature: order.payment.razorpaySignature,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            fee: order.payment.fee || 0,
            tax: order.payment.tax || 0,
            netAmount: order.payment.netAmount || order.totalAmount,
            refundAmount: order.payment.refundAmount,
            refundReason: order.payment.refundReason,
            failureReason: order.payment.failureReason,
          }));
        setPayments(paymentsData);
      } else {
        // Fallback to mock data
        setPayments(mockPayments);
        toast({
          title: "Warning",
          description:
            "Using sample data. Connect to backend for real payment data.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Failed to load payments:", error);
      setPayments(mockPayments);
      toast({
        title: "Backend Connection Failed",
        description: "Using sample data. Please check backend server.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const [paymentSettings, setPaymentSettings] = useState({
    razorpayKeyId: "",
    razorpayKeySecret: "",
    enableCOD: true,
    codCharges: 50,
    defaultCurrency: "INR",
    autoRefundDays: 7,
    gatewayFeePercent: 2.0,
    enableUPI: true,
    enableCards: true,
    enableNetBanking: true,
    enableWallets: true,
    minimumOrderValue: 100,
    maxRefundAmount: 50000,
    taxRate: 18,
  });

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.transactionId &&
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      filterStatus === "all" || payment.status === filterStatus;
    const matchesMethod =
      filterMethod === "all" || payment.paymentMethod === filterMethod;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "success":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-orange-100 text-orange-800";
      case "partial_refund":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "razorpay":
        return <CreditCard className="w-4 h-4" />;
      case "upi":
        return <Smartphone className="w-4 h-4" />;
      case "cod":
        return <Banknote className="w-4 h-4" />;
      case "bank_transfer":
        return <Receipt className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const exportPayments = () => {
    const dataStr = JSON.stringify(filteredPayments, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "payments-export.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const processRefund = (paymentId: string, amount: number, reason: string) => {
    setPayments(
      payments.map((payment) =>
        payment.id === paymentId
          ? {
              ...payment,
              status: "refunded" as const,
              refundAmount: amount,
              refundReason: reason,
              updatedAt: new Date().toISOString(),
            }
          : payment,
      ),
    );
  };

  const syncWithRazorpay = async () => {
    setIsSyncing(true);
    try {
      // Simulate API call to Razorpay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update payment statuses randomly for demo
      const updatedPayments = payments.map((payment) => {
        if (payment.status === "pending" && Math.random() > 0.5) {
          return {
            ...payment,
            status: "success" as const,
            transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
            updatedAt: new Date().toISOString(),
          };
        }
        return payment;
      });

      setPayments(updatedPayments);
      alert("Sync completed! Payment statuses updated.");
    } catch (error) {
      alert("Sync failed. Please check your Razorpay API credentials.");
    } finally {
      setIsSyncing(false);
    }
  };

  const savePaymentSettings = () => {
    // In production, this would save to backend
    alert("Payment settings saved successfully!");
    setShowSettings(false);
  };

  const totalRevenue = payments
    .filter((p) => p.status === "success")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = payments.filter((p) => p.status === "pending").length;
  const successfulPayments = payments.filter(
    (p) => p.status === "success",
  ).length;
  const failedPayments = payments.filter((p) => p.status === "failed").length;
  const totalFees = payments
    .filter((p) => p.status === "success")
    .reduce((sum, p) => sum + p.fee, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Management
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Manage payments, refunds, and billing with Razorpay integration
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={exportPayments}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={syncWithRazorpay}
                disabled={isSyncing}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${isSyncing ? "animate-spin" : ""}`}
                />
                {isSyncing ? "Syncing..." : "Sync Razorpay"}
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
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold">
                  ₹{totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold">{successfulPayments}</p>
                <p className="text-sm text-gray-600">Successful</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <RefreshCw className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold">{pendingPayments}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <p className="text-2xl font-bold">{failedPayments}</p>
                <p className="text-sm text-gray-600">Failed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold">
                  ��{totalFees.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Gateway Fees</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by order ID, customer, transaction..."
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
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterMethod} onValueChange={setFilterMethod}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="razorpay">Razorpay</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="cod">Cash on Delivery</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payments Table */}
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50/50">
                    <th className="text-left p-4 font-medium">Order ID</th>
                    <th className="text-left p-4 font-medium">Customer</th>
                    <th className="text-left p-4 font-medium">Amount</th>
                    <th className="text-left p-4 font-medium">Method</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">
                      Transaction ID
                    </th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b hover:bg-gray-50/50"
                    >
                      <td className="p-4">
                        <p className="font-medium">{payment.orderId}</p>
                        {payment.razorpayOrderId && (
                          <p className="text-xs text-gray-500">
                            {payment.razorpayOrderId}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{payment.customerName}</p>
                          <p className="text-sm text-gray-600">
                            {payment.customerEmail}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-semibold">₹{payment.amount}</p>
                          {payment.fee > 0 && (
                            <p className="text-xs text-gray-500">
                              Fee: ₹{payment.fee}
                            </p>
                          )}
                          {payment.refundAmount && (
                            <p className="text-xs text-red-600">
                              Refund: ₹{payment.refundAmount}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {getPaymentMethodIcon(payment.paymentMethod)}
                          <div>
                            <p className="text-sm font-medium capitalize">
                              {payment.paymentMethod.replace("_", " ")}
                            </p>
                            <p className="text-xs text-gray-500">
                              {payment.gateway}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status
                            .replace("_", " ")
                            .charAt(0)
                            .toUpperCase() +
                            payment.status.replace("_", " ").slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {payment.transactionId ? (
                            <p className="font-mono">{payment.transactionId}</p>
                          ) : (
                            <p className="text-gray-400">N/A</p>
                          )}
                          {payment.razorpayPaymentId && (
                            <p className="text-xs text-gray-500 font-mono">
                              {payment.razorpayPaymentId}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(payment.createdAt).toLocaleTimeString()}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPayment(payment)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {payment.status === "success" &&
                            !payment.refundAmount && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-orange-600 hover:text-orange-700"
                                onClick={() =>
                                  processRefund(
                                    payment.id,
                                    payment.amount,
                                    "Admin refund",
                                  )
                                }
                              >
                                Refund
                              </Button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No payments found
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== "all" || filterMethod !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Payment transactions will appear here"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Details Dialog */}
      {selectedPayment && (
        <Dialog
          open={!!selectedPayment}
          onOpenChange={() => setSelectedPayment(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Payment Details - {selectedPayment.orderId}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Order ID:</span>
                    <span className="font-medium">
                      {selectedPayment.orderId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-semibold">
                      ₹{selectedPayment.amount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gateway Fee:</span>
                    <span>₹{selectedPayment.fee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>₹{selectedPayment.tax}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Net Amount:</span>
                    <span>₹{selectedPayment.netAmount}</span>
                  </div>
                  <div className="pt-2">
                    <Badge className={getStatusColor(selectedPayment.status)}>
                      {selectedPayment.status
                        .replace("_", " ")
                        .charAt(0)
                        .toUpperCase() +
                        selectedPayment.status.replace("_", " ").slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span className="font-medium">
                      {selectedPayment.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span>{selectedPayment.customerEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <div className="flex items-center space-x-2">
                      {getPaymentMethodIcon(selectedPayment.paymentMethod)}
                      <span className="capitalize">
                        {selectedPayment.paymentMethod.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Gateway:</span>
                    <span>{selectedPayment.gateway}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction Details */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Transaction Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedPayment.transactionId && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Transaction ID
                        </p>
                        <p className="font-mono text-sm bg-gray-50 p-2 rounded">
                          {selectedPayment.transactionId}
                        </p>
                      </div>
                    )}
                    {selectedPayment.razorpayPaymentId && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Razorpay Payment ID
                        </p>
                        <p className="font-mono text-sm bg-gray-50 p-2 rounded">
                          {selectedPayment.razorpayPaymentId}
                        </p>
                      </div>
                    )}
                    {selectedPayment.razorpayOrderId && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Razorpay Order ID
                        </p>
                        <p className="font-mono text-sm bg-gray-50 p-2 rounded">
                          {selectedPayment.razorpayOrderId}
                        </p>
                      </div>
                    )}
                    {selectedPayment.razorpaySignature && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Signature</p>
                        <p className="font-mono text-xs bg-gray-50 p-2 rounded break-all">
                          {selectedPayment.razorpaySignature}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Created At</p>
                      <p className="text-sm">
                        {new Date(selectedPayment.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Updated At</p>
                      <p className="text-sm">
                        {new Date(selectedPayment.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {selectedPayment.refundAmount && (
                    <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-medium text-orange-800 mb-2">
                        Refund Information
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-orange-700">
                            Refund Amount:
                          </span>
                          <span className="font-semibold text-orange-800">
                            ₹{selectedPayment.refundAmount}
                          </span>
                        </div>
                        {selectedPayment.refundReason && (
                          <div>
                            <span className="text-orange-700">Reason:</span>
                            <p className="text-orange-800 mt-1">
                              {selectedPayment.refundReason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedPayment.failureReason && (
                    <div className="mt-4 p-4 bg-red-50 rounded-lg">
                      <h4 className="font-medium text-red-800 mb-2">
                        Failure Information
                      </h4>
                      <p className="text-red-700">
                        {selectedPayment.failureReason}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline">
                <Receipt className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
              {selectedPayment.status === "success" &&
                !selectedPayment.refundAmount && (
                  <Button variant="outline" className="text-orange-600">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Process Refund
                  </Button>
                )}
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                View in Razorpay
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Payment Settings Dialog */}
      {showSettings && (
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Payment Settings</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Razorpay Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Razorpay Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        Razorpay Key ID
                      </label>
                      <Input
                        type="password"
                        value={paymentSettings.razorpayKeyId}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            razorpayKeyId: e.target.value,
                          })
                        }
                        placeholder="rzp_live_xxxxxxxxxx or rzp_test_xxxxxxxxxx"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Razorpay Key Secret
                      </label>
                      <Input
                        type="password"
                        value={paymentSettings.razorpayKeySecret}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            razorpayKeySecret: e.target.value,
                          })
                        }
                        placeholder="Enter Razorpay secret key"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="enableCards"
                        checked={paymentSettings.enableCards}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            enableCards: e.target.checked,
                          })
                        }
                      />
                      <label
                        htmlFor="enableCards"
                        className="text-sm font-medium"
                      >
                        Credit/Debit Cards
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="enableUPI"
                        checked={paymentSettings.enableUPI}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            enableUPI: e.target.checked,
                          })
                        }
                      />
                      <label
                        htmlFor="enableUPI"
                        className="text-sm font-medium"
                      >
                        UPI
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="enableNetBanking"
                        checked={paymentSettings.enableNetBanking}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            enableNetBanking: e.target.checked,
                          })
                        }
                      />
                      <label
                        htmlFor="enableNetBanking"
                        className="text-sm font-medium"
                      >
                        Net Banking
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="enableWallets"
                        checked={paymentSettings.enableWallets}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            enableWallets: e.target.checked,
                          })
                        }
                      />
                      <label
                        htmlFor="enableWallets"
                        className="text-sm font-medium"
                      >
                        Wallets
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* COD & Order Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    COD & Order Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="enableCOD"
                        checked={paymentSettings.enableCOD}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            enableCOD: e.target.checked,
                          })
                        }
                      />
                      <label
                        htmlFor="enableCOD"
                        className="text-sm font-medium"
                      >
                        Enable Cash on Delivery
                      </label>
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        COD Charges (₹)
                      </label>
                      <Input
                        type="number"
                        value={paymentSettings.codCharges}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            codCharges: Number(e.target.value),
                          })
                        }
                        disabled={!paymentSettings.enableCOD}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Minimum Order Value (₹)
                      </label>
                      <Input
                        type="number"
                        value={paymentSettings.minimumOrderValue}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            minimumOrderValue: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Financial Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        Default Currency
                      </label>
                      <Select
                        value={paymentSettings.defaultCurrency}
                        onValueChange={(value) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            defaultCurrency: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">INR (₹)</SelectItem>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Gateway Fee (%)
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        value={paymentSettings.gatewayFeePercent}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            gatewayFeePercent: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Tax Rate (%)
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        value={paymentSettings.taxRate}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            taxRate: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Max Refund Amount (₹)
                      </label>
                      <Input
                        type="number"
                        value={paymentSettings.maxRefundAmount}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            maxRefundAmount: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Refund Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Refund Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        Auto Refund Period (Days)
                      </label>
                      <Input
                        type="number"
                        value={paymentSettings.autoRefundDays}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            autoRefundDays: Number(e.target.value),
                          })
                        }
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Orders will be auto-refunded after this period if not
                        shipped
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowSettings(false)}>
                Cancel
              </Button>
              <Button onClick={savePaymentSettings}>Save Settings</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
