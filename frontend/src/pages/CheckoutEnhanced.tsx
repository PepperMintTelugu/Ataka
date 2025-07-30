import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/AppContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  ArrowLeft,
  CreditCard,
  Shield,
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
  Home,
  CheckCircle,
  Lock,
  Target,
  Loader2,
  Save,
  Plus,
} from "lucide-react";
import {
  getCurrentLocation,
  reverseGeocode,
  getAddressFromPincode,
  isValidPincode,
} from "@/utils/location";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Address {
  fullName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export default function CheckoutEnhanced() {
  const {
    cart: items,
    itemCount,
    cartTotal: totalAmount,
    clearCart,
  } = useCart();
  const { settings } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(-1);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(true);

  const [address, setAddress] = useState<Address>({
    fullName: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const shippingCost = totalAmount > 500 ? 0 : 50;
  const finalAmount = totalAmount + shippingCost;

  // Load Razorpay SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK");
      toast({
        title: "Payment Error",
        description:
          "Failed to load payment gateway. Please refresh and try again.",
        variant: "destructive",
      });
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Load saved addresses and redirect if cart is empty
  useEffect(() => {
    if (itemCount === 0) {
      navigate("/shop");
      return;
    }

    // Load saved addresses from localStorage
    const saved = localStorage.getItem("savedAddresses");
    if (saved) {
      try {
        const addresses = JSON.parse(saved);
        setSavedAddresses(addresses);

        // Pre-select the first address if available
        if (addresses.length > 0) {
          setSelectedAddressIndex(0);
          setAddress(addresses[0]);
          setIsAddingNewAddress(false);
        }
      } catch (error) {
        console.error("Failed to load saved addresses:", error);
      }
    }
  }, [itemCount, navigate]);

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const saveCurrentAddress = () => {
    if (!validateAddress()) return;

    const updatedAddresses = [...savedAddresses];

    if (selectedAddressIndex >= 0) {
      // Update existing address
      updatedAddresses[selectedAddressIndex] = address;
    } else {
      // Add new address
      updatedAddresses.push(address);
    }

    setSavedAddresses(updatedAddresses);
    localStorage.setItem("savedAddresses", JSON.stringify(updatedAddresses));

    toast({
      title: "Address Saved",
      description: "Your address has been saved for future orders.",
    });
  };

  const selectSavedAddress = (index: number) => {
    setSelectedAddressIndex(index);
    setAddress(savedAddresses[index]);
    setIsAddingNewAddress(false);
  };

  const addNewAddress = () => {
    setSelectedAddressIndex(-1);
    setAddress({
      fullName: "",
      phone: "",
      email: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
    });
    setIsAddingNewAddress(true);
  };

  const validateAddress = () => {
    const required = [
      "fullName",
      "phone",
      "email",
      "street",
      "city",
      "state",
      "pincode",
    ];
    const missing = required.filter(
      (field) => !address[field as keyof Address].trim(),
    );

    if (missing.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in: ${missing.join(", ")}`,
        variant: "destructive",
      });
      return false;
    }

    // Validate phone number
    if (!/^\d{10}$/.test(address.phone)) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return false;
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    // Validate pincode
    if (!/^\d{6}$/.test(address.pincode)) {
      toast({
        title: "Invalid Pincode",
        description: "Please enter a valid 6-digit pincode.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const getCurrentLocationAddress = async () => {
    setIsGettingLocation(true);
    try {
      const coords = await getCurrentLocation();
      const locationAddress = await reverseGeocode(coords);

      setAddress((prev) => ({
        ...prev,
        street: locationAddress.street || prev.street,
        city: locationAddress.city || prev.city,
        state: locationAddress.state || prev.state,
        pincode: locationAddress.pincode || prev.pincode,
      }));

      toast({
        title: "Location Found! 📍",
        description: `Using your current location: ${locationAddress.city}, ${locationAddress.state}`,
      });
    } catch (error: any) {
      console.error("Location detection failed:", error);
      toast({
        title: "Location Access Failed",
        description: error.message || "Please fill address manually",
        variant: "destructive",
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handlePincodeChange = async (value: string) => {
    handleAddressChange("pincode", value);

    if (isValidPincode(value)) {
      try {
        const addressDetails = await getAddressFromPincode(value);
        setAddress((prev) => ({
          ...prev,
          city: addressDetails.city || prev.city,
          state: addressDetails.state || prev.state,
        }));
      } catch (error) {
        console.error("Pincode lookup failed:", error);
      }
    }
  };

  const processRazorpayPayment = async () => {
    try {
      setIsProcessing(true);

      // Create order on backend
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          amount: finalAmount,
          items: items.map((item) => ({
            bookId: item.id,
            quantity: item.quantity,
            title: item.title,
            price: item.price,
          })),
          address,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || "Failed to create order");
      }

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_your_key_id",
        amount: orderData.data.amount,
        currency: "INR",
        name: settings.brand.name,
        description: `Order for ${itemCount} book${itemCount > 1 ? "s" : ""}`,
        image: settings.brand.logo,
        order_id: orderData.data.id,
        prefill: {
          name: address.fullName,
          email: address.email,
          contact: address.phone,
        },
        theme: {
          color: settings.theme.primary,
        },
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch("/api/payments/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.data.orderId,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              toast({
                title: "Payment Successful! 🎉",
                description: "Your order has been placed successfully.",
              });

              // Save address for future use
              if (address.fullName && address.phone) {
                const currentAddresses = JSON.parse(
                  localStorage.getItem("savedAddresses") || "[]",
                );
                const addressExists = currentAddresses.some(
                  (addr: Address) =>
                    addr.street === address.street &&
                    addr.pincode === address.pincode,
                );

                if (!addressExists) {
                  currentAddresses.push(address);
                  localStorage.setItem(
                    "savedAddresses",
                    JSON.stringify(currentAddresses),
                  );
                }
              }

              // Clear cart
              clearCart();

              // Redirect to success page
              navigate(`/order-success/${verifyData.data.orderId}`);
            } else {
              throw new Error(
                verifyData.message || "Payment verification failed",
              );
            }
          } catch (error: any) {
            console.error("Payment verification error:", error);
            toast({
              title: "Payment Verification Failed",
              description: error.message || "Please contact support.",
              variant: "destructive",
            });
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast({
              title: "Payment Cancelled",
              description: "You can continue shopping or retry payment.",
            });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Razorpay payment error:", error);
      toast({
        title: "Payment Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (currentStep === 1) {
      if (validateAddress()) {
        setCurrentStep(2);
      }
      return;
    }

    if (!razorpayLoaded) {
      toast({
        title: "Payment Gateway Loading",
        description:
          "Please wait for the payment gateway to load and try again.",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === "razorpay") {
      await processRazorpayPayment();
    } else {
      toast({
        title: "Payment Method",
        description: "Cash on Delivery will be available soon.",
        variant: "destructive",
      });
    }
  };

  if (itemCount === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Cart
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          </div>

          {/* Progress Indicator */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                  currentStep >= 1 ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : "1"}
              </div>
              <span className="ml-2 text-sm font-medium">Shipping Address</span>
            </div>
            <div className="flex-1 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                  currentStep >= 2 ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                2
              </div>
              <span className="ml-2 text-sm font-medium">Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Shipping Address
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={getCurrentLocationAddress}
                        disabled={isGettingLocation}
                      >
                        {isGettingLocation ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Target className="w-4 h-4 mr-2" />
                        )}
                        Use GPS
                      </Button>
                      {!isAddingNewAddress && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addNewAddress}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          New Address
                        </Button>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Saved Addresses */}
                  {savedAddresses.length > 0 && (
                    <div className="space-y-3">
                      <Label>Saved Addresses</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {savedAddresses.map((savedAddr, index) => (
                          <div
                            key={index}
                            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                              selectedAddressIndex === index
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => selectSavedAddress(index)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium">
                                  {savedAddr.fullName}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {savedAddr.street}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {savedAddr.city}, {savedAddr.state} -{" "}
                                  {savedAddr.pincode}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {savedAddr.phone}
                                </p>
                              </div>
                              <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                                {selectedAddressIndex === index && (
                                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {!isAddingNewAddress && (
                        <div className="border-t pt-4"></div>
                      )}
                    </div>
                  )}

                  {/* Address Form */}
                  {isAddingNewAddress && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName">Full Name *</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="fullName"
                              value={address.fullName}
                              onChange={(e) =>
                                handleAddressChange("fullName", e.target.value)
                              }
                              className="pl-10"
                              placeholder="Enter your full name"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="phone"
                              value={address.phone}
                              onChange={(e) =>
                                handleAddressChange("phone", e.target.value)
                              }
                              className="pl-10"
                              placeholder="10-digit mobile number"
                              maxLength={10}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            value={address.email}
                            onChange={(e) =>
                              handleAddressChange("email", e.target.value)
                            }
                            className="pl-10"
                            placeholder="For order updates"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="street">Street Address *</Label>
                        <div className="relative">
                          <Home className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="street"
                            value={address.street}
                            onChange={(e) =>
                              handleAddressChange("street", e.target.value)
                            }
                            className="pl-10"
                            placeholder="House no, Building, Street, Area"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="landmark">Landmark (Optional)</Label>
                        <Input
                          id="landmark"
                          value={address.landmark}
                          onChange={(e) =>
                            handleAddressChange("landmark", e.target.value)
                          }
                          placeholder="Near landmark"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={address.city}
                            onChange={(e) =>
                              handleAddressChange("city", e.target.value)
                            }
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State *</Label>
                          <Select
                            value={address.state}
                            onValueChange={(value) =>
                              handleAddressChange("state", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="andhra-pradesh">
                                Andhra Pradesh
                              </SelectItem>
                              <SelectItem value="telangana">
                                Telangana
                              </SelectItem>
                              <SelectItem value="karnataka">
                                Karnataka
                              </SelectItem>
                              <SelectItem value="tamil-nadu">
                                Tamil Nadu
                              </SelectItem>
                              <SelectItem value="kerala">Kerala</SelectItem>
                              <SelectItem value="maharashtra">
                                Maharashtra
                              </SelectItem>
                              <SelectItem value="delhi">Delhi</SelectItem>
                              <SelectItem value="west-bengal">
                                West Bengal
                              </SelectItem>
                              <SelectItem value="gujarat">Gujarat</SelectItem>
                              <SelectItem value="rajasthan">
                                Rajasthan
                              </SelectItem>
                              <SelectItem value="uttar-pradesh">
                                Uttar Pradesh
                              </SelectItem>
                              <SelectItem value="bihar">Bihar</SelectItem>
                              <SelectItem value="odisha">Odisha</SelectItem>
                              <SelectItem value="jharkhand">
                                Jharkhand
                              </SelectItem>
                              <SelectItem value="chhattisgarh">
                                Chhattisgarh
                              </SelectItem>
                              <SelectItem value="madhya-pradesh">
                                Madhya Pradesh
                              </SelectItem>
                              <SelectItem value="haryana">Haryana</SelectItem>
                              <SelectItem value="punjab">Punjab</SelectItem>
                              <SelectItem value="himachal-pradesh">
                                Himachal Pradesh
                              </SelectItem>
                              <SelectItem value="uttarakhand">
                                Uttarakhand
                              </SelectItem>
                              <SelectItem value="jammu-kashmir">
                                Jammu & Kashmir
                              </SelectItem>
                              <SelectItem value="assam">Assam</SelectItem>
                              <SelectItem value="goa">Goa</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="pincode">Pincode *</Label>
                          <Input
                            id="pincode"
                            value={address.pincode}
                            onChange={(e) =>
                              handlePincodeChange(e.target.value)
                            }
                            placeholder="6-digit pincode"
                            maxLength={6}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={saveCurrentAddress}
                          disabled={!address.fullName || !address.phone}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Address
                        </Button>
                        <p className="text-sm text-gray-500">
                          Save for faster checkout next time
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        paymentMethod === "razorpay"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                      onClick={() => setPaymentMethod("razorpay")}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                            {paymentMethod === "razorpay" && (
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">
                              Razorpay (Recommended)
                            </h3>
                            <p className="text-sm text-gray-600">
                              Credit/Debit Card, UPI, Net Banking, Wallets
                            </p>
                          </div>
                        </div>
                        <Shield className="w-5 h-5 text-green-500" />
                      </div>
                    </div>

                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-colors opacity-50 ${
                        paymentMethod === "cod"
                          ? "border-gray-500 bg-gray-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>
                          <div>
                            <h3 className="font-medium text-gray-500">
                              Cash on Delivery
                            </h3>
                            <p className="text-sm text-gray-400">
                              Pay when you receive your order (Coming Soon)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-blue-600">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Secure Payment
                      </span>
                    </div>
                    <p className="text-sm text-blue-600 mt-1">
                      Your payment information is encrypted and secured by
                      Razorpay.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing Details */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${shippingCost}`
                      )}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>₹{finalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {shippingCost === 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-green-600">
                      <Truck className="w-4 h-4" />
                      <span className="text-sm font-medium">FREE DELIVERY</span>
                    </div>
                    <p className="text-sm text-green-600">
                      Your order qualifies for free shipping!
                    </p>
                  </div>
                )}

                <Button
                  onClick={handlePlaceOrder}
                  className="w-full h-12"
                  disabled={isProcessing}
                  style={{ backgroundColor: settings.theme.primary }}
                >
                  {isProcessing
                    ? "Processing..."
                    : currentStep === 1
                      ? "Continue to Payment"
                      : `Pay ₹${finalAmount.toLocaleString()}`}
                </Button>

                <div className="text-center text-xs text-gray-500">
                  <p>
                    By placing your order, you agree to our{" "}
                    <Link to="/terms" className="underline">
                      Terms of Service
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
