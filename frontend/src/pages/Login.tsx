import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen,
  Chrome,
  MessageSquare,
  Smartphone,
  ArrowLeft,
  Shield,
  CheckCircle,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

declare global {
  interface Window {
    google: any;
  }
}

interface SignInSettings {
  enableGoogle: boolean;
  enableWhatsAppOTP: boolean;
  enableMobileOTP: boolean;
  enableEmailPassword: boolean;
  primaryMethod: "google" | "whatsapp" | "mobile" | "email";
  whatsappNumber: string;
  otpLength: number;
  otpValidityMinutes: number;
}

export default function Login() {
  const [signInMode, setSignInMode] = useState<
    "select" | "whatsapp" | "mobile" | "email"
  >("select");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [signInSettings, setSignInSettings] = useState<SignInSettings>({
    enableGoogle: true,
    enableWhatsAppOTP: true,
    enableMobileOTP: true,
    enableEmailPassword: true,
    primaryMethod: "google",
    whatsappNumber: "+91 98765 43210",
    otpLength: 6,
    otpValidityMinutes: 5,
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings } = useTheme();
  const { login: adminLogin } = useAdminAuth();

  // Fetch signin settings from backend
  useEffect(() => {
    const fetchSignInSettings = async () => {
      try {
        const response = await fetch("/api/auth/signin-settings");
        if (response.ok) {
          const data = await response.json();
          setSignInSettings(data.settings);
        }
      } catch (error) {
        console.log("Using default signin settings");
      }
    };
    fetchSignInSettings();
  }, []);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Initialize Google One Tap
  useEffect(() => {
    if (!signInSettings.enableGoogle) return;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === "demo-client-id") {
      console.log("Telugu Books Demo: Google Sign-In disabled in demo mode");
      return;
    }

    const initGoogleOneTap = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleLogin,
          auto_select: false,
          cancel_on_tap_outside: false,
          use_fedcm_for_prompt: false,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          {
            theme: "filled_blue",
            size: "large",
            type: "standard",
            shape: "pill",
            width: "100%",
          },
        );
      }
    };

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initGoogleOneTap;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [signInSettings.enableGoogle]);

  const handleGoogleLogin = async (response: any) => {
    try {
      setIsGoogleLoading(true);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: "Welcome Back!",
          description: `Successfully signed in as ${data.data.user.name}`,
        });

        localStorage.setItem("user", JSON.stringify(data.data.user));
        localStorage.setItem("token", data.data.token);

        const redirectTo =
          new URLSearchParams(window.location.search).get("redirect") || "/";
        navigate(redirectTo);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast({
        title: "Sign In Failed",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const sendWhatsAppOTP = async () => {
    if (!whatsappNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your WhatsApp number",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/send-whatsapp-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: whatsappNumber }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        setCountdown(signInSettings.otpValidityMinutes * 60);
        toast({
          title: "OTP Sent",
          description: `Verification code sent to your WhatsApp: ${whatsappNumber}`,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Failed to Send OTP",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMobileOTP = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your mobile number",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/send-mobile-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        setCountdown(signInSettings.otpValidityMinutes * 60);
        toast({
          title: "OTP Sent",
          description: `Verification code sent to ${phoneNumber}`,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Failed to Send OTP",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp.trim() || otp.length !== signInSettings.otpLength) {
      toast({
        title: "Invalid OTP",
        description: `Please enter ${signInSettings.otpLength}-digit verification code`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const endpoint =
        signInMode === "whatsapp"
          ? "/api/auth/verify-whatsapp-otp"
          : "/api/auth/verify-mobile-otp";
      const phoneField =
        signInMode === "whatsapp" ? whatsappNumber : phoneNumber;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phoneField,
          otp: otp.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Sign In Successful",
          description: "Welcome to TeluguBooks!",
        });

        localStorage.setItem("user", JSON.stringify(data.data.user));
        localStorage.setItem("token", data.data.token);

        const redirectTo =
          new URLSearchParams(window.location.search).get("redirect") || "/";
        navigate(redirectTo);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: "Welcome Back!",
          description: `Successfully signed in as ${data.data.user.name}`,
        });

        localStorage.setItem("user", JSON.stringify(data.data.user));
        localStorage.setItem("token", data.data.token);

        const redirectTo =
          new URLSearchParams(window.location.search).get("redirect") || "/";
        navigate(redirectTo);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Sign In Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (signInMode === "select") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <div
                className="flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg"
                style={{ backgroundColor: settings.theme.primary }}
              >
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900">
                  {settings.brand.name}
                </div>
                <div className="text-sm text-gray-600 telugu-text">
                  {settings.brand.nameTelugu}
                </div>
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Choose your preferred sign in method
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center font-bold">
                Sign In
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Google Sign In - Primary */}
              {signInSettings.enableGoogle && (
                <div className="space-y-3">
                  <div id="google-signin-button" className="w-full"></div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 text-base font-medium border-2 hover:bg-blue-50 transition-all duration-200"
                    disabled={isGoogleLoading}
                    onClick={() => {
                      if (window.google) {
                        window.google.accounts.id.prompt();
                      }
                    }}
                  >
                    <Chrome className="w-5 h-5 mr-3" />
                    {isGoogleLoading ? "Signing in..." : "Continue with Google"}
                  </Button>
                </div>
              )}

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm uppercase">
                  <span className="bg-white px-4 text-gray-500 font-medium">
                    Or choose another method
                  </span>
                </div>
              </div>

              {/* Alternative Sign In Methods */}
              <div className="space-y-3">
                {signInSettings.enableWhatsAppOTP && (
                  <Button
                    variant="outline"
                    className="w-full h-12 text-base font-medium border-2 hover:bg-green-50 hover:border-green-200 transition-all duration-200"
                    onClick={() => setSignInMode("whatsapp")}
                  >
                    <MessageSquare className="w-5 h-5 mr-3 text-green-600" />
                    Sign in with WhatsApp OTP
                  </Button>
                )}

                {signInSettings.enableMobileOTP && (
                  <Button
                    variant="outline"
                    className="w-full h-12 text-base font-medium border-2 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
                    onClick={() => setSignInMode("mobile")}
                  >
                    <Smartphone className="w-5 h-5 mr-3 text-blue-600" />
                    Sign in with Mobile OTP
                  </Button>
                )}

                {signInSettings.enableEmailPassword && (
                  <Button
                    variant="outline"
                    className="w-full h-12 text-base font-medium border-2 hover:bg-gray-50 transition-all duration-200"
                    onClick={() => setSignInMode("email")}
                  >
                    <Shield className="w-5 h-5 mr-3 text-gray-600" />
                    Sign in with Email & Password
                  </Button>
                )}
              </div>

              {/* Register Link */}
              <div className="text-center pt-6 border-t">
                <span className="text-gray-600">New to TeluguBooks? </span>
                <Link
                  to="/register"
                  className="font-semibold hover:underline transition-colors"
                  style={{ color: settings.theme.primary }}
                >
                  Create Account
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>Secure sign-in powered by industry-standard encryption</p>
          </div>
        </div>
      </div>
    );
  }

  // OTP and Email Sign In Screens
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div
              className="flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg"
              style={{ backgroundColor: settings.theme.primary }}
            >
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-gray-900">
                {settings.brand.name}
              </div>
              <div className="text-sm text-gray-600 telugu-text">
                {settings.brand.nameTelugu}
              </div>
            </div>
          </Link>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <Button
              variant="ghost"
              className="w-fit p-0 h-auto text-gray-600 hover:text-gray-900"
              onClick={() => {
                setSignInMode("select");
                setOtpSent(false);
                setOtp("");
                setPhoneNumber("");
                setWhatsappNumber("");
                setEmail("");
                setPassword("");
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to sign in options
            </Button>
            <CardTitle className="text-xl text-center font-bold">
              {signInMode === "whatsapp" && "WhatsApp OTP"}
              {signInMode === "mobile" && "Mobile OTP"}
              {signInMode === "email" && "Email & Password"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* WhatsApp OTP */}
            {signInMode === "whatsapp" && (
              <div className="space-y-4">
                {!otpSent ? (
                  <>
                    <div>
                      <Label htmlFor="whatsapp">WhatsApp Number</Label>
                      <Input
                        id="whatsapp"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        className="mt-2 h-12"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        OTP will be sent via WhatsApp to{" "}
                        {signInSettings.whatsappNumber}
                      </p>
                    </div>
                    <Button
                      onClick={sendWhatsAppOTP}
                      disabled={isLoading}
                      className="w-full h-12"
                      style={{ backgroundColor: settings.theme.primary }}
                    >
                      {isLoading ? "Sending..." : "Send WhatsApp OTP"}
                    </Button>
                  </>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="otp">Verification Code</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder={`Enter ${signInSettings.otpLength}-digit code`}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={signInSettings.otpLength}
                        className="mt-2 h-12 text-center text-lg font-mono"
                      />
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500">
                          Code sent to {whatsappNumber}
                        </p>
                        {countdown > 0 && (
                          <p className="text-xs text-gray-600 font-mono">
                            {formatTime(countdown)}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={verifyOTP}
                      disabled={
                        isLoading || otp.length !== signInSettings.otpLength
                      }
                      className="w-full h-12"
                      style={{ backgroundColor: settings.theme.primary }}
                    >
                      {isLoading ? "Verifying..." : "Verify & Sign In"}
                    </Button>
                    {countdown === 0 && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setOtpSent(false);
                          setOtp("");
                        }}
                        className="w-full"
                      >
                        Resend OTP
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Mobile OTP */}
            {signInMode === "mobile" && (
              <div className="space-y-4">
                {!otpSent ? (
                  <>
                    <div>
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="mt-2 h-12"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        OTP will be sent via SMS
                      </p>
                    </div>
                    <Button
                      onClick={sendMobileOTP}
                      disabled={isLoading}
                      className="w-full h-12"
                      style={{ backgroundColor: settings.theme.primary }}
                    >
                      {isLoading ? "Sending..." : "Send Mobile OTP"}
                    </Button>
                  </>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="otp">Verification Code</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder={`Enter ${signInSettings.otpLength}-digit code`}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={signInSettings.otpLength}
                        className="mt-2 h-12 text-center text-lg font-mono"
                      />
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500">
                          Code sent to {phoneNumber}
                        </p>
                        {countdown > 0 && (
                          <p className="text-xs text-gray-600 font-mono">
                            {formatTime(countdown)}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={verifyOTP}
                      disabled={
                        isLoading || otp.length !== signInSettings.otpLength
                      }
                      className="w-full h-12"
                      style={{ backgroundColor: settings.theme.primary }}
                    >
                      {isLoading ? "Verifying..." : "Verify & Sign In"}
                    </Button>
                    {countdown === 0 && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setOtpSent(false);
                          setOtp("");
                        }}
                        className="w-full"
                      >
                        Resend OTP
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Email & Password */}
            {signInMode === "email" && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 h-12"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 h-12"
                    required
                  />
                </div>
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12"
                  style={{ backgroundColor: settings.theme.primary }}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Terms */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            By signing in, you agree to our{" "}
            <Link to="/terms" className="underline hover:text-gray-700">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline hover:text-gray-700">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
