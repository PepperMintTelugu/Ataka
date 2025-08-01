import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { mockBooks } from "@/data/books";
import { Book } from "@/types/book";

interface SearchResult {
  book: Book;
  matchType: "title" | "author" | "category";
}

interface GoogleStyleSearchProps {
  className?: string;
  placeholder?: string;
}

export function GoogleStyleSearch({
  className = "",
  placeholder = "Search books, authors...",
}: GoogleStyleSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Search function
  const performSearch = (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    mockBooks.forEach((book) => {
      // Search in title
      if (
        book.title.toLowerCase().includes(lowerQuery) ||
        (book.titleTelugu &&
          book.titleTelugu.toLowerCase().includes(lowerQuery))
      ) {
        results.push({ book, matchType: "title" });
      }
      // Search in author
      else if (
        book.author.toLowerCase().includes(lowerQuery) ||
        (book.authorTelugu &&
          book.authorTelugu.toLowerCase().includes(lowerQuery))
      ) {
        results.push({ book, matchType: "author" });
      }
      // Search in category
      else if (
        book.category.toLowerCase().includes(lowerQuery) ||
        (book.categoryTelugu &&
          book.categoryTelugu.toLowerCase().includes(lowerQuery))
      ) {
        results.push({ book, matchType: "category" });
      }
    });

    // Sort by relevance and limit to 8 results
    setSearchResults(results.slice(0, 8));
    setShowResults(true);
    setIsLoading(false);
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowResults(false);
    }
  };

  const handleResultClick = (bookId: string) => {
    setShowResults(false);
    setSearchQuery("");
    navigate(`/book/${bookId}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
            className="pl-12 pr-12 h-12 text-base border-2 border-gray-200 rounded-full focus:border-brand-500 focus:ring-brand-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (searchResults.length > 0 || isLoading) && (
        <Card className="absolute top-full left-0 right-0 mt-2 shadow-lg border-0 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500 mx-auto"></div>
                <p className="mt-2 text-sm">Searching...</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {searchResults.map(({ book, matchType }, index) => (
                  <div
                    key={`${book.id}-${index}`}
                    onClick={() => handleResultClick(book.id)}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  >
                    {/* Book Image */}
                    <div className="flex-shrink-0 w-12 h-16 mr-3">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>

                    {/* Book Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                            {book.title}
                          </h4>
                          {book.titleTelugu && (
                            <p className="text-xs text-gray-600 telugu-text line-clamp-1">
                              {book.titleTelugu}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            by {book.author}
                          </p>
                          {matchType === "category" && (
                            <p className="text-xs text-blue-600 mt-1">
                              in {book.category}
                            </p>
                          )}
                        </div>

                        {/* Price */}
                        <div className="ml-3 text-right">
                          <p className="text-sm font-semibold text-brand-600">
                            ₹{book.price}
                          </p>
                          {book.originalPrice &&
                            book.originalPrice > book.price && (
                              <p className="text-xs text-gray-500 line-through">
                                ₹{book.originalPrice}
                              </p>
                            )}
                        </div>
                      </div>

                      {/* Ataka Ranking */}
                      {book.atakaRank && (
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            #{book.atakaRank} in Ataka
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {searchResults.length === 8 && (
                  <div className="p-3 text-center border-t">
                    <button
                      onClick={() => {
                        navigate(
                          `/shop?search=${encodeURIComponent(searchQuery)}`,
                        );
                        setShowResults(false);
                        setSearchQuery("");
                      }}
                      className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                    >
                      View all results for "{searchQuery}"
                    </button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {showResults &&
        !isLoading &&
        searchResults.length === 0 &&
        searchQuery.length >= 2 && (
          <Card className="absolute top-full left-0 right-0 mt-2 shadow-lg border-0 z-50">
            <CardContent className="p-4 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No books found for "{searchQuery}"</p>
              <p className="text-xs text-gray-400 mt-1">
                Try different keywords
              </p>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
