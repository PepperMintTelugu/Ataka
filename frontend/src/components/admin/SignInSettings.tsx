import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Chrome,
  MessageSquare,
  Smartphone,
  Mail,
  Shield,
  Settings,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";

interface SignInSettingsData {
  enableGoogle: boolean;
  enableWhatsAppOTP: boolean;
  enableMobileOTP: boolean;
  enableEmailPassword: boolean;
  primaryMethod: "google" | "whatsapp" | "mobile" | "email";
  whatsappNumber: string;
  otpLength: number;
  otpValidityMinutes: number;
  maxOtpAttempts: number;
  otpRateLimit: number;
}

export default function SignInSettings() {
  const [settings, setSettings] = useState<SignInSettingsData>({
    enableGoogle: true,
    enableWhatsAppOTP: true,
    enableMobileOTP: true,
    enableEmailPassword: true,
    primaryMethod: "google",
    whatsappNumber: "+91 98765 43210",
    otpLength: 6,
    otpValidityMinutes: 5,
    maxOtpAttempts: 3,
    otpRateLimit: 1,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/signin-settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load signin settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setIsSaving(true);
      const response = await fetch("/api/admin/signin-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ settings }),
      });

      if (response.ok) {
        toast({
          title: "Settings Saved",
          description: "Sign-in settings updated successfully",
        });
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save signin settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: keyof SignInSettingsData, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "google":
        return <Chrome className="w-4 h-4" />;
      case "whatsapp":
        return <MessageSquare className="w-4 h-4" />;
      case "mobile":
        return <Smartphone className="w-4 h-4" />;
      case "email":
        return <Mail className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Loading signin settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Sign-In Configuration
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Configure available sign-in methods and OTP settings
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? (
                  <EyeOff className="w-4 h-4 mr-2" />
                ) : (
                  <Eye className="w-4 h-4 mr-2" />
                )}
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
              <Button size="sm" onClick={saveSettings} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enable/Disable Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Authentication Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Chrome className="w-5 h-5 text-blue-600" />
                    <Label>Google Sign-In</Label>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enableGoogle}
                    onChange={(e) =>
                      updateSetting("enableGoogle", e.target.checked)
                    }
                    className="toggle"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    <Label>WhatsApp OTP</Label>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enableWhatsAppOTP}
                    onChange={(e) =>
                      updateSetting("enableWhatsAppOTP", e.target.checked)
                    }
                    className="toggle"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                    <Label>Mobile OTP</Label>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enableMobileOTP}
                    onChange={(e) =>
                      updateSetting("enableMobileOTP", e.target.checked)
                    }
                    className="toggle"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <Label>Email & Password</Label>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enableEmailPassword}
                    onChange={(e) =>
                      updateSetting("enableEmailPassword", e.target.checked)
                    }
                    className="toggle"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Primary Method</Label>
                  <Select
                    value={settings.primaryMethod}
                    onValueChange={(value) =>
                      updateSetting("primaryMethod", value as any)
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {settings.enableGoogle && (
                        <SelectItem value="google">
                          <div className="flex items-center">
                            <Chrome className="w-4 h-4 mr-2" />
                            Google Sign-In
                          </div>
                        </SelectItem>
                      )}
                      {settings.enableWhatsAppOTP && (
                        <SelectItem value="whatsapp">
                          <div className="flex items-center">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            WhatsApp OTP
                          </div>
                        </SelectItem>
                      )}
                      {settings.enableMobileOTP && (
                        <SelectItem value="mobile">
                          <div className="flex items-center">
                            <Smartphone className="w-4 h-4 mr-2" />
                            Mobile OTP
                          </div>
                        </SelectItem>
                      )}
                      {settings.enableEmailPassword && (
                        <SelectItem value="email">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            Email & Password
                          </div>
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* OTP Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">OTP Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="whatsappNumber">
                    WhatsApp Business Number
                  </Label>
                  <Input
                    id="whatsappNumber"
                    value={settings.whatsappNumber}
                    onChange={(e) =>
                      updateSetting("whatsappNumber", e.target.value)
                    }
                    placeholder="+91 98765 43210"
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Number shown to users for WhatsApp OTP support
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="otpLength">OTP Length</Label>
                    <Select
                      value={settings.otpLength.toString()}
                      onValueChange={(value) =>
                        updateSetting("otpLength", parseInt(value))
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
                    <Label htmlFor="otpValidity">OTP Validity (minutes)</Label>
                    <Select
                      value={settings.otpValidityMinutes.toString()}
                      onValueChange={(value) =>
                        updateSetting("otpValidityMinutes", parseInt(value))
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 minute</SelectItem>
                        <SelectItem value="2">2 minutes</SelectItem>
                        <SelectItem value="3">3 minutes</SelectItem>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="maxAttempts">
                      Max Verification Attempts
                    </Label>
                    <Select
                      value={settings.maxOtpAttempts.toString()}
                      onValueChange={(value) =>
                        updateSetting("maxOtpAttempts", parseInt(value))
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

                  <div>
                    <Label htmlFor="rateLimit">
                      OTP Rate Limit (per minute)
                    </Label>
                    <Select
                      value={settings.otpRateLimit.toString()}
                      onValueChange={(value) =>
                        updateSetting("otpRateLimit", parseInt(value))
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 request</SelectItem>
                        <SelectItem value="2">2 requests</SelectItem>
                        <SelectItem value="3">3 requests</SelectItem>
                        <SelectItem value="5">5 requests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          {showPreview && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Sign-In Page Preview</CardTitle>
                <p className="text-sm text-gray-600">
                  This is how your sign-in page will look with current settings
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8 rounded-lg border-2 border-dashed">
                  <div className="max-w-sm mx-auto">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Welcome Back
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Choose your preferred sign in method
                      </p>
                    </div>

                    <div className="space-y-3">
                      {settings.enableGoogle && (
                        <div
                          className={`p-3 border-2 rounded-lg ${settings.primaryMethod === "google" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                        >
                          <div className="flex items-center">
                            <Chrome className="w-5 h-5 mr-3" />
                            <span className="text-sm font-medium">
                              Continue with Google
                            </span>
                            {settings.primaryMethod === "google" && (
                              <span className="ml-auto text-xs bg-blue-500 text-white px-2 py-1 rounded">
                                Primary
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {settings.enableWhatsAppOTP && (
                        <div
                          className={`p-3 border-2 rounded-lg ${settings.primaryMethod === "whatsapp" ? "border-green-500 bg-green-50" : "border-gray-200"}`}
                        >
                          <div className="flex items-center">
                            <MessageSquare className="w-5 h-5 mr-3 text-green-600" />
                            <span className="text-sm font-medium">
                              Sign in with WhatsApp OTP
                            </span>
                            {settings.primaryMethod === "whatsapp" && (
                              <span className="ml-auto text-xs bg-green-500 text-white px-2 py-1 rounded">
                                Primary
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {settings.enableMobileOTP && (
                        <div
                          className={`p-3 border-2 rounded-lg ${settings.primaryMethod === "mobile" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                        >
                          <div className="flex items-center">
                            <Smartphone className="w-5 h-5 mr-3 text-blue-600" />
                            <span className="text-sm font-medium">
                              Sign in with Mobile OTP
                            </span>
                            {settings.primaryMethod === "mobile" && (
                              <span className="ml-auto text-xs bg-blue-500 text-white px-2 py-1 rounded">
                                Primary
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {settings.enableEmailPassword && (
                        <div
                          className={`p-3 border-2 rounded-lg ${settings.primaryMethod === "email" ? "border-gray-500 bg-gray-50" : "border-gray-200"}`}
                        >
                          <div className="flex items-center">
                            <Mail className="w-5 h-5 mr-3 text-gray-600" />
                            <span className="text-sm font-medium">
                              Sign in with Email & Password
                            </span>
                            {settings.primaryMethod === "email" && (
                              <span className="ml-auto text-xs bg-gray-500 text-white px-2 py-1 rounded">
                                Primary
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>• OTP Length: {settings.otpLength} digits</div>
                        <div>
                          • OTP Validity: {settings.otpValidityMinutes} minutes
                        </div>
                        <div>• Max Attempts: {settings.maxOtpAttempts}</div>
                        <div>• WhatsApp Support: {settings.whatsappNumber}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Notice */}
          <Card className="mt-6 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">
                    Security Recommendations
                  </h4>
                  <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                    <li>
                      • Enable multiple sign-in methods for better user
                      experience
                    </li>
                    <li>
                      • Keep OTP validity period reasonable (5-10 minutes
                      recommended)
                    </li>
                    <li>• Implement rate limiting to prevent OTP abuse</li>
                    <li>• Use HTTPS for all authentication endpoints</li>
                    <li>• Regularly monitor failed authentication attempts</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
