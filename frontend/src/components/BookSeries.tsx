import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Book } from "@/types/book";

interface BookSeriesProps {
  book: Book;
  className?: string;
}

interface SeriesBook {
  id: string;
  title: string;
  order: number;
  published: boolean;
  owned?: boolean;
  price: number;
  image: string;
}

// Mock series data - in real app this would come from the book data
const getBookSeries = (
  bookId: string,
): {
  seriesName: string;
  books: SeriesBook[];
  currentBook: number;
} | null => {
  // Sample series for demonstration
  const seriesData: Record<string, any> = {
    "1": {
      seriesName: "Veyipadagalu Trilogy",
      currentBook: 1,
      books: [
        {
          id: "1",
          title: "Veyipadagalu",
          order: 1,
          published: true,
          owned: true,
          price: 299,
          image:
            "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
        },
        {
          id: "series-1-2",
          title: "Veyipadagalu: The Journey Continues",
          order: 2,
          published: true,
          owned: false,
          price: 349,
          image:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
        },
        {
          id: "series-1-3",
          title: "Veyipadagalu: The Final Chapter",
          order: 3,
          published: false,
          owned: false,
          price: 399,
          image:
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
        },
      ],
    },
  };

  return seriesData[bookId] || null;
};

export function BookSeries({ book, className = "" }: BookSeriesProps) {
  const series = getBookSeries(book.id);

  if (!series) return null;

  const completedBooks = series.books.filter(
    (b) => b.owned && b.published,
  ).length;
  const publishedBooks = series.books.filter((b) => b.published).length;
  const progress = (completedBooks / publishedBooks) * 100;

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          Book Series
        </CardTitle>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{series.seriesName}</span>
            <Badge variant="outline">
              {completedBooks}/{publishedBooks} read
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {series.books.map((seriesBook) => (
          <div
            key={seriesBook.id}
            className={`flex items-center space-x-3 p-3 rounded-lg border ${
              seriesBook.id === book.id
                ? "bg-blue-50 border-blue-200"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="w-12 h-16 flex-shrink-0">
              <img
                src={seriesBook.image}
                alt={seriesBook.title}
                className="w-full h-full object-cover rounded"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium">
                  Book {seriesBook.order}
                </span>
                {seriesBook.owned && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                {seriesBook.id === book.id && (
                  <Badge className="text-xs">Current</Badge>
                )}
              </div>
              <h4 className="font-medium text-sm line-clamp-2 mb-1">
                {seriesBook.title}
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-brand-600">
                  ₹{seriesBook.price}
                </span>
                {!seriesBook.published ? (
                  <Badge variant="secondary" className="text-xs">
                    Coming Soon
                  </Badge>
                ) : seriesBook.owned ? (
                  <Badge className="text-xs bg-green-500">Owned</Badge>
                ) : seriesBook.id !== book.id ? (
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/book/${seriesBook.id}`}>
                      View
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        ))}

        {/* Series Actions */}
        <div className="flex flex-col space-y-2 pt-2 border-t">
          <Button variant="outline" size="sm" className="w-full">
            <BookOpen className="w-4 h-4 mr-2" />
            View Complete Series
          </Button>
          {completedBooks < publishedBooks && (
            <Button size="sm" className="w-full">
              Buy Next Book (
              {series.books.find((b) => !b.owned && b.published)?.title})
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
