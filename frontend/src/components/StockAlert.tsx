import React, { useState } from "react";
import { AlertTriangle, Bell, BellOff, Check, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Book } from "@/types/book";

interface StockAlertProps {
  book: Book;
  variant?: "inline" | "card" | "modal";
  className?: string;
}

export function StockAlert({
  book,
  variant = "inline",
  className = "",
}: StockAlertProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubscribed(true);
    setIsLoading(false);
    toast({
      title: "Alert Set!",
      description: `We'll notify you at ${email} when ${book.title} is back in stock.`,
    });
  };

  const handleUnsubscribe = () => {
    setIsSubscribed(false);
    setEmail("");
    toast({
      title: "Alert Removed",
      description: "You won't receive stock notifications for this book.",
    });
  };

  // Stock level determination
  const getStockLevel = () => {
    if (!book.inStock) return "out-of-stock";
    if (book.stockCount <= 3) return "very-low";
    if (book.stockCount <= 10) return "low";
    return "normal";
  };

  const stockLevel = getStockLevel();

  // Don't show for normal stock levels in inline variant
  if (variant === "inline" && stockLevel === "normal") return null;

  const stockInfo = {
    "out-of-stock": {
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      badge: "Out of Stock",
      badgeColor: "bg-red-500",
      message: "This book is currently out of stock",
      messageTelugu: "ఈ పుస్తకం ప్రస్తుతం స్టాక్‌లో లేదు",
      icon: AlertTriangle,
    },
    "very-low": {
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      badge: "Only few left",
      badgeColor: "bg-orange-500",
      message: `Hurry! Only ${book.stockCount} left`,
      messageTelugu: `త్వరపడండి! కేవలం ${book.stockCount} మాత్రమే మిగిలాయి`,
      icon: AlertTriangle,
    },
    low: {
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      badge: "Low Stock",
      badgeColor: "bg-yellow-500",
      message: `${book.stockCount} copies available`,
      messageTelugu: `${book.stockCount} కాపీలు అందుబాటులో ఉన్నాయి`,
      icon: Package,
    },
    normal: {
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      badge: "In Stock",
      badgeColor: "bg-green-500",
      message: "Available for immediate delivery",
      messageTelugu: "తక్షణ డెలివరీకి అందుబాటులో ఉంది",
      icon: Package,
    },
  };

  const info = stockInfo[stockLevel];
  const Icon = info.icon;

  if (variant === "inline") {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Badge className={`${info.badgeColor} text-white`}>
          <Icon className="w-3 h-3 mr-1" />
          {info.badge}
        </Badge>
        {stockLevel === "out-of-stock" && (
          <Button
            variant="outline"
            size="sm"
            onClick={isSubscribed ? handleUnsubscribe : undefined}
            className="text-xs"
          >
            {isSubscribed ? (
              <>
                <BellOff className="w-3 h-3 mr-1" />
                Alert Set
              </>
            ) : (
              <>
                <Bell className="w-3 h-3 mr-1" />
                Notify Me
              </>
            )}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className={`${info.bgColor} ${info.borderColor} border ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div
            className={`p-2 rounded ${info.bgColor} border ${info.borderColor}`}
          >
            <Icon className={`w-5 h-5 ${info.color}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-medium ${info.color}`}>Stock Status</h4>
              <Badge className={`${info.badgeColor} text-white text-xs`}>
                {info.badge}
              </Badge>
            </div>
            <p className="text-sm text-gray-700 mb-1">{info.message}</p>
            <p className="text-xs text-gray-600 telugu-text mb-3">
              {info.messageTelugu}
            </p>

            {stockLevel === "out-of-stock" && (
              <div className="space-y-3">
                {!isSubscribed ? (
                  <div className="space-y-2">
                    <Label htmlFor="stock-email" className="text-xs">
                      Get notified when back in stock
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        id="stock-email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-8 text-xs"
                      />
                      <Button
                        size="sm"
                        onClick={handleSubscribe}
                        disabled={isLoading}
                        className="text-xs px-3"
                      >
                        {isLoading ? (
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Bell className="w-3 h-3 mr-1" />
                            Notify
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700">
                        You'll be notified at {email}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleUnsubscribe}
                      className="text-xs"
                    >
                      <BellOff className="w-3 h-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            )}

            {stockLevel === "very-low" && (
              <div className="mt-2">
                <Button size="sm" className="w-full text-xs">
                  <Package className="w-3 h-3 mr-1" />
                  Reserve Your Copy
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
