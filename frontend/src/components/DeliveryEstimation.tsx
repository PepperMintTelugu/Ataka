import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  MapPin,
  Clock,
  Package,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface DeliveryEstimationProps {
  bookPrice: number;
  bookWeight?: number; // in grams
  className?: string;
}

interface DeliveryInfo {
  estimatedDays: number;
  deliveryDate: string;
  shippingCost: number;
  isFreeShipping: boolean;
  courierName: string;
  isExpress: boolean;
}

export function DeliveryEstimation({
  bookPrice,
  bookWeight = 200,
  className = "",
}: DeliveryEstimationProps) {
  const [pincode, setPincode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState<string>("");

  // Get user's saved location on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");
    const savedPincode = localStorage.getItem("userPincode");

    if (savedLocation && savedPincode) {
      setUserLocation(savedLocation);
      setPincode(savedPincode);
      // Auto-calculate for saved location
      calculateDelivery(savedPincode);
    }
  }, []);

  const calculateDelivery = async (inputPincode: string) => {
    if (!inputPincode || inputPincode.length !== 6) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulate ShipRocket API call
      // In real implementation, this would call ShipRocket's serviceability API
      const deliveryData = await simulateShipRocketAPI(
        inputPincode,
        bookWeight,
      );

      setDeliveryInfo(deliveryData);

      // Save location for future use
      localStorage.setItem("userPincode", inputPincode);
      if (deliveryData) {
        localStorage.setItem("lastDeliveryCheck", new Date().toISOString());
      }
    } catch (err) {
      setError("Unable to fetch delivery information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Simulate ShipRocket API response based on pincode patterns
  const simulateShipRocketAPI = async (
    pincode: string,
    weight: number,
  ): Promise<DeliveryInfo> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const pincodeNum = parseInt(pincode);
    let estimatedDays = 7;
    let courierName = "India Post";
    let isExpress = false;

    // Metro cities (faster delivery)
    const metroPincodes = [
      110,
      400,
      560,
      500,
      600,
      700,
      411,
      380, // Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad
    ];

    // Check if it's a metro area
    const isMetro = metroPincodes.some((metro) =>
      pincode.startsWith(metro.toString()),
    );

    if (isMetro) {
      estimatedDays = Math.floor(Math.random() * 2) + 2; // 2-3 days
      courierName = "Delhivery Express";
      isExpress = true;
    } else if (pincodeNum >= 500000 && pincodeNum < 600000) {
      // Telangana/Andhra (faster for Telugu books)
      estimatedDays = Math.floor(Math.random() * 2) + 3; // 3-4 days
      courierName = "ShipRocket Standard";
    } else if (pincodeNum >= 400000 && pincodeNum < 800000) {
      // Other major states
      estimatedDays = Math.floor(Math.random() * 2) + 4; // 4-5 days
      courierName = "DTDC";
    } else {
      // Remote areas
      estimatedDays = Math.floor(Math.random() * 3) + 6; // 6-8 days
      courierName = "India Post";
    }

    // Calculate delivery date
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + estimatedDays);

    // Calculate shipping cost
    const isFreeShipping = bookPrice >= 299;
    const shippingCost = isFreeShipping ? 0 : 29;

    return {
      estimatedDays,
      deliveryDate: deliveryDate.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      shippingCost,
      isFreeShipping,
      courierName,
      isExpress,
    };
  };

  const handleCalculate = () => {
    calculateDelivery(pincode);
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPincode(value);
    setError("");
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-brand-600" />
            <h3 className="font-semibold text-lg">Delivery Information</h3>
          </div>

          {/* Pincode Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Enter your pincode to check delivery
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="e.g., 500001"
                  value={pincode}
                  onChange={handlePincodeChange}
                  className="pl-10"
                  maxLength={6}
                />
              </div>
              <Button
                onClick={handleCalculate}
                disabled={loading || pincode.length !== 6}
                className="px-6"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Check"
                )}
              </Button>
            </div>
            {error && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            )}
          </div>

          {/* Delivery Information */}
          {deliveryInfo && (
            <div className="space-y-3 pt-2 border-t">
              {/* Delivery Timeline */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Estimated Delivery:</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    {deliveryInfo.estimatedDays}{" "}
                    {deliveryInfo.estimatedDays === 1 ? "day" : "days"}
                  </p>
                  <p className="text-xs text-gray-600">
                    by {deliveryInfo.deliveryDate}
                  </p>
                </div>
              </div>

              {/* Courier Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Courier Partner:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {deliveryInfo.courierName}
                  </span>
                  {deliveryInfo.isExpress && (
                    <Badge variant="secondary" className="text-xs">
                      Express
                    </Badge>
                  )}
                </div>
              </div>

              {/* Shipping Cost */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Shipping Charges:</span>
                </div>
                <div className="text-right">
                  {deliveryInfo.isFreeShipping ? (
                    <div>
                      <span className="font-semibold text-green-600">FREE</span>
                      <p className="text-xs text-gray-600">Orders above ₹299</p>
                    </div>
                  ) : (
                    <div>
                      <span className="font-semibold">
                        ₹{deliveryInfo.shippingCost}
                      </span>
                      <p className="text-xs text-gray-600">
                        Add ₹{299 - bookPrice} for free shipping
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Total Cost Breakdown */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Book Price:</span>
                  <span className="font-medium">₹{bookPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Shipping:</span>
                  <span className="font-medium">
                    {deliveryInfo.isFreeShipping ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${deliveryInfo.shippingCost}`
                    )}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-lg">
                      ₹{bookPrice + deliveryInfo.shippingCost}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="text-xs text-gray-600 space-y-1">
                <p>• Cash on Delivery available</p>
                <p>• Package tracking will be provided</p>
                <p>• Safe and secure packaging guaranteed</p>
                {deliveryInfo.estimatedDays > 5 && (
                  <p className="text-yellow-600">
                    • Remote area - may require additional time
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Default Shipping Info (when no calculation done) */}
          {!deliveryInfo && !loading && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm space-y-1">
                <p className="font-medium text-blue-800">Standard Delivery:</p>
                <p className="text-blue-700">
                  • 2-8 days depending on location
                </p>
                <p className="text-blue-700">
                  • FREE shipping on orders above ₹299
                </p>
                <p className="text-blue-700">
                  • ₹29 shipping for orders below ₹299
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
