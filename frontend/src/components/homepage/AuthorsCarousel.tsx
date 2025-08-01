import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, BookOpen, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Author {
  id: string;
  name: string;
  nameTelugu?: string;
  image?: string;
  bio?: string;
  bioTelugu?: string;
  booksCount: number;
  isActive: boolean;
  order: number;
}

interface AuthorsCarouselProps {
  title: string;
  titleTelugu?: string;
  authors: Author[];
  settings?: {
    itemsPerView?: number;
    showNavigation?: boolean;
    autoScroll?: boolean;
    scrollSpeed?: number;
  };
}

export default function AuthorsCarousel({
  title,
  titleTelugu,
  authors = [],
  settings = {
    itemsPerView: 5,
    showNavigation: true,
    autoScroll: false,
    scrollSpeed: 3000,
  },
}: AuthorsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeAuthors = authors
    .filter((author) => author.isActive)
    .sort((a, b) => a.order - b.order);

  // Default authors if none configured
  const defaultAuthors = [
    {
      id: "viswanatha-satyanarayana",
      name: "Viswanatha Satyanarayana",
      nameTelugu: "విశ్వనాథ సత్యనారాయణ",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      bio: "Jnanpith Award winner and renowned Telugu author",
      bioTelugu: "జ్ఞానపీఠ పురస్కార గ్రహీత మరియు ప్రఖ్యాత తెలుగు రచయిత",
      booksCount: 45,
      isActive: true,
      order: 1,
    },
    {
      id: "gurajada-apparao",
      name: "Gurajada Apparao",
      nameTelugu: "గురజాడ అప్పారావు",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      bio: "Pioneer of modern Telugu literature",
      bioTelugu: "ఆధునిక తెలుగు సాహిత్య పితామహుడు",
      booksCount: 32,
      isActive: true,
      order: 2,
    },
    {
      id: "devulapalli-krishnasastri",
      name: "Devulapalli Krishnasastri",
      nameTelugu: "దేవులపల్లి కృష్ణశాస్త్రి",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
      bio: "Renowned poet and freedom fighter",
      bioTelugu: "ప్రఖ్యాత కవి మరియు స్వాతంత్ర్య సమరయోధుడు",
      booksCount: 28,
      isActive: true,
      order: 3,
    },
    {
      id: "sri-sri",
      name: "Sri Sri",
      nameTelugu: "శ్రీశ్రీ",
      image:
        "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200&h=200&fit=crop&crop=face",
      bio: "Revolutionary poet and progressive writer",
      bioTelugu: "విప్��వకవి మరియు ప్రగతిశీల రచయిత",
      booksCount: 38,
      isActive: true,
      order: 4,
    },
    {
      id: "yandamuri-veerendranath",
      name: "Yandamuri Veerendranath",
      nameTelugu: "యండమూరి వీరేంద్రనాథ్",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
      bio: "Contemporary novelist and screenwriter",
      bioTelugu: "సమకాలీన నవలా రచయిత మరియు రచనా రచయిత",
      booksCount: 52,
      isActive: true,
      order: 5,
    },
    {
      id: "chalam",
      name: "Chalam",
      nameTelugu: "చలం",
      image:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=200&h=200&fit=crop&crop=face",
      bio: "Controversial and progressive writer",
      bioTelugu: "వివాదాస్పద మరియు ప్రగతిశీల రచయిత",
      booksCount: 24,
      isActive: true,
      order: 6,
    },
  ];

  const displayAuthors =
    activeAuthors.length > 0 ? activeAuthors : defaultAuthors;

  const itemsPerView = Math.min(
    settings.itemsPerView || 5,
    displayAuthors.length,
  );
  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < displayAuthors.length - itemsPerView;

  const scrollLeft = () => {
    if (canScrollLeft) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const scrollRight = () => {
    if (canScrollRight) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (displayAuthors.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          {titleTelugu && (
            <p className="text-xl text-gray-600 telugu-text">{titleTelugu}</p>
          )}
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto mt-4"></div>
        </div>

        {/* Authors Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {settings.showNavigation && displayAuthors.length > itemsPerView && (
            <>
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={cn(
                  "absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all duration-200",
                  canScrollLeft
                    ? "bg-white hover:bg-gray-50 text-gray-800"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed",
                )}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={cn(
                  "absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all duration-200",
                  canScrollRight
                    ? "bg-white hover:bg-gray-50 text-gray-800"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed",
                )}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Authors Grid - Desktop/Tablet Carousel */}
          <div className="hidden md:block">
            <div
              ref={scrollContainerRef}
              className="grid auto-cols-fr gap-6 px-12"
              style={{
                gridTemplateColumns: `repeat(${Math.min(itemsPerView, displayAuthors.length)}, 1fr)`,
              }}
            >
              {displayAuthors
                .slice(currentIndex, currentIndex + itemsPerView)
                .map((author) => (
                  <AuthorCard key={author.id} author={author} />
                ))}
            </div>
          </div>

          {/* Authors Grid - Mobile 2 Columns */}
          <div className="md:hidden px-4">
            <div className="grid grid-cols-2 gap-4">
              {displayAuthors.slice(0, 6).map((author) => (
                <AuthorCard key={author.id} author={author} variant="mobile" />
              ))}
            </div>
          </div>
        </div>

        {/* View All Authors Button */}
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link to="/authors">
              View All Authors
              <BookOpen className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// Author Card Component
function AuthorCard({
  author,
  variant = "default",
}: {
  author: Author;
  variant?: "default" | "mobile";
}) {
  return (
    <Link
      to={`/authors/${author.id}`}
      className="group block transform transition-all duration-300 hover:scale-105"
    >
      <Card className="h-full border-0 shadow-md group-hover:shadow-xl transition-shadow duration-300 bg-white">
        <CardContent
          className={
            variant === "mobile" ? "p-3 text-center" : "p-6 text-center"
          }
        >
          {/* Author Image */}
          <div className="relative mb-3">
            <div
              className={`mx-auto rounded-full overflow-hidden border-4 border-purple-200 group-hover:border-purple-400 transition-colors duration-300 ${variant === "mobile" ? "w-16 h-16" : "w-24 h-24"}`}
            >
              {author.image ? (
                <img
                  src={author.image}
                  alt={author.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Books Count Badge */}
          <Badge className="mt-2 mb-1 bg-purple-500 hover:bg-purple-600 text-white text-xs">
            {author.booksCount} books
          </Badge>

          {/* Author Name */}
          <h3
            className={`font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-200 mb-1 ${variant === "mobile" ? "text-sm" : "text-lg"}`}
          >
            {author.name}
          </h3>

          {/* Telugu Name */}
          {author.nameTelugu && (
            <p
              className={`text-gray-600 telugu-text mb-2 ${variant === "mobile" ? "text-xs" : "text-sm"}`}
            >
              {author.nameTelugu}
            </p>
          )}

          {/* Bio - Hide on mobile for space */}
          {author.bio && variant !== "mobile" && (
            <p className="text-xs text-gray-500 line-clamp-2 mb-3">
              {author.bio}
            </p>
          )}

          {/* Books Count */}
          <div
            className={`flex items-center justify-center gap-1 text-purple-600 ${variant === "mobile" ? "text-xs" : "text-sm"}`}
          >
            <BookOpen
              className={variant === "mobile" ? "w-3 h-3" : "w-4 h-4"}
            />
            <span>{author.booksCount} books</span>
          </div>

          {/* Call to action - Only on desktop */}
          {variant !== "mobile" && (
            <p className="text-xs text-purple-600 mt-2 font-medium">
              Click to view books →
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
