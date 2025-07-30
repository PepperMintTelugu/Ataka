import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Heart,
  GraduationCap,
  Baby,
  History,
  Brain,
  User,
  Sparkles,
  Coins,
  Drama,
  BookOpenCheck,
  Microscope,
  HeartHandshake,
  ChefHat,
  MapPin,
  HandHeart,
  Briefcase,
  Laptop,
  Palette,
  Music,
} from "lucide-react";

interface CategoryDisplay {
  categoryId: string;
  name: string;
  nameTelugu?: string;
  description?: string;
  descriptionTelugu?: string;
  image?: string;
  icon?: string;
  color: string;
  isActive: boolean;
  order: number;
}

interface CategoriesSectionProps {
  title: string;
  titleTelugu?: string;
  categories: CategoryDisplay[];
  settings?: {
    layout?: "grid" | "carousel";
    itemsPerRow?: number;
    showDescription?: boolean;
    showIcons?: boolean;
  };
}

const iconMap: Record<string, React.ReactNode> = {
  literature: <BookOpen className="w-8 h-8" />,
  poetry: <Heart className="w-8 h-8" />,
  devotional: <Sparkles className="w-8 h-8" />,
  educational: <GraduationCap className="w-8 h-8" />,
  children: <Baby className="w-8 h-8" />,
  history: <History className="w-8 h-8" />,
  philosophy: <Brain className="w-8 h-8" />,
  biography: <User className="w-8 h-8" />,
  budget: <Coins className="w-8 h-8" />,
  drama: <Drama className="w-8 h-8" />,
  fiction: <BookOpenCheck className="w-8 h-8" />,
  science: <Microscope className="w-8 h-8" />,
  health: <HeartHandshake className="w-8 h-8" />,
  cooking: <ChefHat className="w-8 h-8" />,
  travel: <MapPin className="w-8 h-8" />,
  "self-help": <HandHeart className="w-8 h-8" />,
  business: <Briefcase className="w-8 h-8" />,
  technology: <Laptop className="w-8 h-8" />,
  art: <Palette className="w-8 h-8" />,
  music: <Music className="w-8 h-8" />,
};

