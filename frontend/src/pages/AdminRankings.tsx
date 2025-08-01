import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RankingManager } from "@/components/admin/RankingManager";

export default function AdminRankings() {
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
              <h1 className="text-2xl font-bold text-gray-900">
                Rankings Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link to="/">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Back to Store
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <RankingManager />
      </div>
    </div>
  );
}
