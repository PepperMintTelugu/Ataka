import React from "react";
import { Link } from "react-router-dom";
import { Package, Gift, Star, ShoppingCart, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book } from "@/types/book";
import { mockBooks } from "@/data/books";

interface BundleDeal {
  id: string;
  title: string;
  titleTelugu: string;
  description: string;
  books: string[]; // Book IDs
  discountPercentage: number;
  originalPrice: number;
  bundlePrice: number;
  type: "author" | "series" | "category" | "curated";
  badge?: string;
}

const bundleDeals: BundleDeal[] = [
  {
    id: "telugu-classics",
    title: "Telugu Literature Classics",
    titleTelugu: "తెలుగు సాహిత్య క్లాసిక్స్",
    description: "Essential collection of timeless Telugu literature",
    books: ["1", "2", "3"],
    discountPercentage: 25,
    originalPrice: 847,
    bundlePrice: 635,
    type: "curated",
    badge: "Bestseller Bundle",
  },
  {
    id: "children-starter",
    title: "Children's Reading Starter Pack",
    titleTelugu: "పిల్లల పఠన ప్రారంభ ప్యాకేజీ",
    description:
      "Perfect collection to start your child's Telugu reading journey",
    books: ["5", "6"],
    discountPercentage: 20,
    originalPrice: 458,
    bundlePrice: 366,
    type: "category",
    badge: "Parent's Choice",
  },
];

interface BundleDealsProps {
  book: Book;
  variant?: "sidebar" | "section";
  className?: string;
}

export function BundleDeals({
  book,
  variant = "sidebar",
  className = "",
}: BundleDealsProps) {
  // Find bundles that include this book
  const relevantBundles = bundleDeals.filter((bundle) =>
    bundle.books.includes(book.id),
  );

  if (relevantBundles.length === 0) return null;

  const getBundleBooks = (bundle: BundleDeal) => {
    return bundle.books
      .map((id) => mockBooks.find((b) => b.id === id))
      .filter(Boolean) as Book[];
  };

  if (variant === "sidebar") {
    return (
      <div className={`space-y-4 ${className}`}>
        {relevantBundles.map((bundle) => {
          const bundleBooks = getBundleBooks(bundle);
          const savings = bundle.originalPrice - bundle.bundlePrice;

          return (
            <Card key={bundle.id} className="border-orange-200 bg-orange-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center">
                    <Package className="w-4 h-4 mr-2 text-orange-600" />
                    Bundle Deal
                  </CardTitle>
                  {bundle.badge && (
                    <Badge className="bg-orange-500 text-white text-xs">
                      {bundle.badge}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">{bundle.title}</h4>
                  <p className="text-xs text-gray-600 telugu-text">
                    {bundle.titleTelugu}
                  </p>
                </div>

                <div className="flex items-center space-x-1 overflow-x-auto pb-2">
                  {bundleBooks.map((bundleBook, index) => (
                    <div key={bundleBook.id} className="flex-shrink-0">
                      <img
                        src={bundleBook.image}
                        alt={bundleBook.title}
                        className="w-8 h-10 object-cover rounded border-2 border-white shadow-sm"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Bundle Price:</span>
                    <div className="text-right">
                      <span className="font-bold text-green-600">
                        ₹{bundle.bundlePrice}
                      </span>
                      <div className="text-xs text-gray-500 line-through">
                        ₹{bundle.originalPrice}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Percent className="w-3 h-3 text-green-600" />
                    <span className="text-xs font-medium text-green-600">
                      Save ₹{savings} ({bundle.discountPercentage}% off)
                    </span>
                  </div>
                </div>

                <Button size="sm" className="w-full text-xs">
                  <Gift className="w-3 h-3 mr-1" />
                  Get Bundle Deal
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  // Section variant
  return (
    <section
      className={`py-12 bg-gradient-to-br from-orange-50 to-red-50 ${className}`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-2">
            <Package className="w-6 h-6 text-orange-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Bundle Deals</h2>
          </div>
          <p className="text-gray-600">Save more when you buy together</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {relevantBundles.map((bundle) => {
            const bundleBooks = getBundleBooks(bundle);
            const savings = bundle.originalPrice - bundle.bundlePrice;

            return (
              <Card key={bundle.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="grid grid-cols-2 gap-1">
                        {bundleBooks.slice(0, 4).map((bundleBook) => (
                          <img
                            key={bundleBook.id}
                            src={bundleBook.image}
                            alt={bundleBook.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{bundle.title}</h3>
                        {bundle.badge && (
                          <Badge className="bg-orange-500 text-white text-xs">
                            {bundle.badge}
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 telugu-text mb-2">
                        {bundle.titleTelugu}
                      </p>

                      <p className="text-sm text-gray-600 mb-4">
                        {bundle.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-baseline space-x-2">
                            <span className="text-xl font-bold text-green-600">
                              ₹{bundle.bundlePrice}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{bundle.originalPrice}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Percent className="w-3 h-3 text-green-600" />
                            <span className="text-sm font-medium text-green-600">
                              Save ₹{savings}
                            </span>
                          </div>
                        </div>

                        <Button>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add Bundle
                        </Button>
                      </div>

                      <div className="text-xs text-gray-500">
                        Includes {bundleBooks.length} books • Free delivery
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