export default function CategoriesSection({
  title,
  titleTelugu,
  categories = [],
  settings = {
    layout: "grid",
    itemsPerRow: 4,
    showDescription: true,
    showIcons: true,
  },
}: CategoriesSectionProps) {
  const activeCategories = categories
    .filter((category) => category.isActive)
    .sort((a, b) => a.order - b.order);

  // Default categories if none configured
  const defaultCategories = [
    {
      categoryId: "literature",
      name: "Literature",
      nameTelugu: "సాహిత్యం",
      description: "Classic and contemporary Telugu literature",
      descriptionTelugu: "క్లాసిక్ మరియు సమకాలీన తెలుగు సాహిత్యం",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      icon: "literature",
      color: "#3B82F6",
      isActive: true,
      order: 1,
    },
    {
      categoryId: "poetry",
      name: "Poetry",
      nameTelugu: "కవిత్వం",
      description: "Beautiful Telugu poems and verses",
      descriptionTelugu: "అందమైన తెలుగు కవితలు మరియు పద్యాలు",
      image:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop",
      icon: "poetry",
      color: "#EC4899",
      isActive: true,
      order: 2,
    },
    {
      categoryId: "devotional",
      name: "Devotional",
      nameTelugu: "భక్తి",
      description: "Spiritual and devotional books",
      descriptionTelugu: "ఆధ్యాత్మిక మరియు భక్తి పుస్తకాలు",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      icon: "devotional",
      color: "#F59E0B",
      isActive: true,
      order: 3,
    },
    {
      categoryId: "educational",
      name: "Educational",
      nameTelugu: "విద్యా",
      description: "Educational and academic books",
      descriptionTelugu: "విద్యా మరియు అకాడమిక్ పుస్తకాలు",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      icon: "educational",
      color: "#10B981",
      isActive: true,
      order: 4,
    },
    {
      categoryId: "children",
      name: "Children",
      nameTelugu: "పిల్లలు",
      description: "Books for children and young readers",
      descriptionTelugu: "పిల్లలు మరియు యువ పాఠకుల కోసం పుస్తకాలు",
      image:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
      icon: "children",
      color: "#8B5CF6",
      isActive: true,
      order: 5,
    },
    {
      categoryId: "history",
      name: "History",
      nameTelugu: "చరిత్ర",
      description: "Historical books and biographies",
      descriptionTelugu: "చారిత్రక పుస్తకాలు మరియు జీవిత చరిత్రలు",
      image:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=300&fit=crop",
      icon: "history",
      color: "#EF4444",
      isActive: true,
      order: 6,
    },
    {
      categoryId: "philosophy",
      name: "Philosophy",
      nameTelugu: "తత్వశాస్త్రం",
      description: "Philosophical and thought-provoking books",
      descriptionTelugu: "తత్వశాస్త్ర మరియు ఆలోచనా ప్రేరేపణ పుస్తకాలు",
      image:
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop",
      icon: "philosophy",
      color: "#06B6D4",
      isActive: true,
      order: 7,
    },
    {
      categoryId: "biography",
      name: "Biography",
      nameTelugu: "జీవిత చరిత్ర",
      description: "Life stories of great personalities",
      descriptionTelugu: "గొప్ప వ్యక్తుల జీవిత కథలు",
      image:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&h=300&fit=crop",
      icon: "biography",
      color: "#84CC16",
      isActive: true,
      order: 8,
    },
    {
      categoryId: "under-150",
      name: "Books Under ₹150",
      nameTelugu: "₹150 లోపు పుస్తకాలు",
      description: "Great books at affordable prices",
      descriptionTelugu: "సరసమైన ధరలలో అద్భుతమైన పుస్తకాలు",
      image:
        "https://images.pexels.com/photos/5632401/pexels-photo-5632401.jpeg?w=400&h=300&fit=crop",
      icon: "budget",
      color: "#F97316",
      isActive: true,
      order: 9,
    },
    {
      categoryId: "drama",
      name: "Drama & Theatre",
      nameTelugu: "నాటకం & రంగస్థలం",
      description: "Telugu plays and theatrical works",
      descriptionTelugu: "తెలుగు నాటకాలు మరియు రంగస్థల రచనలు",
      image:
        "https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=400&h=300&fit=crop",
      icon: "drama",
      color: "#DC2626",
      isActive: true,
      order: 10,
    },
    {
      categoryId: "fiction",
      name: "Fiction",
      nameTelugu: "కల్పిత కథలు",
      description: "Contemporary Telugu fiction and novels",
      descriptionTelugu: "సమకాలీన తెలుగు కల్పిత కథలు మరియు నవలలు",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      icon: "fiction",
      color: "#7C3AED",
      isActive: true,
      order: 11,
    },
    {
      categoryId: "science",
      name: "Science",
      nameTelugu: "వైజ్ఞానిక",
      description: "Science books and research publications",
      descriptionTelugu: "విజ్ఞాన పుస్తకాలు మరియు పరిశోధన ప్రచురణలు",
      image:
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop",
      icon: "science",
      color: "#059669",
      isActive: true,
      order: 12,
    },
    {
      categoryId: "health",
      name: "Health & Wellness",
      nameTelugu: "ఆరోగ్యం & శ్రేయస్సు",
      description: "Health, fitness and wellness guides",
      descriptionTelugu: "ఆరోగ్యం, ఫిట్నెస్ మరియు శ్రేయస్సు గైడ్లు",
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
      icon: "health",
      color: "#16A34A",
      isActive: true,
      order: 13,
    },
    {
      categoryId: "cooking",
      name: "Cooking",
      nameTelugu: "వంట",
      description: "Telugu recipes and cooking guides",
      descriptionTelugu: "తెలుగు వంటకాలు మరియు వంట గైడ్లు",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      icon: "cooking",
      color: "#EA580C",
      isActive: true,
      order: 14,
    },
    {
      categoryId: "self-help",
      name: "Self Help",
      nameTelugu: "స్వయం సహాయం",
      description: "Personal development and motivational books",
      descriptionTelugu: "వ్యక్తిగత అభివృద్ధి మరియు ప్రేరణాత్మక పుస్తకాలు",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      icon: "self-help",
      color: "#0EA5E9",
      isActive: true,
      order: 15,
    },
  ];

  const displayCategories =
    activeCategories.length > 0 ? activeCategories : defaultCategories;

  if (displayCategories.length === 0) {
    return null;
  }

  const gridCols = `grid-cols-2 lg:grid-cols-${Math.min(settings.itemsPerRow || 4, 4)}`;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          {titleTelugu && (
            <p className="text-xl text-gray-600 telugu-text">{titleTelugu}</p>
          )}
          <div className="w-24 h-1 bg-gradient-to-r from-brand-500 to-telugu-500 mx-auto mt-4"></div>
        </div>

        {/* Categories Grid */}
        <div className={cn("grid gap-6", gridCols)}>
          {displayCategories.map((category) => (
            <CategoryCard
              key={category.categoryId}
              category={category}
              settings={settings}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Category Card Component
function CategoryCard({
  category,
  settings,
}: {
  category: CategoryDisplay;
  settings: any;
}) {
  return (
    <Link
      to={`/shop?category=${category.categoryId}`}
      className="group block transform transition-all duration-300 hover:scale-105"
    >
      <Card className="border-0 shadow-md group-hover:shadow-xl transition-shadow duration-300 overflow-hidden rounded-2xl">
        {/* Category Image/Icon - Smaller square format */}
        <div className="relative aspect-square overflow-hidden">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div
              className="w-full h-full bg-gradient-to-br flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${category.color}CC, ${category.color}99)`,
              }}
            >
              {settings.showIcons && iconMap[category.icon || "literature"] && (
                <div className="text-white">
                  {iconMap[category.icon || "literature"]}
                </div>
              )}
            </div>
          )}

          {/* Subtle overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

          {/* Icon in corner if image exists */}
          {settings.showIcons && category.image && (
            <div className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 text-white">
              <div className="w-5 h-5">
                {iconMap[category.icon || "literature"]}
              </div>
            </div>
          )}

          {/* Category Name overlay */}
          <div className="absolute bottom-2 left-2 right-2">
            <h3 className="text-sm font-bold text-white group-hover:text-yellow-300 transition-colors duration-200 line-clamp-2">
              {category.name}
            </h3>
            {category.nameTelugu && (
              <p className="text-xs text-gray-200 telugu-text line-clamp-1">
                {category.nameTelugu}
              </p>
            )}
          </div>
        </div>

        {/* Compact footer with hover effect */}
        <div className="p-3">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div
              className="w-full h-0.5 rounded-full mb-2"
              style={{ backgroundColor: category.color }}
            ></div>
            <div className="flex items-center justify-center gap-1">
              <p
                className="text-xs font-medium"
                style={{ color: category.color }}
              >
                Explore Books
              </p>
              <BookOpen className="w-3 h-3" style={{ color: category.color }} />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
