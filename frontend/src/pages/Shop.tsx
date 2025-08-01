import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, Grid, List, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { BookCard } from "@/components/BookCard";
import { mockBooks, categories, languages, searchBooks } from "@/data/books";
import { Book, FilterOptions } from "@/types/book";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<FilterOptions>({
    category: searchParams.get("category") || undefined,
    language: undefined,
    priceRange: [0, 1000],
    rating: undefined,
    availability: true,
    sortBy: "ranking",
  });

  // Filter books based on current filters and search
  const filteredBooks = useMemo(() => {
    let books = [...mockBooks];

    // Apply search
    if (searchQuery.trim()) {
      books = searchBooks(searchQuery);
    }

    // Apply category filter
    if (filters.category) {
      if (filters.category === "under-150") {
        // Special filter for books under ₹150
        books = books.filter((book) => book.price <= 150);
      } else {
        books = books.filter(
          (book) =>
            book.category.toLowerCase() === filters.category?.toLowerCase(),
        );
      }
    }

    // Apply language filter
    if (filters.language) {
      books = books.filter(
        (book) =>
          book.language.toLowerCase() === filters.language?.toLowerCase(),
      );
    }

    // Apply price range filter
    if (filters.priceRange) {
      books = books.filter(
        (book) =>
          book.price >= filters.priceRange![0] &&
          book.price <= filters.priceRange![1],
      );
    }

    // Apply rating filter
    if (filters.rating) {
      books = books.filter((book) => book.rating >= filters.rating!);
    }

    // Apply availability filter
    if (filters.availability) {
      books = books.filter((book) => book.inStock);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "ranking":
        // Sort by Ataka ranking (lower rank number = higher priority)
        // Books with no rank go to the end
        books.sort((a, b) => {
          if (a.atakaRank && b.atakaRank) {
            return a.atakaRank - b.atakaRank;
          } else if (a.atakaRank && !b.atakaRank) {
            return -1;
          } else if (!a.atakaRank && b.atakaRank) {
            return 1;
          } else {
            // Both have no rank, sort by popularity as fallback
            return b.reviewCount - a.reviewCount;
          }
        });
        break;
      case "price-low":
        books.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        books.sort((a, b) => b.price - a.price);
        break;
      case "rating-high":
        books.sort((a, b) => b.rating - a.rating);
        break;
      case "rating-low":
        books.sort((a, b) => a.rating - b.rating);
        break;
      case "newest":
        books.sort((a, b) => b.publicationYear - a.publicationYear);
        break;
      case "oldest":
        books.sort((a, b) => a.publicationYear - b.publicationYear);
        break;
      case "name-asc":
        books.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        books.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "popular":
        books.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        // Default to Ataka ranking
        books.sort((a, b) => {
          if (a.atakaRank && b.atakaRank) {
            return a.atakaRank - b.atakaRank;
          } else if (a.atakaRank && !b.atakaRank) {
            return -1;
          } else if (!a.atakaRank && b.atakaRank) {
            return 1;
          } else {
            return b.reviewCount - a.reviewCount;
          }
        });
        break;
    }

    return books;
  }, [searchQuery, filters]);

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("search", query);
        return newParams;
      });
    } else {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.delete("search");
        return newParams;
      });
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: undefined,
      language: undefined,
      priceRange: [0, 1000],
      rating: undefined,
      availability: true,
      sortBy: "ranking",
    });
    setSearchQuery("");
    setSearchParams({});
  };

  // Get active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.language) count++;
    if (filters.rating) count++;
    if (filters.priceRange && filters.priceRange[0] > 0) count++;
    if (filters.priceRange && filters.priceRange[1] < 1000) count++;
    return count;
  }, [filters]);

  useEffect(() => {
    const category = searchParams.get("category");
    if (category && category !== filters.category) {
      setFilters((prev) => ({ ...prev, category }));
    }
  }, [searchParams, filters.category]);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <Label htmlFor="search" className="text-sm font-medium">
          Search Books
        </Label>
        <Input
          id="search"
          type="text"
          placeholder="Search books, authors..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="mt-1"
        />
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Categories</Label>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={filters.category === category.id}
                onCheckedChange={(checked) =>
                  handleFilterChange(
                    "category",
                    checked ? category.id : undefined,
                  )
                }
              />
              <Label
                htmlFor={category.id}
                className="text-sm cursor-pointer flex-1 flex justify-between"
              >
                <span>{category.name}</span>
                <span className="text-xs text-gray-500 telugu-text">
                  {category.nameTelugu}
                </span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Languages */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Languages</Label>
        <div className="space-y-2">
          {languages.map((language) => (
            <div key={language.id} className="flex items-center space-x-2">
              <Checkbox
                id={language.id}
                checked={filters.language === language.name}
                onCheckedChange={(checked) =>
                  handleFilterChange(
                    "language",
                    checked ? language.name : undefined,
                  )
                }
              />
              <Label
                htmlFor={language.id}
                className="text-sm cursor-pointer flex-1"
              >
                {language.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Price Range</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="min-price" className="text-xs">
              Min
            </Label>
            <Input
              id="min-price"
              type="number"
              placeholder="₹0"
              value={filters.priceRange?.[0] || ""}
              onChange={(e) =>
                handleFilterChange("priceRange", [
                  parseInt(e.target.value) || 0,
                  filters.priceRange?.[1] || 1000,
                ])
              }
            />
          </div>
          <div>
            <Label htmlFor="max-price" className="text-xs">
              Max
            </Label>
            <Input
              id="max-price"
              type="number"
              placeholder="₹1000"
              value={filters.priceRange?.[1] || ""}
              onChange={(e) =>
                handleFilterChange("priceRange", [
                  filters.priceRange?.[0] || 0,
                  parseInt(e.target.value) || 1000,
                ])
              }
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Minimum Rating</Label>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={filters.rating === rating}
                onCheckedChange={(checked) =>
                  handleFilterChange("rating", checked ? rating : undefined)
                }
              />
              <Label
                htmlFor={`rating-${rating}`}
                className="text-sm cursor-pointer"
              >
                {rating}+ Stars
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Availability */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="availability"
          checked={filters.availability}
          onCheckedChange={(checked) =>
            handleFilterChange("availability", checked)
          }
        />
        <Label htmlFor="availability" className="text-sm cursor-pointer">
          In Stock Only
        </Label>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full text-red-600 border-red-200 hover:bg-red-50"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">
              Telugu Books Collection
            </h1>
            <p className="text-gray-600">
              Showing {filteredBooks.length} books
              {searchQuery && (
                <span>
                  {" "}
                  for "<strong>{searchQuery}</strong>"
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-4 lg:mt-0">
            {/* Sort */}
            <Select
              value={filters.sortBy}
              onValueChange={(value) =>
                handleFilterChange("sortBy", value as FilterOptions["sortBy"])
              }
            >
              <SelectTrigger className="w-full sm:w-52 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ranking">🏆 Best Ranked</SelectItem>
                <SelectItem value="popular">📈 Most Popular</SelectItem>
                <SelectItem value="rating-high">⭐ Highest Rated</SelectItem>
                <SelectItem value="rating-low">⭐ Lowest Rated</SelectItem>
                <SelectItem value="price-low">💰 Price: Low to High</SelectItem>
                <SelectItem value="price-high">
                  💰 Price: High to Low
                </SelectItem>
                <SelectItem value="newest">🆕 Newest First</SelectItem>
                <SelectItem value="oldest">📅 Oldest First</SelectItem>
                <SelectItem value="name-asc">🔤 Name: A to Z</SelectItem>
                <SelectItem value="name-desc">🔤 Name: Z to A</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-3">
              {/* View Mode */}
              <div className="hidden sm:flex items-center border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Mobile Filters */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden h-10 px-4">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge variant="destructive" className="ml-2 h-5 min-w-5">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:w-80 p-0">
                  <SheetHeader className="p-6 pb-4">
                    <SheetTitle className="text-lg">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="px-6 pb-6 overflow-y-auto h-full">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary">{activeFiltersCount}</Badge>
                )}
              </div>
              <FilterContent />
            </div>
          </div>

          {/* Books Grid */}
          <div className="flex-1">
            {filteredBooks.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">📚</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No books found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
                    : "space-y-4"
                }
              >
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    variant={viewMode === "list" ? "horizontal" : "default"}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
