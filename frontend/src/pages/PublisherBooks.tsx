import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Building2, Award, Star, BookOpen } from "lucide-react";
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

interface PublisherInfo {
  id: string;
  name: string;
  nameTelugu?: string;
  description: string;
  descriptionTelugu?: string;
  logo?: string;
  totalBooks: number;
  averageRating: string;
  totalReviews: number;
  establishedYear?: number;
  website?: string;
}

export default function PublisherBooks() {
  const { publisherName, id: legacyId } = useParams<{
    publisherName?: string;
    id?: string;
  }>();
  const [sortBy, setSortBy] = useState("newest");

  // Handle both new name-based routing and legacy ID-based routing
  const publisherParam = publisherName || legacyId;

  // Get books by this publisher
  const publisherBooks = useMemo(() => {
    if (!publisherParam) return [];

    // If it's a name-based route, convert slug to text for matching
    const searchName = publisherName
      ? slugToText(publisherName)
      : publisherParam;

    return mockBooks.filter((book) => {
      // For name-based routing, match by publisher name
      if (publisherName) {
        return (
          book.publisher.toLowerCase() === searchName.toLowerCase() ||
          createSlug(book.publisher) === publisherName
        );
      }
      // Legacy ID-based routing
      return (
        book.id === publisherParam ||
        book.publisher.toLowerCase().includes(publisherParam.toLowerCase()) ||
        book.publisherTelugu?.includes(publisherParam)
      );
    });
  }, [publisherName, publisherParam]);

  // Generate publisher info from books
  const publisherInfo = useMemo(() => {
    if (publisherBooks.length === 0) return null;

    const firstBook = publisherBooks[0];
    return {
      id: publisherParam,
      name: firstBook.publisher,
      nameTelugu: firstBook.publisherTelugu,
      description: `${firstBook.publisher} is a leading publisher in Telugu literature, committed to preserving and promoting Telugu culture through quality publications. With ${publisherBooks.length} titles in our catalog, we continue to bring the best of Telugu literature to readers worldwide.`,
      descriptionTelugu: `${firstBook.publisherTelugu || firstBook.publisher} తెలుగు సాహిత్యంలో ఒక ప్రముఖ ప్రచురణ సంస్థ, నాణ్యమైన ప్రచురణల ద్వారా తెలుగు సంస్కృతిని కాపాడటంలో మరియు ప్రోత్సహించడంలో కట్టుబడి ఉంది. మా కేటలాగ్‌లో ${publisherBooks.length} శీర్షికలతో, మేము ప్రపంచవ్యాప్తంలో ఉన్న పాఠకులకు తెలుగు సాహిత్యంలో అత్యుత్తమమైనవి అందిస్తూనే ఉన్నాము.`,
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop",
      totalBooks: publisherBooks.length,
      averageRating: (
        publisherBooks.reduce((sum, book) => sum + book.rating, 0) /
        publisherBooks.length
      ).toFixed(1),
      totalReviews: publisherBooks.reduce(
        (sum, book) => sum + book.reviewCount,
        0,
      ),
      establishedYear: 1995,
      website: `www.${createSlug(firstBook.publisher)}.com`,
    };
  }, [publisherBooks, publisherParam]);

  // Sort books
  const books = useMemo(() => {
    const sorted = [...publisherBooks];
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
  }, [publisherBooks, sortBy]);

  if (!publisherInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Publisher Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The publisher you're looking for doesn't exist or has no books
            available.
          </p>
          <Button asChild>
            <Link to="/publishers">Browse All Publishers</Link>
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
            <Link to="/publishers" className="hover:text-brand-600">
              Publishers
            </Link>
            <span>/</span>
            <span className="text-gray-900 truncate">{publisherInfo.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Publisher Profile Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              {/* Publisher Logo */}
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto mb-4 rounded-lg overflow-hidden bg-gray-100 border">
                  <img
                    src={publisherInfo.logo}
                    alt={publisherInfo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {publisherInfo.name}
                </h1>
                {publisherInfo.nameTelugu && (
                  <p className="text-lg text-gray-600 telugu-text mb-2">
                    {publisherInfo.nameTelugu}
                  </p>
                )}
                <Badge variant="outline" className="text-sm">
                  Telugu Publisher
                </Badge>
              </div>

              {/* Publisher Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-brand-600">
                    {publisherInfo.totalBooks}
                  </div>
                  <div className="text-xs text-gray-600">Books</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-600 flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                    {publisherInfo.averageRating}
                  </div>
                  <div className="text-xs text-gray-600">Avg Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-600">
                    {publisherInfo.totalReviews}
                  </div>
                  <div className="text-xs text-gray-600">Reviews</div>
                </div>
              </div>

              {/* Publisher Info */}
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    {publisherInfo.description}
                  </p>
                  {publisherInfo.descriptionTelugu && (
                    <p className="text-sm text-gray-600 leading-relaxed telugu-text">
                      {publisherInfo.descriptionTelugu}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Established:</span>
                    <div className="font-medium">
                      {publisherInfo.establishedYear}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Website:</span>
                    <div className="font-medium text-brand-600 truncate">
                      {publisherInfo.website}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/publishers">
                    <Building2 className="w-4 h-4 mr-2" />
                    View All Publishers
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
                  Books by {publisherInfo.name}
                </h2>
                <p className="text-gray-600 mt-1">
                  {publisherBooks.length} book
                  {publisherBooks.length !== 1 ? "s" : ""} available
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
                  This publisher doesn't have any books available at the moment.
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
