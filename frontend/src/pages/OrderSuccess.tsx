import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Download,
  Share2,
  Home,
  Clock,
  Gift,
} from "lucide-react";

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  paymentId: string;
  amount: number;
  items: Array<{
    id: string;
    title: string;
    author: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    email: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  deliveryEstimate: {
    minDays: number;
    maxDays: number;
    estimatedDate: string;
  };
  createdAt: string;
}

export default function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings } = useTheme();

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      navigate("/");
      return;
    }

    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setOrder(data.data.order);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error("Failed to fetch order details:", error);
      toast({
        title: "Error",
        description: "Failed to load order details. Please try again.",
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadInvoice = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}/invoice`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice-${order?.orderNumber}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareOrder = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Order Confirmation - ${order?.orderNumber}`,
          text: `I just ordered ${order?.items.length} book${order?.items.length !== 1 ? "s" : ""} from ${settings.brand.name}!`,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying link
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Order link copied to clipboard!",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The order you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Button asChild>
            <Link to="/">Back to Homepage</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            style={{ backgroundColor: settings.theme.primary }}
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed! 🎉
          </h1>
          <p className="text-gray-600 mb-4">
            Thank you for your order. We've received your payment and will start
            processing your books right away.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              Order #{order.orderNumber}
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              Payment ID: {order.paymentId}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Your Books ({order.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          by {item.author}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          ₹{item.price} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center text-blue-600 mb-2">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="font-medium">Estimated Delivery</span>
                    </div>
                    <p className="text-blue-800 font-semibold">
                      {order.deliveryEstimate.minDays}-
                      {order.deliveryEstimate.maxDays} business days
                    </p>
                    <p className="text-sm text-blue-600">
                      Expected by{" "}
                      {new Date(
                        order.deliveryEstimate.estimatedDate,
                      ).toLocaleDateString("en-IN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center text-green-600 mb-2">
                      <Gift className="w-4 h-4 mr-2" />
                      <span className="font-medium">Free Delivery</span>
                    </div>
                    <p className="text-green-800 font-semibold">
                      No shipping charges
                    </p>
                    <p className="text-sm text-green-600">
                      Order above ₹500 qualifies for free delivery
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Delivery Address
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium text-gray-900">
                      {order.shippingAddress.fullName}
                    </p>
                    <p>{order.shippingAddress.street}</p>
                    {order.shippingAddress.landmark && (
                      <p>Near {order.shippingAddress.landmark}</p>
                    )}
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state} -{" "}
                      {order.shippingAddress.pincode}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 pt-2 border-t border-gray-200">
                      <div className="flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        <span>{order.shippingAddress.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        <span>{order.shippingAddress.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>
                    Items (
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)})
                  </span>
                  <span>
                    ₹
                    {order.items
                      .reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0,
                      )
                      .toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total Paid</span>
                  <span>₹{order.amount.toLocaleString()}</span>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Payment successful via Razorpay
                </div>
              </CardContent>
            </Card>

            {/* Order Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Order Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={downloadInvoice}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>

                <Button
                  onClick={shareOrder}
                  variant="outline"
                  className="w-full"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Order
                </Button>

                <Button asChild className="w-full">
                  <Link to={`/track-order/${order.id}`}>
                    <Package className="w-4 h-4 mr-2" />
                    Track Order
                  </Link>
                </Button>

                <Separator />

                <Button asChild variant="outline" className="w-full">
                  <Link to="/shop">Continue Shopping</Link>
                </Button>

                <Button asChild variant="outline" className="w-full">
                  <Link to="/">
                    <Home className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Order Confirmed</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Payment Received</p>
                      <p className="text-xs text-gray-500">
                        Payment processed successfully
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Processing
                      </p>
                      <p className="text-xs text-gray-500">
                        We're preparing your books
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Shipped
                      </p>
                      <p className="text-xs text-gray-500">On the way to you</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Delivered
                      </p>
                      <p className="text-xs text-gray-500">Enjoy your books!</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Thank You Message */}
        <Card className="mt-8 text-center">
          <CardContent className="py-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Thank You for Choosing {settings.brand.name}!
            </h2>
            <p className="text-gray-600 mb-4">
              We're excited to get these amazing Telugu books to you. Your
              support helps preserve and promote Telugu literature.
            </p>
            <p className="text-sm text-gray-500 telugu-text">
              {settings.brand.nameTelugu} కుటుంబంలో మిమ్మల్ని స్వాగతిస్తున్నాము!
              🙏
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
