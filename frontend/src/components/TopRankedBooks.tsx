import React from "react";
import { Link } from "react-router-dom";
import { Trophy, Award, Star, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getTopRankedBooks } from "@/data/books";
import { getAuthorPath } from "@/utils/slugify";

interface TopRankedBooksProps {
  title?: string;
  titleTelugu?: string;
  limit?: number;
  showCategory?: boolean;
  variant?: "compact" | "detailed" | "grid";
  className?: string;
}

export function TopRankedBooks({
  title = "Top Ranked Books",
  titleTelugu = "అగ్రశ్రేణి పుస్తకాలు",
  limit = 5,
  showCategory = true,
  variant = "detailed",
  className = "",
}: TopRankedBooksProps) {
  const topBooks = getTopRankedBooks(limit);

  if (topBooks.length === 0) {
    return null;
  }

  if (variant === "compact") {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="space-y-3">
          {topBooks.map((book) => (
            <Link
              key={book.id}
              to={`/book/${book.id}`}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-yellow-600">
                  #{book.rank}
                </span>
              </div>
              <img
                src={book.image}
                alt={book.title}
                className="w-8 h-10 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{book.title}</p>
                <p className="text-xs text-gray-600 truncate">
                  by{" "}
                  <Link
                    to={getAuthorPath(book.author)}
                    className="text-brand-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {book.author}
                  </Link>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <section className={`py-12 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            </div>
            <p className="text-gray-600 telugu-text">{titleTelugu}</p>
          </div>

          {/* Desktop: Leaderboard List View */}
          <div className="hidden md:block space-y-3">
            {topBooks.map((book, index) => (
              <Card
                key={book.id}
                className="hover:shadow-md transition-shadow duration-200"
              >
                <CardContent className="p-4">
                  <Link
                    to={`/book/${book.id}`}
                    className="flex items-center space-x-4 group"
                  >
                    {/* Rank Badge */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                              ? "bg-gray-400"
                              : index === 2
                                ? "bg-orange-500"
                                : "bg-gray-300"
                        }`}
                      >
                        {index + 1}
                      </div>
                    </div>

                    {/* Book Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-16 h-20 object-cover rounded shadow-sm group-hover:shadow-md transition-shadow"
                      />
                    </div>

                    {/* Book Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base line-clamp-2 mb-1 group-hover:text-brand-600 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        by{" "}
                        <span
                          className="text-brand-600 hover:underline cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.location.href = getAuthorPath(book.author);
                          }}
                        >
                          {book.author}
                        </span>
                      </p>

                      {/* Rankings */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {book.atakaRank && (
                          <Badge className="bg-orange-500 text-white text-xs">
                            #{book.atakaRank} in Ataka
                          </Badge>
                        )}
                        {showCategory && book.categoryRank && (
                          <Badge variant="outline" className="text-xs">
                            #{book.categoryRank} in {book.category}
                          </Badge>
                        )}
                      </div>

                      {/* Price and rating */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-brand-600">
                            ₹{book.price}
                          </span>
                          {book.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{book.originalPrice}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600">
                            {book.rating} ({book.reviewCount})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Arrow indicator */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mobile: Compact Leaderboard Grid - Shows 7-10 books at once */}
          <div className="md:hidden">
            <div className="grid grid-cols-1 gap-2 max-h-[70vh] overflow-y-auto">
              {topBooks
                .slice(0, Math.min(10, topBooks.length))
                .map((book, index) => (
                  <Card
                    key={book.id}
                    className="hover:shadow-sm transition-shadow duration-200"
                  >
                    <CardContent className="p-3">
                      <Link
                        to={`/book/${book.id}`}
                        className="flex items-center space-x-3 group"
                      >
                        {/* Rank Badge - Smaller for mobile */}
                        <div className="flex-shrink-0">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                              index === 0
                                ? "bg-yellow-500"
                                : index === 1
                                  ? "bg-gray-400"
                                  : index === 2
                                    ? "bg-orange-500"
                                    : "bg-gray-300"
                            }`}
                          >
                            {index + 1}
                          </div>
                        </div>

                        {/* Small Book Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-10 h-12 object-cover rounded shadow-sm"
                          />
                        </div>

                        {/* Compact Book Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm line-clamp-1 mb-1 group-hover:text-brand-600 transition-colors">
                            {book.title}
                          </h3>
                          <p className="text-xs text-gray-600 line-clamp-1 mb-1">
                            by {book.author}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <span className="text-sm font-bold text-brand-600">
                                ₹{book.price}
                              </span>
                              {book.originalPrice && (
                                <span className="text-xs text-gray-500 line-through">
                                  ₹{book.originalPrice}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-gray-600">
                                {book.rating}
                              </span>
                            </div>
                          </div>

                          {/* Ranking badge for mobile */}
                          {book.atakaRank && (
                            <Badge className="bg-orange-500 text-white text-xs mt-1">
                              #{book.atakaRank} Ataka
                            </Badge>
                          )}
                        </div>

                        {/* Compact arrow indicator */}
                        <div className="flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {/* Show count indicator for mobile */}
            <div className="text-center mt-4">
              <p className="text-xs text-gray-500">
                Showing top {Math.min(10, topBooks.length)} of {topBooks.length}{" "}
                books
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Default detailed variant
  return (
    <section
      className={`py-16 bg-gradient-to-br from-yellow-50 to-amber-50 ${className}`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {title}
            </h2>
          </div>
          <p className="text-xl text-gray-600 telugu-text">{titleTelugu}</p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-amber-500 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {topBooks.map((book) => (
            <Card
              key={book.id}
              className="hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group"
            >
              <Link to={`/book/${book.id}`} className="block">
                <CardContent className="p-0">
                  <div className="flex h-40">
                    <div className="relative w-32 flex-shrink-0">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-yellow-500 text-white font-bold">
                          #{book.rank}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-brand-600 transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          by{" "}
                          <span
                            className="text-brand-600 hover:underline"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.location.href = getAuthorPath(book.author);
                            }}
                          >
                            {book.author}
                          </span>
                        </p>
                        {book.atakaRank && (
                          <div className="flex items-center space-x-1 mb-1">
                            <Award className="w-3 h-3 text-orange-500" />
                            <span className="text-xs text-orange-600 font-medium">
                              #{book.atakaRank} in Ataka
                            </span>
                          </div>
                        )}
                        {showCategory && book.categoryRank && (
                          <div className="flex items-center space-x-1 mb-2">
                            <Award className="w-3 h-3 text-yellow-500" />
                            <span className="text-xs text-yellow-600 font-medium">
                              #{book.categoryRank} in {book.category}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1 mb-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">
                            {book.rating}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({book.reviewCount})
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-brand-600">
                          ₹{book.price}
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="outline">
                            View Details
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline">
            <Link to="/shop?sortBy=ranking">
              View All Rankings
              <Trophy className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
