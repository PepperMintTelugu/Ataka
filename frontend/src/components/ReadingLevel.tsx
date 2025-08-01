import React from "react";
import { GraduationCap, Users, Baby, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Book } from "@/types/book";

interface ReadingLevelProps {
  book: Book;
  variant?: "badge" | "card";
  className?: string;
}

interface ReadingLevel {
  id: string;
  name: string;
  nameTeugu: string;
  ageRange: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  description: string;
}

const readingLevels: ReadingLevel[] = [
  {
    id: "children",
    name: "Children's Books",
    nameTeugu: "పిల్లల పుస్తకాలు",
    ageRange: "3-8 years",
    icon: Baby,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
    description: "Simple stories with pictures, basic vocabulary",
  },
  {
    id: "young-readers",
    name: "Young Readers",
    nameTeugu: "చిన్న పాఠకులు",
    ageRange: "8-12 years",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description: "Chapter books, early novels, educational content",
  },
  {
    id: "teens",
    name: "Teen & Young Adult",
    nameTeugu: "యువత",
    ageRange: "13-18 years",
    icon: GraduationCap,
    color: "text-green-600",
    bgColor: "bg-green-100",
    description: "Complex themes, character development, life lessons",
  },
  {
    id: "adults",
    name: "Adult Literature",
    nameTeugu: "పెద్దల సాహిత్యం",
    ageRange: "18+ years",
    icon: BookOpen,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    description: "Mature content, complex narratives, philosophical themes",
  },
];

// Function to determine reading level based on book category and content
const getReadingLevel = (book: Book): ReadingLevel => {
  const category = book.category.toLowerCase();

  if (category.includes("children") || category.includes("పిల్లల")) {
    return readingLevels[0]; // Children
  } else if (category.includes("educational") && book.pages < 200) {
    return readingLevels[1]; // Young Readers
  } else if (book.publicationYear > 2010 && book.pages < 300) {
    return readingLevels[2]; // Teens
  } else {
    return readingLevels[3]; // Adults
  }
};

export function ReadingLevel({
  book,
  variant = "badge",
  className = "",
}: ReadingLevelProps) {
  const level = getReadingLevel(book);
  const Icon = level.icon;

  if (variant === "badge") {
    return (
      <Badge
        variant="secondary"
        className={`${level.bgColor} ${level.color} border-0 ${className}`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {level.ageRange}
      </Badge>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${level.bgColor}`}>
            <Icon className={`w-5 h-5 ${level.color}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium text-sm">{level.name}</h4>
              <Badge variant="outline" className="text-xs">
                {level.ageRange}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 telugu-text mb-2">
              {level.nameTeugu}
            </p>
            <p className="text-xs text-gray-500">{level.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Reading Level Filter Component for Shop page
export function ReadingLevelFilter({
  selectedLevel,
  onLevelChange,
}: {
  selectedLevel?: string;
  onLevelChange: (level: string | undefined) => void;
}) {
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm">Reading Level</h4>
      <div className="space-y-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="reading-level"
            checked={!selectedLevel}
            onChange={() => onLevelChange(undefined)}
            className="rounded"
          />
          <span className="text-sm">All Levels</span>
        </label>
        {readingLevels.map((level) => {
          const Icon = level.icon;
          return (
            <label
              key={level.id}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="radio"
                name="reading-level"
                checked={selectedLevel === level.id}
                onChange={() => onLevelChange(level.id)}
                className="rounded"
              />
              <Icon className={`w-4 h-4 ${level.color}`} />
              <span className="text-sm">{level.name}</span>
              <span className="text-xs text-gray-500">({level.ageRange})</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
