import React, { useState } from "react";
import { Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AuthorCard } from "@/components/AuthorCard";
import { authors } from "@/data/books";

export default function AllAuthors() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter authors based on search
  const filteredAuthors = authors.filter(
    (author) =>
      author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (author.nameTelugu &&
        author.nameTelugu.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Telugu Authors
        </h1>
        <p className="text-lg text-gray-600 mb-2 telugu-text">తెలుగు రచయితలు</p>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover the brilliant minds behind Telugu literature. From classical
          poets to contemporary novelists, explore the rich heritage of Telugu
          authors.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-2xl"
          />
        </div>
      </div>

      {/* Authors Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredAuthors.map((author) => (
          <AuthorCard key={author.id} author={author} />
        ))}
      </div>

      {/* No Results */}
      {filteredAuthors.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No authors found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search query to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}
