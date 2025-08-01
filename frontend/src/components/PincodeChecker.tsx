import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Target,
} from "lucide-react";
import {
  getCurrentLocation,
  reverseGeocode,
  getDeliveryEstimate,
  isValidPincode,
  requestLocationPermission,
} from "@/utils/location";

interface PincodeCheckerProps {
  productPrice?: number;
  className?: string;
  variant?: "default" | "compact";
}

interface DeliveryInfo {
  pincode: string;
  city: string;
  state: string;
  deliveryDays: number;
  charges: number;
  serviceAvailable: boolean;
  courier: string;
}

export function PincodeChecker({
  productPrice = 0,
  className = "",
  variant = "default",
}: PincodeCheckerProps) {
  const [pincode, setPincode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState<
    boolean | null
  >(null);
  const { toast } = useToast();

  useEffect(() => {
    // Try to load saved pincode from localStorage
    const savedPincode = localStorage.getItem("userPincode");
    if (savedPincode && isValidPincode(savedPincode)) {
      setPincode(savedPincode);
      checkDelivery(savedPincode);
    } else {
      // Check if we can get location permission
      checkLocationPermission();
    }
  }, []);

  const checkLocationPermission = async () => {
    const hasPermission = await requestLocationPermission();
    setHasLocationPermission(hasPermission);
  };

  const handlePincodeChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, "").slice(0, 6);
    setPincode(numericValue);

    // Auto-check when 6 digits are entered
    if (numericValue.length === 6) {
      checkDelivery(numericValue);
    } else {
      setDeliveryInfo(null);
    }
  };

  const checkDelivery = async (pincodeToCheck: string) => {
    if (!isValidPincode(pincodeToCheck)) {
      toast({
        title: "Invalid Pincode",
        description: "Please enter a valid 6-digit pincode",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const estimate = await getDeliveryEstimate(pincodeToCheck);

      // Get address details for the pincode
      let addressDetails = { city: "", state: "" };
      try {
        const address = await fetch(
          `https://api.postalpincode.in/pincode/${pincodeToCheck}`,
        );
        if (address.ok) {
          const data = await address.json();
          if (
            data &&
            data[0] &&
            data[0].Status === "Success" &&
            data[0].PostOffice
          ) {
            const postOffice = data[0].PostOffice[0];
            addressDetails = {
              city: postOffice.District,
              state: postOffice.State,
            };
          }
        }
      } catch (error) {
        console.error("Failed to get address details:", error);
      }

      const deliveryCharges = productPrice >= 500 ? 0 : estimate.charges;

      setDeliveryInfo({
        pincode: pincodeToCheck,
        city: addressDetails.city,
        state: addressDetails.state,
        deliveryDays: estimate.days,
        charges: deliveryCharges,
        serviceAvailable: estimate.serviceAvailable,
        courier: estimate.courier,
      });

      // Save pincode for future use
      localStorage.setItem("userPincode", pincodeToCheck);

      toast({
        title: "Delivery Available! ✅",
        description: `Delivery in ${estimate.days} days to ${addressDetails.city}`,
      });
    } catch (error: any) {
      console.error("Delivery check failed:", error);
      toast({
        title: "Service Unavailable",
        description:
          error.message || "Unable to check delivery for this pincode",
        variant: "destructive",
      });
      setDeliveryInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocationAndSetPincode = async () => {
    setIsGettingLocation(true);
    try {
      const coords = await getCurrentLocation();
      const address = await reverseGeocode(coords);

      if (address.pincode && isValidPincode(address.pincode)) {
        setPincode(address.pincode);
        await checkDelivery(address.pincode);

        toast({
          title: "Location Found! 📍",
          description: `Using your location: ${address.city}, ${address.state}`,
        });
      } else {
        throw new Error("Could not determine pincode from your location");
      }
    } catch (error: any) {
      console.error("Location detection failed:", error);
      toast({
        title: "Location Access Failed",
        description: error.message || "Please enter your pincode manually",
        variant: "destructive",
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  if (variant === "compact") {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter pincode"
                value={pincode}
                onChange={(e) => handlePincodeChange(e.target.value)}
                className="text-sm"
                maxLength={6}
              />
              {hasLocationPermission && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={getLocationAndSetPincode}
                  disabled={isGettingLocation}
                  className="px-2"
                >
                  {isGettingLocation ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Target className="w-3 h-3" />
                  )}
                </Button>
              )}
            </div>
          </div>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        </div>

        {deliveryInfo && (
          <div className="text-sm space-y-1">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span className="text-green-600 font-medium">
                Delivery in {deliveryInfo.deliveryDays} days
              </span>
            </div>
            <div className="text-gray-600">
              to {deliveryInfo.city}, {deliveryInfo.state}
            </div>
            {deliveryInfo.charges === 0 ? (
              <div className="text-green-600 font-medium">FREE Delivery</div>
            ) : (
              <div className="text-gray-600">
                Delivery charges: ₹{deliveryInfo.charges}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <Label className="text-sm font-medium">Check Delivery</Label>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter your 6-digit pincode"
                value={pincode}
                onChange={(e) => handlePincodeChange(e.target.value)}
                className="flex-1"
                maxLength={6}
              />
              {hasLocationPermission && (
                <Button
                  variant="outline"
                  onClick={getLocationAndSetPincode}
                  disabled={isGettingLocation}
                  className="px-3"
                >
                  {isGettingLocation ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Target className="w-4 h-4" />
                  )}
                </Button>
              )}
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            </div>

            {hasLocationPermission === false && (
              <div className="text-xs text-gray-500 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>
                  Location access not available. Please enter pincode manually.
                </span>
              </div>
            )}
          </div>

          {deliveryInfo && (
            <div className="border-t pt-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-medium text-green-600">
                    Delivery Available
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {deliveryInfo.courier}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3 text-blue-500" />
                  <span>
                    <span className="font-medium">
                      {deliveryInfo.deliveryDays} days
                    </span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-3 h-3 text-green-500" />
                  <span>
                    {deliveryInfo.charges === 0 ? (
                      <span className="font-medium text-green-600">FREE</span>
                    ) : (
                      <span>₹{deliveryInfo.charges}</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-600">
                <div>
                  📍 {deliveryInfo.city}, {deliveryInfo.state}
                </div>
                {productPrice < 500 && deliveryInfo.charges > 0 && (
                  <div className="mt-1 text-blue-600">
                    💡 Order ₹{500 - productPrice} more for FREE delivery
                  </div>
                )}
              </div>

              {deliveryInfo.deliveryDays <= 2 && (
                <div className="bg-green-50 border border-green-200 rounded p-2">
                  <div className="flex items-center space-x-2 text-green-700">
                    <CheckCircle className="w-3 h-3" />
                    <span className="text-xs font-medium">
                      Fast Delivery Available
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default PincodeChecker;
