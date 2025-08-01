import React, { useState, useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
  Trophy,
  Award,
  Star,
  ChevronLeft,
  Filter,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookCard } from "@/components/BookCard";
import {
  getRankedBooksByCategory,
  getRankingCategories,
  mockBooks,
} from "@/data/books";
import { Book } from "@/types/book";

export default function CategoryRankings() {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const rankingBasis = searchParams.get("basis") || "all";
  const decodedCategory = category ? decodeURIComponent(category) : "";

  // Get ranked books for the category
  const rankedBooks = useMemo(() => {
    if (!decodedCategory) return [];

    let books = getRankedBooksByCategory(decodedCategory);

    // Filter by ranking basis if specified
    if (rankingBasis !== "all") {
      books = books.filter((book) => book.rankingBasis === rankingBasis);
    }

    return books;
  }, [decodedCategory, rankingBasis]);

  // Get all available ranking categories
  const availableCategories = getRankingCategories();

  // Get ranking basis options for this category
  const basisOptions = useMemo(() => {
    const bases = new Set(
      mockBooks
        .filter(
          (book) =>
            book.rankingCategory === decodedCategory && book.rankingBasis,
        )
        .map((book) => book.rankingBasis!),
    );
    return Array.from(bases);
  }, [decodedCategory]);

  const getRankingBasisDisplay = (basis: string) => {
    const basisMap: Record<string, { label: string; icon: string }> = {
      sales: { label: "Sales", icon: "📈" },
      reviews: { label: "Reviews", icon: "⭐" },
      pageViews: { label: "Page Views", icon: "👁️" },
      wishlist: { label: "Wishlist", icon: "❤️" },
      cartAdds: { label: "Cart Adds", icon: "🛒" },
      rating: { label: "Rating", icon: "⭐" },
      newness: { label: "New Releases", icon: "🆕" },
    };
    return basisMap[basis] || { label: basis, icon: "🏆" };
  };

  if (!decodedCategory) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Category Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The category you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/shop">Browse All Books</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/shop">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Shop
              </Link>
            </Button>
          </div>

          <div className="flex items-center space-x-3 mb-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              {decodedCategory} Rankings
            </h1>
          </div>

          <p className="text-gray-600">
            Best selling books in {decodedCategory} • Updated daily
          </p>

          {rankingBasis !== "all" && (
            <div className="mt-3">
              <Badge variant="secondary" className="text-sm">
                {getRankingBasisDisplay(rankingBasis).icon} Ranked by{" "}
                {getRankingBasisDisplay(rankingBasis).label}
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <h3 className="font-semibold mb-4">Filter Rankings</h3>

              {/* Ranking Basis Filter */}
              {basisOptions.length > 1 && (
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">
                    Ranking Basis
                  </label>
                  <Select
                    value={rankingBasis}
                    onValueChange={(value) => {
                      const params = new URLSearchParams(searchParams);
                      if (value === "all") {
                        params.delete("basis");
                      } else {
                        params.set("basis", value);
                      }
                      window.location.href = `/rankings/${encodeURIComponent(decodedCategory)}?${params.toString()}`;
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Rankings</SelectItem>
                      {basisOptions.map((basis) => {
                        const display = getRankingBasisDisplay(basis);
                        return (
                          <SelectItem key={basis} value={basis}>
                            {display.icon} {display.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Other Categories */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Other Categories
                </label>
                <div className="space-y-2">
                  {availableCategories
                    .filter((cat) => cat !== decodedCategory)
                    .slice(0, 8)
                    .map((cat) => {
                      const categoryBooks = getRankedBooksByCategory(cat);
                      return (
                        <Link
                          key={cat}
                          to={`/rankings/${encodeURIComponent(cat)}`}
                          className="flex items-center justify-between p-2 text-sm hover:bg-gray-50 rounded transition-colors"
                        >
                          <span>{cat}</span>
                          <Badge variant="outline" className="text-xs">
                            {categoryBooks.length}
                          </Badge>
                        </Link>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Showing {rankedBooks.length} ranked books
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  List
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  Grid
                </Button>
              </div>
            </div>

            {/* Rankings Display */}
            {rankedBooks.length === 0 ? (
              <div className="text-center py-16">
                <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No Rankings Found
                </h3>
                <p className="text-gray-600 mb-6">
                  No books are currently ranked in this category.
                </p>
                <Button asChild>
                  <Link to={`/shop?category=${decodedCategory.toLowerCase()}`}>
                    Browse {decodedCategory} Books
                  </Link>
                </Button>
              </div>
            ) : viewMode === "list" ? (
              <div className="space-y-4">
                {rankedBooks.map((book, index) => (
                  <Card
                    key={book.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-6">
                        {/* Rank Number */}
                        <div className="flex-shrink-0 text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-2">
                            <span className="text-white font-bold text-lg">
                              #{book.rank}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {
                              getRankingBasisDisplay(
                                book.rankingBasis || "sales",
                              ).icon
                            }
                          </Badge>
                        </div>

                        {/* Book Image */}
                        <div className="flex-shrink-0">
                          <Link to={`/book/${book.id}`} className="block">
                            <img
                              src={book.image}
                              alt={book.title}
                              className="w-24 h-32 object-cover rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer"
                            />
                          </Link>
                        </div>

                        {/* Book Details */}
                        <div className="flex-1 min-w-0">
                          <Link to={`/book/${book.id}`}>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-brand-600 transition-colors">
                              {book.title}
                            </h3>
                          </Link>
                          {book.titleTelugu && (
                            <p className="text-gray-600 telugu-text mb-2">
                              {book.titleTelugu}
                            </p>
                          )}
                          <p className="text-gray-700 mb-3">by {book.author}</p>

                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(book.rating)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm font-medium">
                                {book.rating}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              ({book.reviewCount} reviews)
                            </span>
                          </div>

                          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                            {book.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl font-bold text-brand-600">
                                ₹{book.price}
                              </span>
                              {book.originalPrice && (
                                <span className="text-gray-500 line-through">
                                  ₹{book.originalPrice}
                                </span>
                              )}
                            </div>
                            <Button asChild>
                              <Link to={`/book/${book.id}`}>
                                View Details
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {rankedBooks.map((book) => (
                  <div key={book.id} className="relative">
                    <BookCard book={book} />
                    <div className="absolute -top-2 -left-2 z-10">
                      <Badge className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold">
                        #{book.rank}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
