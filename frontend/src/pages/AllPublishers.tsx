import React, { useState } from "react";
import { Search, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PublisherCard } from "@/components/PublisherCard";
import { publishers } from "@/data/books";

export default function AllPublishers() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter publishers based on search
  const filteredPublishers = publishers.filter(
    (publisher) =>
      publisher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (publisher.nameTelugu &&
        publisher.nameTelugu.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Telugu Publishers
        </h1>
        <p className="text-lg text-gray-600 mb-2 telugu-text">
          తెలుగు ప్రచురణకర్తలు
        </p>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Meet the publishers who bring Telugu literature to readers. From
          established publishing houses to modern digital platforms.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search publishers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-2xl"
          />
        </div>
      </div>

      {/* Publishers Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPublishers.map((publisher) => (
          <PublisherCard key={publisher.id} publisher={publisher} />
        ))}
      </div>

      {/* No Results */}
      {filteredPublishers.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No publishers found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search query to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}
