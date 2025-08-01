import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookCard } from "@/components/BookCard";
import HeroSlider from "@/components/homepage/HeroSlider";
import CategoriesSection from "@/components/homepage/CategoriesSection";
import AuthorsCarousel from "@/components/homepage/AuthorsCarousel";
import PublishersCarousel from "@/components/homepage/PublishersCarousel";
import StatsSection from "@/components/homepage/StatsSection";
import { useToast } from "@/hooks/use-toast";
import { mockBooks } from "@/data/books";
import { getAuthorPath } from "@/utils/slugify";
import { ArrowRight, Star, Award, ChevronRight, Sparkles } from "lucide-react";
import { Book } from "@/types/book";

interface HomepageSection {
  id: string;
  type: string;
  title?: string;
  titleTelugu?: string;
  subtitle?: string;
  subtitleTelugu?: string;
  isActive: boolean;
  order: number;
  settings: any;
}

interface HomepageConfig {
  siteName: string;
  siteNameTelugu: string;
  sliderImages: any[];
  featuredCategories: any[];
  featuredAuthors: any[];
  featuredPublishers: any[];
  sections: HomepageSection[];
  categoriesTitle: string;
  categoriesTitleTelugu: string;
  authorsTitle: string;
  authorsTitleTelugu: string;
  publishersTitle: string;
  publishersTitleTelugu: string;
}

