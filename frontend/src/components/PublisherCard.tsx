import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, BookOpen, MapPin, Calendar } from "lucide-react";
import { getPublisherPath } from "@/utils/slugify";

interface Publisher {
  id: string;
  name: string;
  nameTelugu?: string;
  image?: string;
  established: number;
  location: string;
  specialization: string;
  booksPublished: number;
  description?: string;
  descriptionTelugu?: string;
}

interface PublisherCardProps {
  publisher: Publisher;
  variant?: "default" | "compact" | "detailed";
}

export function PublisherCard({
  publisher,
  variant = "default",
}: PublisherCardProps) {
  if (variant === "compact") {
    return (
      <Link
        to={getPublisherPath(publisher.name)}
        className="group block transform transition-all duration-300 hover:scale-105"
      >
        <Card className="h-full border-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
          <CardContent className="p-5">
            {/* Publisher Image */}
            <div className="relative mb-4 h-24 rounded-xl overflow-hidden shadow-md">
              {publisher.image ? (
                <img
                  src={publisher.image}
                  alt={publisher.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
              )}
            </div>

            {/* Publisher Name */}
            <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors duration-200 mb-1 line-clamp-2">
              {publisher.name}
            </h3>

            {/* Location */}
            <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
              <MapPin className="w-3 h-3" />
              {publisher.location}
            </p>

            {/* Books Count */}
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {publisher.booksPublished} books
            </p>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === "detailed") {
    return (
      <Link
        to={getPublisherPath(publisher.name)}
        className="group block transform transition-all duration-300 hover:scale-[1.02]"
      >
        <Card className="h-full border-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            {/* Publisher Image */}
            <div className="relative h-48 overflow-hidden">
              {publisher.image ? (
                <img
                  src={publisher.image}
                  alt={publisher.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
                  <Building2 className="w-16 h-16 text-white" />
                </div>
              )}
            </div>

            {/* Publisher Details */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors duration-200 mb-1">
                    {publisher.name}
                  </h3>
                  {publisher.nameTelugu && (
                    <p className="text-gray-600 telugu-text">
                      {publisher.nameTelugu}
                    </p>
                  )}
                </div>

                <Badge variant="outline" className="rounded-full">
                  Est. {publisher.established}
                </Badge>
              </div>

              {/* Specialization */}
              <Badge className="mb-3 rounded-full bg-brand-100 text-brand-700 hover:bg-brand-200">
                {publisher.specialization}
              </Badge>

              {/* Description */}
              {publisher.description && (
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {publisher.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{publisher.booksPublished} books</span>
                </div>

                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{publisher.location}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date().getFullYear() - publisher.established} years
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Default variant
  return (
    <Link
      to={getPublisherPath(publisher.name)}
      className="group block transform transition-all duration-300 hover:scale-105"
    >
      <Card className="h-full border-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          {/* Publisher Image */}
          <div className="relative h-32 overflow-hidden">
            {publisher.image ? (
              <img
                src={publisher.image}
                alt={publisher.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
                <Building2 className="w-12 h-12 text-white" />
              </div>
            )}
          </div>

          {/* Publisher Details */}
          <div className="p-5">
            {/* Publisher Name */}
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition-colors duration-200 mb-1 line-clamp-2">
              {publisher.name}
            </h3>

            {/* Telugu Name */}
            {publisher.nameTelugu && (
              <p className="text-sm text-gray-600 telugu-text mb-2">
                {publisher.nameTelugu}
              </p>
            )}

            {/* Specialization */}
            <Badge className="mb-3 rounded-full bg-brand-100 text-brand-700 hover:bg-brand-200">
              {publisher.specialization}
            </Badge>

            {/* Description Preview */}
            {publisher.description && (
              <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                {publisher.description}
              </p>
            )}

            {/* Stats */}
            <div className="space-y-1 text-xs text-gray-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  <span>{publisher.booksPublished} books</span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Est. {publisher.established}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{publisher.location}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
