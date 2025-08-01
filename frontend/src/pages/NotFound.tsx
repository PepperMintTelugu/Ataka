import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-32 h-32 bg-gradient-to-br from-brand-100 to-telugu-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <BookOpen className="w-16 h-16 text-brand-500" />
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-2 telugu-text">ఈ పేజీ దొరకలేదు</p>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/shop">
                <Search className="w-4 h-4 mr-2" />
                Browse Books
              </Link>
            </Button>
          </div>

          <div className="text-sm text-gray-500 mt-8">
            <p>Looking for something specific?</p>
            <p>Try searching our collection or contact us for help.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