export default function IndexCustomizable() {
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<HomepageConfig | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading configuration
    const timer = setTimeout(() => {
      setConfig(getDefaultConfig());
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const getDefaultConfig = (): HomepageConfig => {
    return {
      siteName: "Ataka",
      siteNameTelugu: "The Ultimate Bookstore",
      sliderImages: [
        {
          id: "1",
          image:
            "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=600&fit=crop",
          title: "Discover Telugu Literature at Ataka",
          titleTelugu: "అటకలో తెలుగు సాహిత్యాన్ని కనుగొనండి",
          subtitle: "The Ultimate Bookstore for Telugu Literature",
          subtitleTelugu: "తెలుగు సాహిత్యానికి అంతిమ పుస్తక దుకాణం",
          ctaText: "Shop Now",
          ctaLink: "/shop",
          isActive: true,
          order: 1,
        },
      ],
      featuredCategories: [
        {
          categoryId: "literature",
          name: "Literature",
          nameTelugu: "సాహిత్యం",
          description: "Classic and contemporary Telugu literature",
          descriptionTelugu: "క్లాసిక్ మరియు ���మకాలీన తెలుగు సాహిత్యం",
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
          descriptionTelugu: "ఆధ్యా��్మిక మరియు భక్తి పుస్తకాలు",
          image:
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
          icon: "devotional",
          color: "#F59E0B",
          isActive: true,
          order: 3,
        },
        {
          categoryId: "children",
          name: "Children",
          nameTelugu: "పిల్లలు",
          description: "Books for children and young readers",
          descriptionTelugu: "పిల్లలు మర���యు యువ పాఠకుల కోసం పుస్తకాలు",
          image:
            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
          icon: "children",
          color: "#8B5CF6",
          isActive: true,
          order: 4,
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
          order: 5,
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
          order: 6,
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
          order: 7,
        },
        {
          categoryId: "self-help",
          name: "Self Help",
          nameTelugu: "స్వయం సహాయం",
          description: "Personal development and motivational books",
          descriptionTelugu:
            "వ్యక్తిగత అభివృద���ధి మరియు ప్రేరణాత్మక పుస్తకాలు",
          image:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
          icon: "self-help",
          color: "#0EA5E9",
          isActive: true,
          order: 8,
        },
      ],
      featuredAuthors: [
        {
          id: "viswanatha-satyanarayana",
          name: "Viswanatha Satyanarayana",
          nameTelugu: "విశ్వన���థ సత్యనారాయణ",
          image:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
          bio: "Jnanpith Award winner and renowned Telugu author known for his contributions to literature.",
          bioTelugu:
            "జ్ఞానపీఠ పురస్కార విజేత మరియు సాహిత్యానికి చేసిన కృషికి ప్రసిద్ధ తెలుగు రచయిత.",
          booksCount: 25,
          specialization: "Literature",
          birthYear: 1895,
          awards: ["Jnanpith Award", "Sahitya Akademi Award"],
          isActive: true,
          order: 1,
        },
        {
          id: "yandamuri-veerendranath",
          name: "Yandamuri Veerendranath",
          nameTelugu: "యండమూరి వీరేంద్రనాథ",
          image:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
          bio: "Contemporary novelist known for social novels and psychological thrillers.",
          bioTelugu:
            "సామాజిక నవలలు మరియు మానసిక థ్రిల్లర్లకు ప్రసిద్ధ సమకాలీన రచయిత.",
          booksCount: 45,
          specialization: "Fiction",
          birthYear: 1948,
          awards: ["Nandi Award"],
          isActive: true,
          order: 2,
        },
        {
          id: "sri-sri",
          name: "Sri Sri (Srirangam Srinivasa Rao)",
          nameTelugu: "శ్రీశ్రీ (శ్రీరంగం శ్రీనివాస రావు)",
          image:
            "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop&crop=face",
          bio: "Revolutionary poet and writer who transformed modern Telugu poetry.",
          bioTelugu:
            "ఆధునిక తెలుగు కవిత్వాన్ని మార్చివేసిన విప్లవ కవి మరియు రచయిత.",
          booksCount: 30,
          specialization: "Poetry",
          birthYear: 1910,
          awards: ["Sahitya Akademi Award"],
          isActive: true,
          order: 3,
        },
        {
          id: "volga",
          name: "Volga (Popuri Lalitha Kumari)",
          nameTelugu: "వోల్గా (పొప్పూరి లలిత కుమారి)",
          image:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
          bio: "Feminist writer and translator known for her bold and progressive works.",
          bioTelugu:
            "తన ధైర్యవంతమ���న మరియు ప్రగతిశీల రచనలకు ప్రసిద్ధ స్త్రీవాద రచయిత్రి మరియు అనువాదకురాలు.",
          booksCount: 20,
          specialization: "Fiction",
          birthYear: 1950,
          awards: ["Sahitya Akademi Award"],
          isActive: true,
          order: 4,
        },
        {
          id: "annamayya",
          name: "Annamayya",
          nameTelugu: "అన్నమయ్య",
          image:
            "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=300&h=300&fit=crop&crop=face",
          bio: "15th-century mystic poet and composer of devotional songs.",
          bioTelugu:
            "15వ శతాబ్దానికి చెందిన ఆధ్యాత్మిక కవి మరియు భక్తి గీతాల రచయిత.",
          booksCount: 12,
          specialization: "Devotional",
          birthYear: 1408,
          awards: ["Cultural Heritage Award"],
          isActive: true,
          order: 5,
        },
        {
          id: "malladi-venkata-krishnamurthy",
          name: "Malladi Venkata Krishnamurthy",
          nameTelugu: "మల్లాది వెంకట కృష్ణమూర్తి",
          image:
            "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop&crop=face",
          bio: "Contemporary novelist known for his engaging storytelling and social themes.",
          bioTelugu:
            "తన ఆకర్షణీయమైన కథా చె��్పికలు మరియు సామాజిక అంశాలకు ప్రసిద్ధ సమకాలీన రచయిత.",
          booksCount: 40,
          specialization: "Fiction",
          birthYear: 1951,
          awards: ["State Literary Award"],
          isActive: true,
          order: 6,
        },
      ],
      featuredPublishers: [
        {
          id: "vishwakarma-publications",
          name: "Vishwakarma Publications",
          nameTelugu: "విశ్వకర్మ పబ్లికేష���్స్",
          image:
            "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
          established: 1952,
          location: "Hyderabad",
          specialization: "Literature & Poetry",
          booksPublished: 500,
          description:
            "Leading Telugu publisher specializing in classical and contemporary literature.",
          descriptionTelugu:
            "సాంప్రదాయ మరియు సమకాలీన సాహిత్యంలో ప్రత్యేకత కలిగిన ప్రధాన తెలుగు ප్రచురణకర్త.",
          isActive: true,
          order: 1,
        },
        {
          id: "andhra-saraswata-parishad",
          name: "Andhra Saraswata Parishad",
          nameTelugu: "ఆంధ్ర సరస్వత పరిషత్",
          image:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
          established: 1938,
          location: "Vijayawada",
          specialization: "Educational & Cultural",
          booksPublished: 800,
          description:
            "Cultural organization promoting Telugu language and literature through publications.",
          descriptionTelugu:
            "ప������చురణల ద్వా��ా తెలుగు భాష మరియు సాహిత్యాన్ని ప్రోత్సహిస్తున్న సాంస్కృతిక సంస్థ.",
          isActive: true,
          order: 2,
        },
        {
          id: "saraswati-pustakalayam",
          name: "Saraswati Pustakalayam",
          nameTelugu: "సరస్వతి పుస్తకాలయం",
          image:
            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
          established: 1960,
          location: "Hyderabad",
          specialization: "Children's Books",
          booksPublished: 300,
          description:
            "Specializing in children's literature and educational materials.",
          descriptionTelugu:
            "పిల్లల సాహిత్యం మరియు విద్యా సామగ్రిలో ప్రత్యేకత.",
          isActive: true,
          order: 3,
        },
        {
          id: "emesco-books",
          name: "Emesco Books",
          nameTelugu: "ఎమెస్��ో బుక్స్",
          image:
            "https://images.unsplash.com/photo-1509266272358-7701da638078?w=400&h=300&fit=crop",
          established: 1980,
          location: "Vijayawada",
          specialization: "Contemporary Fiction",
          booksPublished: 350,
          description:
            "Modern publisher known for contemporary Telugu fiction and novels.",
          descriptionTelugu:
            "సమకాలీన తెలుగు కల్పిత కథలు మరియు నవలలకు ప్రసిద్ధ ఆధునిక ప్రచురణకర్త.",
          isActive: true,
          order: 4,
        },
        {
          id: "pragati-publications",
          name: "Pragati Publications",
          nameTelugu: "ప్రగతి పబ్లికేషన్స్",
          image:
            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop",
          established: 1990,
          location: "Hyderabad",
          specialization: "Self-Help & Business",
          booksPublished: 180,
          description:
            "Modern publisher focusing on self-help, business, and motivational books.",
          descriptionTelugu:
            "స్వయం సహాయం, వ్యాపారం మరియు ప్రేరణాత్మక పుస్తకాలపై దృష్టి సారించే ఆధునిక ప్రచురణ�����్త.",
          isActive: true,
          order: 5,
        },
        {
          id: "bharathi-book-depot",
          name: "Bharathi Book Depot",
          nameTelugu: "భారతి బుక్ డిపో",
          image:
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
          established: 1955,
          location: "Visakhapatnam",
          specialization: "Devotional Books",
          booksPublished: 300,
          description:
            "Renowned for spiritual and devotional literature in Telugu.",
          descriptionTelugu:
            "తెలుగులో ఆధ్యాత్మిక మరియు భక్తి సాహిత్యానికి ప్రసిద్ధి.",
          isActive: true,
          order: 6,
        },
      ],
      sections: [
        {
          id: "hero-slider",
          type: "hero-slider",
          order: 1,
          isActive: true,
          settings: {},
        },
        {
          id: "categories",
          type: "categories",
          order: 2,
          isActive: true,
          settings: {},
        },
        {
          id: "featured-books",
          type: "featured-books",
          order: 3,
          isActive: true,
          settings: {},
        },
        {
          id: "bestsellers",
          type: "bestsellers",
          order: 4,
          isActive: true,
          settings: {
            atakaRankingCount: 10,
            showRankingBadges: true,
            layout: "grid",
          },
        },
        {
          id: "authors",
          type: "authors",
          order: 5,
          isActive: true,
          settings: {},
        },
        {
          id: "publishers",
          type: "publishers",
          order: 6,
          isActive: true,
          settings: {},
        },
        {
          id: "stats",
          type: "stats",
          order: 7,
          isActive: true,
          settings: {},
        },
        {
          id: "why-choose-us",
          type: "why-choose-us",
          order: 8,
          isActive: true,
          settings: {},
        },
        {
          id: "newsletter",
          type: "newsletter",
          order: 9,
          isActive: true,
          settings: {},
        },
      ],
      categoriesTitle: "Browse Categories",
      categoriesTitleTelugu: "వర్గాలను విహరించండి",
      authorsTitle: "Featured Authors",
      authorsTitleTelugu: "ప్రత్యేక రచయితలు",
      publishersTitle: "Our Publishers",
      publishersTitleTelugu: "మా ప్రచురణకర్తలు",
    };
  };

  const renderSection = (section: HomepageSection) => {
    if (!section.isActive) return null;

    switch (section.type) {
      case "hero-slider":
        return (
          <HeroSlider
            key={section.id}
            images={config?.sliderImages || []}
            settings={section.settings}
          />
        );

      case "categories":
        return (
          <CategoriesSection
            key={section.id}
            title={config?.categoriesTitle || "Browse Categories"}
            titleTelugu={config?.categoriesTitleTelugu}
            categories={config?.featuredCategories || []}
            settings={section.settings}
          />
        );

      case "featured-books":
        // Prioritize Ataka ranked books for featured section
        const featuredBooks = [...mockBooks]
          .sort((a, b) => {
            if (a.atakaRank && b.atakaRank) return a.atakaRank - b.atakaRank;
            if (a.atakaRank && !b.atakaRank) return -1;
            if (!a.atakaRank && b.atakaRank) return 1;
            return b.reviewCount - a.reviewCount;
          })
          .slice(0, 8);
        return (
          <FeaturedBooksSection
            key={section.id}
            title="Featured Books"
            titleTelugu="ప్రత్యేక పుస్తకాలు"
            books={featuredBooks}
            settings={section.settings}
          />
        );

      case "bestsellers":
        // Get top Ataka ranked books (configurable count)
        const atakaRankingCount = section.settings?.atakaRankingCount || 10;
        const topAtakaBooks = mockBooks
          .filter((book) => book.atakaRank)
          .sort((a, b) => (a.atakaRank || 999) - (b.atakaRank || 999))
          .slice(0, atakaRankingCount);
        return (
          <BestsellersSection
            key={section.id}
            title="Top Ataka Rankings"
            titleTelugu="అటకా అగ్రశ్రేణి పుస్తకాలు"
            books={topAtakaBooks}
            settings={section.settings}
          />
        );

      case "new-arrivals":
        return (
          <NewArrivalsSection
            key={section.id}
            title="New Arrivals"
            titleTelugu="కొత్త రాకలు"
            books={mockBooks.filter((book) => book.newArrival).slice(0, 6)}
            settings={section.settings}
          />
        );

      case "authors":
        return (
          <AuthorsCarousel
            key={section.id}
            title={config?.authorsTitle || "Featured Authors"}
            titleTelugu={config?.authorsTitleTelugu}
            authors={config?.featuredAuthors || []}
            settings={section.settings}
          />
        );

      case "publishers":
        return (
          <PublishersCarousel
            key={section.id}
            title={config?.publishersTitle || "Our Publishers"}
            titleTelugu={config?.publishersTitleTelugu}
            publishers={config?.featuredPublishers || []}
            settings={section.settings}
          />
        );

      case "stats":
        return <StatsSection key={section.id} settings={section.settings} />;

      case "newsletter-subscribe":
        return (
          <NewsletterSubscribeSection
            key={section.id}
            settings={section.settings}
          />
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading TeluguBooks
          </h2>
          <p className="text-gray-600">Loading Telugu Books...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Configuration Error
          </h1>
          <p className="text-gray-600 mb-6">
            Unable to load homepage configuration. Please contact support.
          </p>
          <Button asChild>
            <Link to="/admin">Admin Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const sortedSections = config.sections
    .filter((section) => section.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-white">
      {sortedSections.map(renderSection)}
    </div>
  );
}

// Featured Books Section Component
function FeaturedBooksSection({
  title,
  titleTelugu,
  books,
  settings,
}: {
  title: string;
  titleTelugu?: string;
  books: Book[];
  settings?: any;
}) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          {titleTelugu && (
            <p className="text-lg text-gray-600 telugu-text">{titleTelugu}</p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              className="hover:shadow-lg transition-shadow duration-300"
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link to="/shop">
              View All Books
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// Ataka Rankings Section Component
function BestsellersSection({
  title,
  titleTelugu,
  books,
  settings,
}: {
  title: string;
  titleTelugu?: string;
  books: Book[];
  settings?: any;
}) {
  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {title}
            </h2>
          </div>
          {titleTelugu && (
            <p className="text-lg text-gray-600 telugu-text mb-4">
              {titleTelugu}
            </p>
          )}
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our best-performing books ranked by sales, reviews, and reader
            engagement.
            {settings?.atakaRankingCount && (
              <span className="font-medium">
                {" "}
                Showing top {settings.atakaRankingCount} Ataka rankings.
              </span>
            )}
          </p>
        </div>

        {/* Desktop: Leaderboard List View */}
        <div className="hidden md:block space-y-3">
          {books.map((book, index) => (
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

                    {/* Ataka Ranking Badge */}
                    {book.atakaRank && (
                      <div className="mb-2">
                        <Badge className="bg-orange-500 text-white text-xs">
                          #{book.atakaRank} in Ataka
                        </Badge>
                      </div>
                    )}

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
            {books.slice(0, Math.min(10, books.length)).map((book, index) => (
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
              Showing top {Math.min(10, books.length)} of {books.length} books
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link to="/shop?sort=ranking">
              View All Ataka Rankings
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// New Arrivals Section Component
function NewArrivalsSection({
  title,
  titleTelugu,
  books,
  settings,
}: {
  title: string;
  titleTelugu?: string;
  books: Book[];
  settings?: any;
}) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          {titleTelugu && (
            <p className="text-lg text-gray-600 telugu-text">{titleTelugu}</p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              className="hover:shadow-lg transition-shadow duration-300"
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link to="/shop?sort=newest">
              View All New Arrivals
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// Simple Newsletter Subscribe Section Component
function NewsletterSubscribeSection({ settings = {} }: { settings?: any }) {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubscribing(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Successfully Subscribed! 🎉",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Subscription Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-white mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Subscribe for New Releases & Offers
            </h2>
          </div>
          <p className="text-xl text-indigo-200 telugu-text mb-6">
            కొత్త పుస్తకాలు మరియు ఆఫర్లకు సబ్స్క్రైబ్ చేసుకోండి
          </p>
          <p className="text-lg text-indigo-100 mb-8">
            Get notified about new Telugu book releases, exclusive discounts,
            and special offers.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              disabled={isSubscribing}
            />
            <Button
              type="submit"
              disabled={isSubscribing}
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-6 py-3"
            >
              {isSubscribing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent mr-2"></div>
                  Subscribing...
                </>
              ) : (
                "Subscribe Now"
              )}
            </Button>
          </form>

          <p className="text-xs text-indigo-200 mt-4">
            By subscribing, you agree to our privacy policy. Unsubscribe at any
            time.
          </p>
        </div>
      </div>
    </section>
  );
}
