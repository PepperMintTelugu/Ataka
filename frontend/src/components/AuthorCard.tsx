import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, BookOpen, Award } from "lucide-react";
import { getAuthorPath } from "@/utils/slugify";

interface Author {
  id: string;
  name: string;
  nameTelugu?: string;
  image?: string;
  bio?: string;
  bioTelugu?: string;
  booksCount: number;
  specialization: string;
  birthYear?: number;
  awards?: string[];
}

interface AuthorCardProps {
  author: Author;
  variant?: "default" | "compact" | "detailed";
}

export function AuthorCard({ author, variant = "default" }: AuthorCardProps) {
  if (variant === "compact") {
    return (
      <Link
        to={getAuthorPath(author.name)}
        className="group block transform transition-all duration-300 hover:scale-105"
      >
        <Card className="h-full border-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
          <CardContent className="p-6 text-center">
            {/* Circular Author Image */}
            <div className="relative mx-auto mb-4 w-20 h-20 rounded-full overflow-hidden shadow-lg">
              {author.image ? (
                <img
                  src={author.image}
                  alt={author.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-brand-500 to-telugu-500 flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              )}
            </div>

            {/* Author Name */}
            <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors duration-200 mb-1">
              {author.name}
            </h3>

            {/* Telugu Name */}
            {author.nameTelugu && (
              <p className="text-sm text-gray-600 telugu-text mb-2">
                {author.nameTelugu}
              </p>
            )}

            {/* Books Count */}
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <BookOpen className="w-3 h-3" />
              {author.booksCount} books
            </p>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === "detailed") {
    return (
      <Link
        to={getAuthorPath(author.name)}
        className="group block transform transition-all duration-300 hover:scale-[1.02]"
      >
        <Card className="h-full border-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              {/* Circular Author Image */}
              <div className="relative flex-shrink-0 w-24 h-24 rounded-full overflow-hidden shadow-lg">
                {author.image ? (
                  <img
                    src={author.image}
                    alt={author.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-500 to-telugu-500 flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>

              {/* Author Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors duration-200">
                      {author.name}
                    </h3>
                    {author.nameTelugu && (
                      <p className="text-gray-600 telugu-text text-lg">
                        {author.nameTelugu}
                      </p>
                    )}
                  </div>

                  {author.birthYear && (
                    <Badge variant="outline" className="rounded-full">
                      b. {author.birthYear}
                    </Badge>
                  )}
                </div>

                {/* Specialization */}
                <Badge className="mb-3 rounded-full bg-brand-100 text-brand-700 hover:bg-brand-200">
                  {author.specialization}
                </Badge>

                {/* Bio */}
                {author.bio && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {author.bio}
                  </p>
                )}

                {/* Stats and Awards */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{author.booksCount} books</span>
                  </div>

                  {author.awards && author.awards.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      <span>{author.awards.length} awards</span>
                    </div>
                  )}
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
      to={getAuthorPath(author.name)}
      className="group block transform transition-all duration-300 hover:scale-105"
    >
      <Card className="h-full border-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
        <CardContent className="p-6 text-center">
          {/* Circular Author Image */}
          <div className="relative mx-auto mb-4 w-24 h-24 rounded-full overflow-hidden shadow-lg">
            {author.image ? (
              <img
                src={author.image}
                alt={author.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brand-500 to-telugu-500 flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
            )}
          </div>

          {/* Author Name */}
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition-colors duration-200 mb-1">
            {author.name}
          </h3>

          {/* Telugu Name */}
          {author.nameTelugu && (
            <p className="text-sm text-gray-600 telugu-text mb-3">
              {author.nameTelugu}
            </p>
          )}

          {/* Specialization */}
          <Badge className="mb-3 rounded-full bg-brand-100 text-brand-700 hover:bg-brand-200">
            {author.specialization}
          </Badge>

          {/* Bio Preview */}
          {author.bio && (
            <p className="text-xs text-gray-500 line-clamp-2 mb-3">
              {author.bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>{author.booksCount} books</span>
            </div>

            {author.awards && author.awards.length > 0 && (
              <div className="flex items-center gap-1">
                <Award className="w-3 h-3" />
                <span>{author.awards.length} awards</span>
              </div>
            )}
          </div>

          {/* Birth Year */}
          {author.birthYear && (
            <p className="text-xs text-gray-400 mt-2">
              Born {author.birthYear}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
