import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, BookOpen, Award, Star, Users } from "lucide-react";
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
import { mockBooks } from "@/data/books";
import { Book } from "@/types/book";
import { slugToText, createSlug } from "@/utils/slugify";

interface AuthorInfo {
  id: string;
  name: string;
  nameTelugu?: string;
  bio: string;
  bioTelugu?: string;
  image?: string;
  totalBooks: number;
  averageRating: string;
  totalReviews: number;
}

export default function AuthorBooks() {
  const { authorName, id: legacyId } = useParams<{
    authorName?: string;
    id?: string;
  }>();
  const [sortBy, setSortBy] = useState("newest");

  // Handle both new name-based routing and legacy ID-based routing
  const authorParam = authorName || legacyId;

  // Get books by this author
  const authorBooks = useMemo(() => {
    if (!authorParam) return [];

    // If it's a name-based route, convert slug to text for matching
    const searchName = authorName ? slugToText(authorName) : authorParam;

    return mockBooks.filter((book) => {
      // For name-based routing, match by author name
      if (authorName) {
        return (
          book.author.toLowerCase() === searchName.toLowerCase() ||
          createSlug(book.author) === authorName
        );
      }
      // Legacy ID-based routing
      return (
        book.id === authorParam ||
        book.author.toLowerCase().includes(authorParam.toLowerCase()) ||
        book.authorTelugu?.includes(authorParam)
      );
    });
  }, [authorName, authorParam]);

  // Generate author info from books
  const authorInfo = useMemo(() => {
    if (authorBooks.length === 0) return null;

    const firstBook = authorBooks[0];
    return {
      id: authorParam,
      name: firstBook.author,
      nameTelugu: firstBook.authorTelugu,
      bio: `${firstBook.author} is a renowned Telugu author known for their contribution to Telugu literature. With ${authorBooks.length} published works, they have captivated readers with their unique storytelling style.`,
      bioTelugu: `${firstBook.authorTelugu || firstBook.author} తెలుగు సాహిత్యానికి తమ సహకారంతో ప్రసిద్ధి చెందిన రచయిత. ${authorBooks.length} ప్రచురితమైన రచనలతో, వారు తమ అనుపమ కథా శైలితో పాఠకులను మంత్రముగ్ధులను చేశారు.`,
      image: "/api/placeholder/200/200",
      totalBooks: authorBooks.length,
      averageRating: (
        authorBooks.reduce((sum, book) => sum + book.rating, 0) /
        authorBooks.length
      ).toFixed(1),
      totalReviews: authorBooks.reduce(
        (sum, book) => sum + book.reviewCount,
        0,
      ),
    };
  }, [authorBooks, authorParam]);

  // Sort books
  const books = useMemo(() => {
    const sorted = [...authorBooks];
    switch (sortBy) {
      case "newest":
        return sorted.sort((a, b) => b.publicationYear - a.publicationYear);
      case "oldest":
        return sorted.sort((a, b) => a.publicationYear - b.publicationYear);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "popularity":
        return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
      default:
        return sorted;
    }
  }, [authorBooks, sortBy]);

  if (!authorInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Author Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The author you're looking for doesn't exist or has no books
            available.
          </p>
          <Button asChild>
            <Link to="/authors">Browse All Authors</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-brand-600">
              Home
            </Link>
            <span>/</span>
            <Link to="/authors" className="hover:text-brand-600">
              Authors
            </Link>
            <span>/</span>
            <span className="text-gray-900 truncate">{authorInfo.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Author Profile Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              {/* Author Image */}
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
                    alt={authorInfo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {authorInfo.name}
                </h1>
                {authorInfo.nameTelugu && (
                  <p className="text-lg text-gray-600 telugu-text mb-2">
                    {authorInfo.nameTelugu}
                  </p>
                )}
                <Badge variant="outline" className="text-sm">
                  Telugu Author
                </Badge>
              </div>

              {/* Author Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-brand-600">
                    {authorInfo.totalBooks}
                  </div>
                  <div className="text-xs text-gray-600">Books</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-600 flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                    {authorInfo.averageRating}
                  </div>
                  <div className="text-xs text-gray-600">Avg Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-600">
                    {authorInfo.totalReviews}
                  </div>
                  <div className="text-xs text-gray-600">Reviews</div>
                </div>
              </div>

              {/* Author Bio */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  {authorInfo.bio}
                </p>
                {authorInfo.bioTelugu && (
                  <p className="text-sm text-gray-600 leading-relaxed telugu-text">
                    {authorInfo.bioTelugu}
                  </p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/authors">
                    <Users className="w-4 h-4 mr-2" />
                    View All Authors
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Books Grid */}
          <div className="lg:col-span-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Books by {authorInfo.name}
                </h2>
                <p className="text-gray-600 mt-1">
                  {authorBooks.length} book{authorBooks.length !== 1 ? "s" : ""}{" "}
                  available
                </p>
              </div>

              {/* Sort Options */}
              <div className="mt-4 sm:mt-0">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {/* Empty State */}
            {books.length === 0 && (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No Books Found
                </h3>
                <p className="text-gray-600 mb-6">
                  This author doesn't have any books available at the moment.
                </p>
                <Button asChild>
                  <Link to="/shop">Browse All Books</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
