import React from "react";
import { Sparkles, Package, RotateCcw, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Book } from "@/types/book";

interface BookConditionProps {
  book: Book;
  variant?: "badge" | "card" | "detailed";
  className?: string;
}

interface Condition {
  id: string;
  name: string;
  nameTelugu: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  description: string;
  priceMultiplier: number;
}

const conditions: Condition[] = [
  {
    id: "new",
    name: "Brand New",
    nameTelugu: "కొత్త",
    icon: Sparkles,
    color: "text-green-600",
    bgColor: "bg-green-100",
    description: "Sealed packaging, pristine condition",
    priceMultiplier: 1.0,
  },
  {
    id: "like-new",
    name: "Like New",
    nameTelugu: "కొత్త వంటి",
    icon: Package,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description: "Opened but unread, excellent condition",
    priceMultiplier: 0.9,
  },
  {
    id: "good",
    name: "Good Condition",
    nameTelugu: "మంచి పరిస్థితి",
    icon: RotateCcw,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    description: "Minor wear, all pages intact",
    priceMultiplier: 0.75,
  },
  {
    id: "fair",
    name: "Fair Condition",
    nameTelugu: "సాధారణ పరిస్థితి",
    icon: AlertTriangle,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    description: "Noticeable wear, but readable",
    priceMultiplier: 0.6,
  },
];

// Function to get book condition (for demo, using random logic)
const getBookCondition = (book: Book): Condition => {
  // In real app, this would come from book data
  // For demo, new arrivals are "new", others vary
  if (book.newArrival) {
    return conditions[0]; // Brand New
  } else if (book.publicationYear > 2020) {
    return conditions[1]; // Like New
  } else if (book.rating > 4.5) {
    return conditions[1]; // Like New
  } else {
    return conditions[2]; // Good
  }
};

export function BookCondition({
  book,
  variant = "badge",
  className = "",
}: BookConditionProps) {
  const condition = getBookCondition(book);
  const Icon = condition.icon;
  const conditionPrice = Math.round(book.price * condition.priceMultiplier);
  const savings = book.price - conditionPrice;

  if (variant === "badge") {
    return (
      <Badge
        variant="secondary"
        className={`${condition.bgColor} ${condition.color} border-0 ${className}`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {condition.name}
      </Badge>
    );
  }

  if (variant === "card") {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className={`p-1 rounded ${condition.bgColor}`}>
                <Icon className={`w-4 h-4 ${condition.color}`} />
              </div>
              <span className="font-medium text-sm">{condition.name}</span>
            </div>
            {condition.priceMultiplier < 1.0 && (
              <Badge className="bg-green-500 text-white text-xs">
                Save ₹{savings}
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-600 telugu-text mb-1">
            {condition.nameTelugu}
          </p>
          <p className="text-xs text-gray-500 mb-3">{condition.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-brand-600">
              ₹{conditionPrice}
            </span>
            {condition.priceMultiplier < 1.0 && (
              <span className="text-sm text-gray-500 line-through">
                ₹{book.price}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Detailed variant
  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="font-medium">Book Condition Options</h4>
      {conditions.map((cond) => {
        const CondIcon = cond.icon;
        const price = Math.round(book.price * cond.priceMultiplier);
        const isSelected = cond.id === condition.id;

        return (
          <div
            key={cond.id}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              isSelected
                ? "border-brand-500 bg-brand-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded ${cond.bgColor}`}>
                  <CondIcon className={`w-4 h-4 ${cond.color}`} />
                </div>
                <div>
                  <h5 className="font-medium text-sm">{cond.name}</h5>
                  <p className="text-xs text-gray-600">{cond.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-brand-600">₹{price}</div>
                {cond.priceMultiplier < 1.0 && (
                  <div className="text-xs text-green-600">
                    Save ₹{book.price - price}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
