import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthFailure() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error") || "unknown_error";
  const errorDescription =
    searchParams.get("error_description") ||
    "An unexpected error occurred during authentication";

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "access_denied":
        return "You cancelled the sign in process or denied access to your account.";
      case "invalid_request":
        return "The authentication request was invalid or malformed.";
      case "unauthorized_client":
        return "The application is not authorized for this authentication method.";
      case "unsupported_response_type":
        return "The authentication provider doesn't support this response type.";
      case "invalid_scope":
        return "The requested authentication scope is invalid or unknown.";
      case "server_error":
        return "The authentication server encountered an error. Please try again later.";
      case "temporarily_unavailable":
        return "The authentication service is temporarily unavailable. Please try again later.";
      default:
        return errorDescription;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-red-600">
            Authentication Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500" />

          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Unable to Sign In</h3>
            <p className="text-gray-600 text-sm">{getErrorMessage(error)}</p>
          </div>

          {error !== "access_denied" && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-500">
                <strong>Error Code:</strong> {error}
              </p>
            </div>
          )}

          <div className="space-y-2 pt-4">
            <Button onClick={() => navigate("/login")} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full"
            >
              Go to Homepage
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500">
              If you continue to experience issues, please{" "}
              <a href="/contact" className="text-blue-600 hover:underline">
                contact support
              </a>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
