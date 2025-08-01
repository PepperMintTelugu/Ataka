import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Eye, EyeOff, Chrome, Mail, Lock, User } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

declare global {
  interface Window {
    google: any;
  }
}

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings } = useTheme();

  // Initialize Google One Tap
  React.useEffect(() => {
    // Skip Google Sign-In in demo mode or if no client ID is configured
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === "demo-client-id") {
      console.log("Telugu Books Demo: Google Sign-In disabled in demo mode");
      return;
    }

    const initGoogleOneTap = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "demo-client-id",
          callback: handleGoogleRegister,
          auto_select: false,
          cancel_on_tap_outside: false,
          use_fedcm_for_prompt: false,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-register-button"),
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
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogleRegister = async (response: any) => {
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
          title: "Account Created Successfully",
          description: `Welcome ${data.data.user.name}!`,
        });

        // Store user data
        localStorage.setItem("user", JSON.stringify(data.data.user));
        localStorage.setItem("token", data.data.token);

        // Redirect
        navigate("/");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Google register error:", error);
      toast({
        title: "Registration Failed",
        description: "Failed to register with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your email.",
        variant: "destructive",
      });
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return false;
    }

    if (!acceptTerms) {
      toast({
        title: "Validation Error",
        description: "Please accept the terms and conditions.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: "Account Created Successfully",
          description: `Welcome ${data.data.user.name}!`,
        });

        // Store user data
        localStorage.setItem("user", JSON.stringify(data.data.user));
        localStorage.setItem("token", data.data.token);

        // Redirect
        navigate("/");
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error("Register error:", error);
      toast({
        title: "Registration Failed",
        description:
          error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-xl shadow-lg"
              style={{ backgroundColor: settings.theme.primary }}
            >
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="text-xl font-bold text-gray-900">
                {settings.brand.name}
              </div>
              <div className="text-sm text-gray-600 telugu-text">
                {settings.brand.nameTelugu}
              </div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Create account
          </h1>
          <p className="text-gray-600">
            Join our community of Telugu book lovers
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Sign Up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Signin */}
            {import.meta.env.VITE_GOOGLE_CLIENT_ID &&
              import.meta.env.VITE_GOOGLE_CLIENT_ID !== "demo-client-id" && (
                <div className="space-y-3">
                  <div id="google-register-button" className="w-full"></div>
                </div>
              )}

            {/* Manual Google Button as fallback */}
            {import.meta.env.VITE_GOOGLE_CLIENT_ID &&
              import.meta.env.VITE_GOOGLE_CLIENT_ID !== "demo-client-id" && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11"
                  disabled={isGoogleLoading}
                  onClick={() => {
                    if (window.google) {
                      window.google.accounts.id.prompt();
                    }
                  }}
                >
                  <Chrome className="w-5 h-5 mr-2" />
                  {isGoogleLoading
                    ? "Creating account..."
                    : "Continue with Google"}
                </Button>
              )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email Registration Form */}
            <form onSubmit={handleEmailRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptTerms"
                  checked={acceptTerms}
                  onCheckedChange={setAcceptTerms}
                />
                <Label htmlFor="acceptTerms" className="text-sm">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="underline hover:text-blue-600"
                    style={{ color: settings.theme.primary }}
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="underline hover:text-blue-600"
                    style={{ color: settings.theme.primary }}
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                disabled={isLoading}
                style={{ backgroundColor: settings.theme.primary }}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link
                to="/login"
                className="font-medium hover:underline"
                style={{ color: settings.theme.primary }}
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            By creating an account, you agree to receive promotional emails
            about Telugu books and literature.
          </p>
        </div>
      </div>
    </div>
  );
}
