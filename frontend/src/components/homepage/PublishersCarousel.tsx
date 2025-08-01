import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Building2,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Publisher {
  id: string;
  name: string;
  nameTelugu?: string;
  logo?: string;
  description?: string;
  descriptionTelugu?: string;
  website?: string;
  booksCount: number;
  isActive: boolean;
  order: number;
}

interface PublishersCarouselProps {
  title: string;
  titleTelugu?: string;
  publishers: Publisher[];
  settings?: {
    itemsPerView?: number;
    showNavigation?: boolean;
    autoScroll?: boolean;
    scrollSpeed?: number;
  };
}

export default function PublishersCarousel({
  title,
  titleTelugu,
  publishers = [],
  settings = {
    itemsPerView: 4,
    showNavigation: true,
    autoScroll: false,
    scrollSpeed: 4000,
  },
}: PublishersCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activePublishers = publishers
    .filter((publisher) => publisher.isActive)
    .sort((a, b) => a.order - b.order);

  // Default publishers if none configured
  const defaultPublishers = [
    {
      id: "dc-books",
      name: "DC Books",
      nameTelugu: "డీసీ బుక్స్",
      logo: "https://images.unsplash.com/photo-1568667256549-094345857637?w=200&h=120&fit=crop",
      description:
        "Leading publisher of Telugu literature and educational books",
      descriptionTelugu:
        "తెలుగు సాహిత్యం మరియు విద్యా పుస్తకాలకు ప్రముఖ ప్రచురణకర్త",
      website: "https://dcbooks.com",
      booksCount: 1250,
      isActive: true,
      order: 1,
    },
    {
      id: "national-book-trust",
      name: "National Book Trust",
      nameTelugu: "నేషనల్ బుక్ ట్రస్ట్",
      logo: "https://images.unsplash.com/photo-1551029506-0807df4e2031?w=200&h=120&fit=crop",
      description: "Promoting reading culture and publishing quality books",
      descriptionTelugu:
        "పఠన సంస్కృతిని ప్రోత్సహించడం మరియు నాణ్యమైన పుస్తకాలను ప్రచురించడం",
      website: "https://nbtindia.gov.in",
      booksCount: 890,
      isActive: true,
      order: 2,
    },
    {
      id: "emesco-books",
      name: "Emesco Books",
      nameTelugu: "ఎమెస్కో బుక్స్",
      logo: "https://images.unsplash.com/photo-1586809446780-b9b46b3a9b86?w=200&h=120&fit=crop",
      description: "Educational and competitive exam books",
      descriptionTelugu: "విద్యా మరియు పోటీ పరీక్షల పుస్తకాలు",
      website: "https://emescobooks.com",
      booksCount: 650,
      isActive: true,
      order: 3,
    },
    {
      id: "andhra-pradesh-sahitya-akademi",
      name: "AP Sahitya Akademi",
      nameTelugu: "ఆంధ్రప్రదేశ్ సాహిత్య అకాడమీ",
      logo: "https://images.unsplash.com/photo-1599582909646-1b6e6ebcdb41?w=200&h=120&fit=crop",
      description: "Promoting Telugu literature and culture",
      descriptionTelugu: "తెలుగు సాహిత్యం మరియు సంస్కృతిని ప్రోత్సహించడం",
      website: "https://apsahityaakademi.gov.in",
      booksCount: 1100,
      isActive: true,
      order: 4,
    },
    {
      id: "visalandhra-publications",
      name: "Visalandhra Publications",
      nameTelugu: "విశాలాంధ్ర పబ్లికేషన్స్",
      logo: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=120&fit=crop",
      description: "Classic and contemporary Telugu literature",
      descriptionTelugu: "క్లాసిక్ మరియు సమకాలీన తెలుగు సాహిత్యం",
      website: "https://visalandhra.com",
      booksCount: 780,
      isActive: true,
      order: 5,
    },
    {
      id: "pragati-book-house",
      name: "Pragati Book House",
      nameTelugu: "ప్రగతి బుక్ హౌస్",
      logo: "https://images.unsplash.com/photo-1491841573337-28ac40d1e713?w=200&h=120&fit=crop",
      description: "Educational and reference books",
      descriptionTelugu: "విద్యా మరియు సమాచార పుస్తకాలు",
      website: "https://pragatibooks.com",
      booksCount: 920,
      isActive: true,
      order: 6,
    },
  ];

  const displayPublishers =
    activePublishers.length > 0 ? activePublishers : defaultPublishers;

  const itemsPerView = Math.min(
    settings.itemsPerView || 4,
    displayPublishers.length,
  );
  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < displayPublishers.length - itemsPerView;

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

  if (displayPublishers.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          {titleTelugu && (
            <p className="text-xl text-gray-600 telugu-text">{titleTelugu}</p>
          )}
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mt-4"></div>
        </div>

        {/* Publishers Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {settings.showNavigation &&
            displayPublishers.length > itemsPerView && (
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

          {/* Publishers Grid - Desktop/Tablet Carousel */}
          <div className="hidden md:block">
            <div
              ref={scrollContainerRef}
              className="grid auto-cols-fr gap-6 px-12"
              style={{
                gridTemplateColumns: `repeat(${Math.min(itemsPerView, displayPublishers.length)}, 1fr)`,
              }}
            >
              {displayPublishers
                .slice(currentIndex, currentIndex + itemsPerView)
                .map((publisher) => (
                  <PublisherCard key={publisher.id} publisher={publisher} />
                ))}
            </div>
          </div>

          {/* Publishers Grid - Mobile 2 Columns */}
          <div className="md:hidden px-4">
            <div className="grid grid-cols-2 gap-4">
              {displayPublishers.slice(0, 6).map((publisher) => (
                <PublisherCard
                  key={publisher.id}
                  publisher={publisher}
                  variant="mobile"
                />
              ))}
            </div>
          </div>
        </div>

        {/* View All Publishers Button */}
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link to="/publishers">
              View All Publishers
              <Building2 className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// Publisher Card Component
function PublisherCard({
  publisher,
  variant = "default",
}: {
  publisher: Publisher;
  variant?: "default" | "mobile";
}) {
  return (
    <Link
      to={`/publisher/${publisher.id}/books`}
      className="group block transform transition-all duration-300 hover:scale-105"
    >
      <Card className="h-full border-0 shadow-md group-hover:shadow-xl transition-shadow duration-300 bg-white">
        <CardContent className={variant === "mobile" ? "p-3" : "p-6"}>
          {/* Publisher Logo/Image */}
          <div
            className={`relative mb-3 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center ${variant === "mobile" ? "h-16" : "h-24"}`}
          >
            <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100 group-hover:bg-gray-50 transition-colors duration-300">
              {publisher.logo ? (
                <img
                  src={publisher.logo}
                  alt={publisher.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-white" />
                </div>
              )}
            </div>

            {/* Books Count Badge */}
            <Badge className="absolute -bottom-2 -right-2 bg-blue-500 hover:bg-blue-600 text-white">
              {publisher.booksCount} books
            </Badge>
          </div>

          {/* Publisher Name */}
          <h3
            className={`font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-1 line-clamp-2 ${variant === "mobile" ? "text-sm" : "text-lg"}`}
          >
            {publisher.name}
          </h3>

          {/* Telugu Name */}
          {publisher.nameTelugu && (
            <p
              className={`text-gray-600 telugu-text mb-2 ${variant === "mobile" ? "text-xs" : "text-sm"}`}
            >
              {publisher.nameTelugu}
            </p>
          )}

          {/* Description - Hide on mobile for space */}
          {publisher.description && variant !== "mobile" && (
            <p className="text-xs text-gray-500 line-clamp-2 mb-3">
              {publisher.description}
            </p>
          )}

          {/* Stats */}
          <div
            className={`flex items-center justify-center gap-1 text-blue-600 mb-2 ${variant === "mobile" ? "text-xs" : "text-sm"}`}
          >
            <BookOpen
              className={variant === "mobile" ? "w-3 h-3" : "w-4 h-4"}
            />
            <span>{publisher.booksCount} books</span>
          </div>

          {/* Hover Effect */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-full h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-2"></div>
            <div className="flex items-center justify-center gap-1">
              <p className="text-xs text-blue-600 font-medium">View Books</p>
              <BookOpen className="w-3 h-3 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
