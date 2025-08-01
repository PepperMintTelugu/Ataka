import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthHelpers } from "@/lib/appwrite";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const result = await AuthHelpers.handleOAuthCallback();
        if (result && result.user) {
          setUserInfo(result.user);
          setStatus("success");

          toast({
            title: "Welcome!",
            description: `Successfully signed in as ${result.user.name}`,
          });

          // Redirect to dashboard or previous page after 2 seconds
          setTimeout(() => {
            const returnUrl = localStorage.getItem("authReturnUrl") || "/";
            localStorage.removeItem("authReturnUrl");
            navigate(returnUrl);
          }, 2000);
        } else {
          throw new Error("Failed to get user information");
        }
      } catch (error: any) {
        console.error("OAuth callback error:", error);
        setStatus("error");

        toast({
          title: "Authentication Failed",
          description: error.message || "Something went wrong during sign in",
          variant: "destructive",
        });
      }
    };

    handleOAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {status === "loading" && "Completing Sign In..."}
            {status === "success" && "Sign In Successful!"}
            {status === "error" && "Sign In Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === "loading" && (
            <div className="space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
              <p className="text-gray-600">
                Please wait while we complete your sign in...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <CheckCircle className="w-8 h-8 mx-auto text-green-500" />
              <div>
                <p className="text-gray-900 font-medium">Welcome back!</p>
                {userInfo && (
                  <p className="text-gray-600">Signed in as {userInfo.name}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Redirecting you to the app...
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <AlertCircle className="w-8 h-8 mx-auto text-red-500" />
              <div>
                <p className="text-gray-900 font-medium">
                  Something went wrong
                </p>
                <p className="text-gray-600 text-sm">
                  We couldn't complete your sign in. Please try again.
                </p>
              </div>
              <div className="space-y-2">
                <Button onClick={() => navigate("/login")} className="w-full">
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="w-full"
                >
                  Go to Homepage
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
