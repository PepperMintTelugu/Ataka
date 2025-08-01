import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HomepageManager from "@/components/admin/HomepageManager";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Truck,
  Shield,
  Bell,
  Globe,
  Plus,
  Trash2,
  Edit,
  MapPin,
  Package,
  DollarSign,
  Clock,
} from "lucide-react";

export default function Settings() {
  const [showKeys, setShowKeys] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    storeName: "Ataka - The Ultimate Bookstore",
    storeDescription:
      "Your one-stop destination for Telugu literature and books",
    contactEmail: "support@ataka.com",
    contactPhone: "+91 98765 43210",
    address: "123 Book Street, Hyderabad, Telangana 500001",
    currency: "INR",
    timezone: "Asia/Kolkata",
    language: "en",
  });

  // Payment Settings State
  const [paymentSettings, setPaymentSettings] = useState({
    razorpayEnabled: true,
    razorpayKeyId: "rzp_test_1234567890",
    razorpayKeySecret: "your_secret_key_here",
    codEnabled: true,
    codCharges: 50,
    freeShippingThreshold: 500,
    taxRate: 10,
  });

  // Shipping Settings State
  const [shippingSettings, setShippingSettings] = useState({
    shiprocketEnabled: true,
    shiprocketEmail: "admin@ataka.com",
    shiprocketPassword: "your_password_here",
    defaultWeight: 0.5,
    defaultDimensions: { length: 20, width: 15, height: 3 },
    domesticShipping: true,
    internationalShipping: false,
    expressShhippingEnabled: true,
    shippingMethod: "flat_rate", // flat_rate, order_based, zone_based, free
    flatRate: 50,
    freeShippingThreshold: 500,
    shippingZones: [
      {
        id: 1,
        name: "Hyderabad City",
        type: "city",
        regions: ["Hyderabad", "Secunderabad"],
        methods: [
          {
            name: "Standard Delivery",
            rate: 30,
            freeAbove: 400,
            estimatedDays: "1-2",
          },
          {
            name: "Express Delivery",
            rate: 60,
            freeAbove: 800,
            estimatedDays: "Same Day",
          },
        ],
      },
      {
        id: 2,
        name: "Telangana State",
        type: "state",
        regions: ["Telangana"],
        methods: [
          {
            name: "Standard Delivery",
            rate: 50,
            freeAbove: 500,
            estimatedDays: "2-3",
          },
          {
            name: "Express Delivery",
            rate: 100,
            freeAbove: 1000,
            estimatedDays: "1-2",
          },
        ],
      },
      {
        id: 3,
        name: "Rest of India",
        type: "country",
        regions: ["Rest of India"],
        methods: [
          {
            name: "Standard Delivery",
            rate: 80,
            freeAbove: 600,
            estimatedDays: "3-5",
          },
          {
            name: "Express Delivery",
            rate: 150,
            freeAbove: 1200,
            estimatedDays: "2-3",
          },
        ],
      },
    ],
  });

  // Zone management states
  const [selectedZone, setSelectedZone] = useState(null);
  const [isAddingZone, setIsAddingZone] = useState(false);
  const [newZone, setNewZone] = useState({
    name: "",
    type: "city",
    regions: [],
    methods: [
      {
        name: "Standard Delivery",
        rate: 50,
        freeAbove: 500,
        estimatedDays: "2-3",
      },
    ],
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 60,
    passwordExpiry: 90,
    maxLoginAttempts: 5,
  });

  // Authentication Settings State
  const [authSettings, setAuthSettings] = useState({
    googleOAuthEnabled: true,
    googleClientId: "your_google_client_id_here",
    googleClientSecret: "your_google_client_secret_here",
    enableGoogleSignIn: true,
    enableWhatsAppOTP: true,
    enableMobileOTP: true,
    enableEmailPassword: true,
    primarySignInMethod: "google",
    otpLength: 6,
    otpValidityMinutes: 5,
    maxOtpAttempts: 3,
    whatsappBusinessNumber: "+91 98765 43210",
    smsProvider: "twilio",
    twilioAccountSid: "",
    twilioAuthToken: "",
    twilioFromNumber: "",
  });

  // Database Settings State
  const [databaseSettings, setDatabaseSettings] = useState({
    mongoUri: "mongodb://localhost:27017/telugubooks",
    redisUri: "redis://localhost:6379",
    enableRedis: true,
    enableCaching: true,
    cacheExpiryHours: 24,
    backupEnabled: true,
    backupFrequency: "daily",
    backupRetentionDays: 30,
    backupLocation: "aws-s3",
    awsAccessKey: "",
    awsSecretKey: "",
    awsBucketName: "",
    connectionPoolSize: 10,
    queryTimeout: 30,
    enableSlowQueryLog: true,
    slowQueryThreshold: 1000,
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    inventoryAlerts: true,
    paymentAlerts: true,
    weeklyReports: true,
    monthlyReports: true,
  });

  const saveSettings = (section: string) => {
    console.log(`Saving ${section} settings...`);
    // In production, this would save to backend
  };

  const testConnection = (service: string) => {
    console.log(`Testing ${service} connection...`);
    // In production, this would test API connection
  };

  const addShippingZone = () => {
    if (newZone.name && newZone.regions.length > 0) {
      const zone = {
        ...newZone,
        id: Date.now(),
        regions: newZone.regions.filter((r) => r.trim() !== ""),
      };
      setShippingSettings({
        ...shippingSettings,
        shippingZones: [...shippingSettings.shippingZones, zone],
      });
      setNewZone({
        name: "",
        type: "city",
        regions: [],
        methods: [
          {
            name: "Standard Delivery",
            rate: 50,
            freeAbove: 500,
            estimatedDays: "2-3",
          },
        ],
      });
      setIsAddingZone(false);
    }
  };

  const deleteShippingZone = (zoneId: number) => {
    setShippingSettings({
      ...shippingSettings,
      shippingZones: shippingSettings.shippingZones.filter(
        (zone) => zone.id !== zoneId,
      ),
    });
  };

  const updateShippingZone = (zoneId: number, updatedZone: any) => {
    setShippingSettings({
      ...shippingSettings,
      shippingZones: shippingSettings.shippingZones.map((zone) =>
        zone.id === zoneId ? { ...zone, ...updatedZone } : zone,
      ),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back to Admin</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <SettingsIcon className="w-6 h-6 mr-2" />
                Settings
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link to="/">
                  <Globe className="w-4 h-4 mr-2" />
                  View Store
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="homepage">Homepage</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  General Settings
                </CardTitle>
                <p className="text-gray-600">
                  Configure basic store information and preferences
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input
                      id="storeName"
                      value={generalSettings.storeName}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          storeName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          contactEmail: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      value={generalSettings.contactPhone}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          contactPhone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={generalSettings.currency}
                      onValueChange={(value) =>
                        setGeneralSettings({
                          ...generalSettings,
                          currency: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <Textarea
                    id="storeDescription"
                    value={generalSettings.storeDescription}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        storeDescription: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Store Address</Label>
                  <Textarea
                    id="address"
                    value={generalSettings.address}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        address: e.target.value,
                      })
                    }
                    rows={2}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => saveSettings("general")}>
                    <Save className="w-4 h-4 mr-2" />
                    Save General Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Homepage Settings */}
          <TabsContent value="homepage" className="space-y-6">
            <HomepageManager />
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Settings
                </CardTitle>
                <p className="text-gray-600">
                  Configure payment gateways and billing options
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Razorpay Settings */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Razorpay Integration</h3>
                      <p className="text-sm text-gray-600">
                        Online payment processing
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={paymentSettings.razorpayEnabled}
                        onCheckedChange={(checked) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            razorpayEnabled: checked,
                          })
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testConnection("Razorpay")}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Test
                      </Button>
                    </div>
                  </div>

                  {paymentSettings.razorpayEnabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="razorpayKeyId">Key ID</Label>
                        <Input
                          id="razorpayKeyId"
                          value={paymentSettings.razorpayKeyId}
                          onChange={(e) =>
                            setPaymentSettings({
                              ...paymentSettings,
                              razorpayKeyId: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="razorpayKeySecret">Key Secret</Label>
                        <div className="relative">
                          <Input
                            id="razorpayKeySecret"
                            type={showKeys ? "text" : "password"}
                            value={paymentSettings.razorpayKeySecret}
                            onChange={(e) =>
                              setPaymentSettings({
                                ...paymentSettings,
                                razorpayKeySecret: e.target.value,
                              })
                            }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowKeys(!showKeys)}
                          >
                            {showKeys ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* COD Settings */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Cash on Delivery</h3>
                      <p className="text-sm text-gray-600">
                        Accept payments on delivery
                      </p>
                    </div>
                    <Switch
                      checked={paymentSettings.codEnabled}
                      onCheckedChange={(checked) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          codEnabled: checked,
                        })
                      }
                    />
                  </div>

                  {paymentSettings.codEnabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="codCharges">COD Charges (₹)</Label>
                        <Input
                          id="codCharges"
                          type="number"
                          value={paymentSettings.codCharges}
                          onChange={(e) =>
                            setPaymentSettings({
                              ...paymentSettings,
                              codCharges: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="freeShippingThreshold">
                          Free Shipping Above (₹)
                        </Label>
                        <Input
                          id="freeShippingThreshold"
                          type="number"
                          value={paymentSettings.freeShippingThreshold}
                          onChange={(e) =>
                            setPaymentSettings({
                              ...paymentSettings,
                              freeShippingThreshold:
                                parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => saveSettings("payments")}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Payment Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Settings */}
          <TabsContent value="shipping" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Shipping Settings
                </CardTitle>
                <p className="text-gray-600">
                  Configure shipping partners and delivery options
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Shiprocket Settings */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Shiprocket Integration</h3>
                      <p className="text-sm text-gray-600">
                        Automated shipping and tracking
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={shippingSettings.shiprocketEnabled}
                        onCheckedChange={(checked) =>
                          setShippingSettings({
                            ...shippingSettings,
                            shiprocketEnabled: checked,
                          })
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testConnection("Shiprocket")}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Test
                      </Button>
                    </div>
                  </div>

                  {shippingSettings.shiprocketEnabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="shiprocketEmail">
                          Shiprocket Email
                        </Label>
                        <Input
                          id="shiprocketEmail"
                          type="email"
                          value={shippingSettings.shiprocketEmail}
                          onChange={(e) =>
                            setShippingSettings({
                              ...shippingSettings,
                              shiprocketEmail: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shiprocketPassword">
                          Shiprocket Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="shiprocketPassword"
                            type={showKeys ? "text" : "password"}
                            value={shippingSettings.shiprocketPassword}
                            onChange={(e) =>
                              setShippingSettings({
                                ...shippingSettings,
                                shiprocketPassword: e.target.value,
                              })
                            }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowKeys(!showKeys)}
                          >
                            {showKeys ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Shipping Method Selection */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-4">
                    Shipping Calculation Method
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="shippingMethod">Shipping Method</Label>
                        <Select
                          value={shippingSettings.shippingMethod}
                          onValueChange={(value) =>
                            setShippingSettings({
                              ...shippingSettings,
                              shippingMethod: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="flat_rate">Flat Rate</SelectItem>
                            <SelectItem value="order_based">
                              Order Value Based
                            </SelectItem>
                            <SelectItem value="zone_based">
                              Zone Based
                            </SelectItem>
                            <SelectItem value="free">Free Shipping</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {shippingSettings.shippingMethod === "flat_rate" && (
                        <div className="space-y-2">
                          <Label htmlFor="flatRate">Flat Rate (₹)</Label>
                          <Input
                            id="flatRate"
                            type="number"
                            value={shippingSettings.flatRate}
                            onChange={(e) =>
                              setShippingSettings({
                                ...shippingSettings,
                                flatRate: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      )}
                    </div>

                    {(shippingSettings.shippingMethod === "flat_rate" ||
                      shippingSettings.shippingMethod === "order_based") && (
                      <div className="space-y-2">
                        <Label htmlFor="freeShippingThreshold">
                          Free Shipping Above (₹)
                        </Label>
                        <Input
                          id="freeShippingThreshold"
                          type="number"
                          value={shippingSettings.freeShippingThreshold}
                          onChange={(e) =>
                            setShippingSettings({
                              ...shippingSettings,
                              freeShippingThreshold:
                                parseInt(e.target.value) || 0,
                            })
                          }
                        />
                        <p className="text-xs text-gray-500">
                          Orders above this amount will have free shipping
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Zones */}
                {shippingSettings.shippingMethod === "zone_based" && (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">Shipping Zones</h3>
                        <p className="text-sm text-gray-600">
                          Configure different shipping rates for different
                          locations
                        </p>
                      </div>
                      <Button onClick={() => setIsAddingZone(true)} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Zone
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {shippingSettings.shippingZones.map((zone) => (
                        <div
                          key={zone.id}
                          className="border rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <h4 className="font-medium">{zone.name}</h4>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {zone.type}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedZone(zone)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteShippingZone(zone.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-gray-600 mb-1">
                                Regions
                              </p>
                              <p className="text-sm">
                                {zone.regions.join(", ")}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">
                                Shipping Methods
                              </p>
                              <div className="space-y-1">
                                {zone.methods.map((method, index) => (
                                  <div
                                    key={index}
                                    className="text-sm flex items-center justify-between"
                                  >
                                    <span>{method.name}</span>
                                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                                      <span>₹{method.rate}</span>
                                      <span>•</span>
                                      <span>
                                        Free above ₹{method.freeAbove}
                                      </span>
                                      <span>•</span>
                                      <span>{method.estimatedDays} days</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add New Zone Dialog */}
                    {isAddingZone && (
                      <div className="border rounded-lg p-4 bg-blue-50 mt-4">
                        <h4 className="font-medium mb-4">
                          Add New Shipping Zone
                        </h4>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="zoneName">Zone Name</Label>
                              <Input
                                id="zoneName"
                                value={newZone.name}
                                onChange={(e) =>
                                  setNewZone({
                                    ...newZone,
                                    name: e.target.value,
                                  })
                                }
                                placeholder="e.g., Mumbai City"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="zoneType">Zone Type</Label>
                              <Select
                                value={newZone.type}
                                onValueChange={(value) =>
                                  setNewZone({ ...newZone, type: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="city">City</SelectItem>
                                  <SelectItem value="state">State</SelectItem>
                                  <SelectItem value="country">
                                    Country
                                  </SelectItem>
                                  <SelectItem value="pincode">
                                    Pincode Range
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="zoneRegions">
                              Regions (comma separated)
                            </Label>
                            <Textarea
                              id="zoneRegions"
                              value={newZone.regions.join(", ")}
                              onChange={(e) =>
                                setNewZone({
                                  ...newZone,
                                  regions: e.target.value
                                    .split(",")
                                    .map((r) => r.trim()),
                                })
                              }
                              placeholder="e.g., Mumbai, Thane, Navi Mumbai"
                              rows={2}
                            />
                          </div>

                          {/* Shipping Methods for Zone */}
                          <div className="space-y-3">
                            <Label>Shipping Methods</Label>
                            {newZone.methods.map((method, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border rounded bg-white"
                              >
                                <div className="space-y-1">
                                  <Label className="text-xs">Method Name</Label>
                                  <Input
                                    value={method.name}
                                    onChange={(e) => {
                                      const updatedMethods = [
                                        ...newZone.methods,
                                      ];
                                      updatedMethods[index].name =
                                        e.target.value;
                                      setNewZone({
                                        ...newZone,
                                        methods: updatedMethods,
                                      });
                                    }}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs">Rate (₹)</Label>
                                  <Input
                                    type="number"
                                    value={method.rate}
                                    onChange={(e) => {
                                      const updatedMethods = [
                                        ...newZone.methods,
                                      ];
                                      updatedMethods[index].rate =
                                        parseInt(e.target.value) || 0;
                                      setNewZone({
                                        ...newZone,
                                        methods: updatedMethods,
                                      });
                                    }}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs">
                                    Free Above (₹)
                                  </Label>
                                  <Input
                                    type="number"
                                    value={method.freeAbove}
                                    onChange={(e) => {
                                      const updatedMethods = [
                                        ...newZone.methods,
                                      ];
                                      updatedMethods[index].freeAbove =
                                        parseInt(e.target.value) || 0;
                                      setNewZone({
                                        ...newZone,
                                        methods: updatedMethods,
                                      });
                                    }}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs">
                                    Estimated Days
                                  </Label>
                                  <Input
                                    value={method.estimatedDays}
                                    onChange={(e) => {
                                      const updatedMethods = [
                                        ...newZone.methods,
                                      ];
                                      updatedMethods[index].estimatedDays =
                                        e.target.value;
                                      setNewZone({
                                        ...newZone,
                                        methods: updatedMethods,
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                            ))}

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setNewZone({
                                  ...newZone,
                                  methods: [
                                    ...newZone.methods,
                                    {
                                      name: "Express",
                                      rate: 100,
                                      freeAbove: 1000,
                                      estimatedDays: "1-2",
                                    },
                                  ],
                                })
                              }
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Method
                            </Button>
                          </div>

                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsAddingZone(false)}
                            >
                              Cancel
                            </Button>
                            <Button onClick={addShippingZone}>Add Zone</Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Shipping Options */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-4">Shipping Options</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Domestic Shipping</p>
                        <p className="text-sm text-gray-600">
                          Enable shipping within India
                        </p>
                      </div>
                      <Switch
                        checked={shippingSettings.domesticShipping}
                        onCheckedChange={(checked) =>
                          setShippingSettings({
                            ...shippingSettings,
                            domesticShipping: checked,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">International Shipping</p>
                        <p className="text-sm text-gray-600">
                          Enable shipping worldwide
                        </p>
                      </div>
                      <Switch
                        checked={shippingSettings.internationalShipping}
                        onCheckedChange={(checked) =>
                          setShippingSettings({
                            ...shippingSettings,
                            internationalShipping: checked,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Express Shipping</p>
                        <p className="text-sm text-gray-600">
                          Offer express delivery options
                        </p>
                      </div>
                      <Switch
                        checked={shippingSettings.expressShhippingEnabled}
                        onCheckedChange={(checked) =>
                          setShippingSettings({
                            ...shippingSettings,
                            expressShhippingEnabled: checked,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => saveSettings("shipping")}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Shipping Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Settings
                </CardTitle>
                <p className="text-gray-600">
                  Configure security and authentication options
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Advanced Security Note */}
                <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900">
                        Authentication Settings
                      </h3>
                      <p className="text-sm text-blue-700 mt-1">
                        For comprehensive authentication configuration including
                        Google OAuth, WhatsApp OTP, and Mobile OTP, visit the{" "}
                        <strong>Authentication</strong> tab.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Security Options */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-4">Security Options</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">
                          Require 2FA for admin accounts
                        </p>
                      </div>
                      <Switch
                        checked={securitySettings.twoFactorEnabled}
                        onCheckedChange={(checked) =>
                          setSecuritySettings({
                            ...securitySettings,
                            twoFactorEnabled: checked,
                          })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sessionTimeout">
                          Session Timeout (minutes)
                        </Label>
                        <Input
                          id="sessionTimeout"
                          type="number"
                          value={securitySettings.sessionTimeout}
                          onChange={(e) =>
                            setSecuritySettings({
                              ...securitySettings,
                              sessionTimeout: parseInt(e.target.value) || 60,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxLoginAttempts">
                          Max Login Attempts
                        </Label>
                        <Input
                          id="maxLoginAttempts"
                          type="number"
                          value={securitySettings.maxLoginAttempts}
                          onChange={(e) =>
                            setSecuritySettings({
                              ...securitySettings,
                              maxLoginAttempts: parseInt(e.target.value) || 5,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => saveSettings("security")}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Security Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Authentication Settings */}
          <TabsContent value="authentication" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Authentication Configuration</CardTitle>
                <p className="text-sm text-gray-600">
                  Configure sign-in methods and authentication providers
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Google OAuth Configuration */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Google OAuth 2.0</h3>
                      <p className="text-sm text-gray-600">
                        Enable Google Sign-In for your application
                      </p>
                    </div>
                    <Switch
                      checked={authSettings.googleOAuthEnabled}
                      onCheckedChange={(checked) =>
                        setAuthSettings({
                          ...authSettings,
                          googleOAuthEnabled: checked,
                        })
                      }
                    />
                  </div>

                  {authSettings.googleOAuthEnabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="googleClientId">Google Client ID</Label>
                        <Input
                          id="googleClientId"
                          type={showKeys ? "text" : "password"}
                          value={authSettings.googleClientId}
                          onChange={(e) =>
                            setAuthSettings({
                              ...authSettings,
                              googleClientId: e.target.value,
                            })
                          }
                          placeholder="your_google_client_id_here"
                        />
                      </div>
                      <div>
                        <Label htmlFor="googleClientSecret">
                          Google Client Secret
                        </Label>
                        <Input
                          id="googleClientSecret"
                          type={showKeys ? "text" : "password"}
                          value={authSettings.googleClientSecret}
                          onChange={(e) =>
                            setAuthSettings({
                              ...authSettings,
                              googleClientSecret: e.target.value,
                            })
                          }
                          placeholder="your_google_client_secret_here"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Sign-In Methods */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-4">Sign-In Methods</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Google Sign-In</p>
                        <p className="text-sm text-gray-600">
                          OAuth authentication
                        </p>
                      </div>
                      <Switch
                        checked={authSettings.enableGoogleSignIn}
                        onCheckedChange={(checked) =>
                          setAuthSettings({
                            ...authSettings,
                            enableGoogleSignIn: checked,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">WhatsApp OTP</p>
                        <p className="text-sm text-gray-600">
                          WhatsApp verification
                        </p>
                      </div>
                      <Switch
                        checked={authSettings.enableWhatsAppOTP}
                        onCheckedChange={(checked) =>
                          setAuthSettings({
                            ...authSettings,
                            enableWhatsAppOTP: checked,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Mobile OTP</p>
                        <p className="text-sm text-gray-600">
                          SMS verification
                        </p>
                      </div>
                      <Switch
                        checked={authSettings.enableMobileOTP}
                        onCheckedChange={(checked) =>
                          setAuthSettings({
                            ...authSettings,
                            enableMobileOTP: checked,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email & Password</p>
                        <p className="text-sm text-gray-600">
                          Traditional login
                        </p>
                      </div>
                      <Switch
                        checked={authSettings.enableEmailPassword}
                        onCheckedChange={(checked) =>
                          setAuthSettings({
                            ...authSettings,
                            enableEmailPassword: checked,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="primaryMethod">
                      Primary Sign-In Method
                    </Label>
                    <Select
                      value={authSettings.primarySignInMethod}
                      onValueChange={(value) =>
                        setAuthSettings({
                          ...authSettings,
                          primarySignInMethod: value,
                        })
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {authSettings.enableGoogleSignIn && (
                          <SelectItem value="google">Google Sign-In</SelectItem>
                        )}
                        {authSettings.enableWhatsAppOTP && (
                          <SelectItem value="whatsapp">WhatsApp OTP</SelectItem>
                        )}
                        {authSettings.enableMobileOTP && (
                          <SelectItem value="mobile">Mobile OTP</SelectItem>
                        )}
                        {authSettings.enableEmailPassword && (
                          <SelectItem value="email">
                            Email & Password
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* OTP Configuration */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-4">OTP Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="otpLength">OTP Length</Label>
                      <Select
                        value={authSettings.otpLength.toString()}
                        onValueChange={(value) =>
                          setAuthSettings({
                            ...authSettings,
                            otpLength: parseInt(value),
                          })
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4">4 digits</SelectItem>
                          <SelectItem value="5">5 digits</SelectItem>
                          <SelectItem value="6">6 digits</SelectItem>
                          <SelectItem value="7">7 digits</SelectItem>
                          <SelectItem value="8">8 digits</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="otpValidity">
                        OTP Validity (minutes)
                      </Label>
                      <Select
                        value={authSettings.otpValidityMinutes.toString()}
                        onValueChange={(value) =>
                          setAuthSettings({
                            ...authSettings,
                            otpValidityMinutes: parseInt(value),
                          })
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 minute</SelectItem>
                          <SelectItem value="2">2 minutes</SelectItem>
                          <SelectItem value="5">5 minutes</SelectItem>
                          <SelectItem value="10">10 minutes</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="maxAttempts">Max Attempts</Label>
                      <Select
                        value={authSettings.maxOtpAttempts.toString()}
                        onValueChange={(value) =>
                          setAuthSettings({
                            ...authSettings,
                            maxOtpAttempts: parseInt(value),
                          })
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 attempt</SelectItem>
                          <SelectItem value="3">3 attempts</SelectItem>
                          <SelectItem value="5">5 attempts</SelectItem>
                          <SelectItem value="10">10 attempts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="whatsappNumber">
                      WhatsApp Business Number
                    </Label>
                    <Input
                      id="whatsappNumber"
                      value={authSettings.whatsappBusinessNumber}
                      onChange={(e) =>
                        setAuthSettings({
                          ...authSettings,
                          whatsappBusinessNumber: e.target.value,
                        })
                      }
                      placeholder="+91 98765 43210"
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* SMS Provider Configuration */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-4">SMS Provider (Twilio)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="twilioSid">Account SID</Label>
                      <Input
                        id="twilioSid"
                        type={showKeys ? "text" : "password"}
                        value={authSettings.twilioAccountSid}
                        onChange={(e) =>
                          setAuthSettings({
                            ...authSettings,
                            twilioAccountSid: e.target.value,
                          })
                        }
                        placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="twilioToken">Auth Token</Label>
                      <Input
                        id="twilioToken"
                        type={showKeys ? "text" : "password"}
                        value={authSettings.twilioAuthToken}
                        onChange={(e) =>
                          setAuthSettings({
                            ...authSettings,
                            twilioAuthToken: e.target.value,
                          })
                        }
                        placeholder="your_auth_token_here"
                        className="mt-2"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="twilioFrom">From Number</Label>
                      <Input
                        id="twilioFrom"
                        value={authSettings.twilioFromNumber}
                        onChange={(e) =>
                          setAuthSettings({
                            ...authSettings,
                            twilioFromNumber: e.target.value,
                          })
                        }
                        placeholder="+1234567890"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button onClick={() => testConnection("google")}>
                    Test Google OAuth
                  </Button>
                  <Button onClick={() => testConnection("twilio")}>
                    Test SMS Connection
                  </Button>
                  <Button onClick={() => saveSettings("authentication")}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Authentication Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Settings */}
          <TabsContent value="database" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Configuration</CardTitle>
                <p className="text-sm text-gray-600">
                  Configure database connections and backup settings
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* MongoDB Configuration */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-4">MongoDB Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="mongoUri">MongoDB Connection URI</Label>
                      <Input
                        id="mongoUri"
                        type={showKeys ? "text" : "password"}
                        value={databaseSettings.mongoUri}
                        onChange={(e) =>
                          setDatabaseSettings({
                            ...databaseSettings,
                            mongoUri: e.target.value,
                          })
                        }
                        placeholder="mongodb://localhost:27017/telugubooks"
                        className="mt-2"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="poolSize">Connection Pool Size</Label>
                        <Input
                          id="poolSize"
                          type="number"
                          value={databaseSettings.connectionPoolSize}
                          onChange={(e) =>
                            setDatabaseSettings({
                              ...databaseSettings,
                              connectionPoolSize: parseInt(e.target.value),
                            })
                          }
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="queryTimeout">
                          Query Timeout (seconds)
                        </Label>
                        <Input
                          id="queryTimeout"
                          type="number"
                          value={databaseSettings.queryTimeout}
                          onChange={(e) =>
                            setDatabaseSettings({
                              ...databaseSettings,
                              queryTimeout: parseInt(e.target.value),
                            })
                          }
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="slowQuery">
                          Slow Query Threshold (ms)
                        </Label>
                        <Input
                          id="slowQuery"
                          type="number"
                          value={databaseSettings.slowQueryThreshold}
                          onChange={(e) =>
                            setDatabaseSettings({
                              ...databaseSettings,
                              slowQueryThreshold: parseInt(e.target.value),
                            })
                          }
                          className="mt-2"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enable Slow Query Logging</p>
                        <p className="text-sm text-gray-600">
                          Log queries that exceed threshold
                        </p>
                      </div>
                      <Switch
                        checked={databaseSettings.enableSlowQueryLog}
                        onCheckedChange={(checked) =>
                          setDatabaseSettings({
                            ...databaseSettings,
                            enableSlowQueryLog: checked,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Redis Configuration */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Redis Configuration</h3>
                      <p className="text-sm text-gray-600">
                        Cache and session storage
                      </p>
                    </div>
                    <Switch
                      checked={databaseSettings.enableRedis}
                      onCheckedChange={(checked) =>
                        setDatabaseSettings({
                          ...databaseSettings,
                          enableRedis: checked,
                        })
                      }
                    />
                  </div>

                  {databaseSettings.enableRedis && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="redisUri">Redis Connection URI</Label>
                        <Input
                          id="redisUri"
                          type={showKeys ? "text" : "password"}
                          value={databaseSettings.redisUri}
                          onChange={(e) =>
                            setDatabaseSettings({
                              ...databaseSettings,
                              redisUri: e.target.value,
                            })
                          }
                          placeholder="redis://localhost:6379"
                          className="mt-2"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Enable Caching</p>
                            <p className="text-sm text-gray-600">
                              Cache query results
                            </p>
                          </div>
                          <Switch
                            checked={databaseSettings.enableCaching}
                            onCheckedChange={(checked) =>
                              setDatabaseSettings({
                                ...databaseSettings,
                                enableCaching: checked,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="cacheExpiry">
                            Cache Expiry (hours)
                          </Label>
                          <Input
                            id="cacheExpiry"
                            type="number"
                            value={databaseSettings.cacheExpiryHours}
                            onChange={(e) =>
                              setDatabaseSettings({
                                ...databaseSettings,
                                cacheExpiryHours: parseInt(e.target.value),
                              })
                            }
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Backup Configuration */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Backup Configuration</h3>
                      <p className="text-sm text-gray-600">
                        Automated database backups
                      </p>
                    </div>
                    <Switch
                      checked={databaseSettings.backupEnabled}
                      onCheckedChange={(checked) =>
                        setDatabaseSettings({
                          ...databaseSettings,
                          backupEnabled: checked,
                        })
                      }
                    />
                  </div>

                  {databaseSettings.backupEnabled && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="backupFreq">Backup Frequency</Label>
                          <Select
                            value={databaseSettings.backupFrequency}
                            onValueChange={(value) =>
                              setDatabaseSettings({
                                ...databaseSettings,
                                backupFrequency: value,
                              })
                            }
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hourly">Hourly</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="retention">Retention (days)</Label>
                          <Input
                            id="retention"
                            type="number"
                            value={databaseSettings.backupRetentionDays}
                            onChange={(e) =>
                              setDatabaseSettings({
                                ...databaseSettings,
                                backupRetentionDays: parseInt(e.target.value),
                              })
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="backupLocation">
                            Storage Location
                          </Label>
                          <Select
                            value={databaseSettings.backupLocation}
                            onValueChange={(value) =>
                              setDatabaseSettings({
                                ...databaseSettings,
                                backupLocation: value,
                              })
                            }
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="local">
                                Local Storage
                              </SelectItem>
                              <SelectItem value="aws-s3">AWS S3</SelectItem>
                              <SelectItem value="google-cloud">
                                Google Cloud
                              </SelectItem>
                              <SelectItem value="azure">Azure Blob</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {databaseSettings.backupLocation === "aws-s3" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <Label htmlFor="awsKey">AWS Access Key</Label>
                            <Input
                              id="awsKey"
                              type={showKeys ? "text" : "password"}
                              value={databaseSettings.awsAccessKey}
                              onChange={(e) =>
                                setDatabaseSettings({
                                  ...databaseSettings,
                                  awsAccessKey: e.target.value,
                                })
                              }
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label htmlFor="awsSecret">AWS Secret Key</Label>
                            <Input
                              id="awsSecret"
                              type={showKeys ? "text" : "password"}
                              value={databaseSettings.awsSecretKey}
                              onChange={(e) =>
                                setDatabaseSettings({
                                  ...databaseSettings,
                                  awsSecretKey: e.target.value,
                                })
                              }
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label htmlFor="bucketName">S3 Bucket Name</Label>
                            <Input
                              id="bucketName"
                              value={databaseSettings.awsBucketName}
                              onChange={(e) =>
                                setDatabaseSettings({
                                  ...databaseSettings,
                                  awsBucketName: e.target.value,
                                })
                              }
                              className="mt-2"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowKeys(!showKeys)}
                  >
                    {showKeys ? (
                      <EyeOff className="w-4 h-4 mr-2" />
                    ) : (
                      <Eye className="w-4 h-4 mr-2" />
                    )}
                    {showKeys ? "Hide" : "Show"} Credentials
                  </Button>
                  <Button onClick={() => testConnection("mongodb")}>
                    Test MongoDB Connection
                  </Button>
                  {databaseSettings.enableRedis && (
                    <Button onClick={() => testConnection("redis")}>
                      Test Redis Connection
                    </Button>
                  )}
                  <Button onClick={() => saveSettings("database")}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Database Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notification Settings
                </CardTitle>
                <p className="text-gray-600">
                  Configure alerts and communication preferences
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-600">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          emailNotifications: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-gray-600">
                        Receive critical alerts via SMS
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          smsNotifications: checked,
                        })
                      }
                    />
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium mb-3">Notification Types</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Order Notifications</span>
                        <Switch
                          checked={notificationSettings.orderNotifications}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              orderNotifications: checked,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Inventory Alerts</span>
                        <Switch
                          checked={notificationSettings.inventoryAlerts}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              inventoryAlerts: checked,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Payment Alerts</span>
                        <Switch
                          checked={notificationSettings.paymentAlerts}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              paymentAlerts: checked,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Weekly Reports</span>
                        <Switch
                          checked={notificationSettings.weeklyReports}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              weeklyReports: checked,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Monthly Reports</span>
                        <Switch
                          checked={notificationSettings.monthlyReports}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              monthlyReports: checked,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => saveSettings("notifications")}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Notification Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Status Indicators */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Integration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium">Razorpay</p>
                  <p className="text-xs text-gray-500">Connected</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium">Shiprocket</p>
                  <p className="text-xs text-gray-500">Connected</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="font-medium">Google OAuth</p>
                  <p className="text-xs text-gray-500">Pending Setup</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium">Database</p>
                  <p className="text-xs text-gray-500">Operational</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
