import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface SliderImage {
  id: string;
  image: string;
  title: string;
  titleTelugu?: string;
  subtitle?: string;
  subtitleTelugu?: string;
  buttonText?: string;
  buttonTextTelugu?: string;
  linkUrl?: string;
  isActive: boolean;
  order: number;
}

interface HeroSliderProps {
  images: SliderImage[];
  settings?: {
    autoPlay?: boolean;
    autoPlayDelay?: number;
    showDots?: boolean;
    showArrows?: boolean;
    height?: string;
  };
}

export default function HeroSlider({
  images = [],
  settings = {
    autoPlay: true,
    autoPlayDelay: 5000,
    showDots: true,
    showArrows: true,
    height: "500px",
  },
}: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(settings.autoPlay);

  const activeImages = images
    .filter((img) => img.isActive)
    .sort((a, b) => a.order - b.order);

  // Default slides if no images configured
  const defaultSlides = [
    {
      id: "default-1",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Discover Telugu Literature",
      titleTelugu: "తెలుగు సాహిత్యాన్ని కనుగొనండి",
      subtitle:
        "Explore thousands of Telugu books from classic to contemporary",
      subtitleTelugu:
        "క్లాసిక్ నుండి సమకాలీన వరకు వేలాది తెలుగు పుస్తకాలను అన్వేషించండి",
      buttonText: "Shop Now",
      buttonTextTelugu: "ఇప్పుడే కొనుగోలు చేయండి",
      linkUrl: "/shop",
      isActive: true,
      order: 1,
    },
    {
      id: "default-2",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Free Delivery Across India",
      titleTelugu: "భారతదేశం అంతటా ఉచిత డెలివరీ",
      subtitle: "Get your favorite Telugu books delivered to your doorstep",
      subtitleTelugu:
        "మీకు ఇష్టమైన తెలుగు పుస్తకాలను మీ ఇంటి గుమ్మం వరకు పంపిస్తాము",
      buttonText: "Learn More",
      buttonTextTelugu: "మరింత తెలుసుకోండి",
      linkUrl: "/about",
      isActive: true,
      order: 2,
    },
    {
      id: "default-3",
      image:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Join Our Book Community",
      titleTelugu: "మా పుస్తక సమాజంలో చేరండి",
      subtitle: "Connect with fellow Telugu book lovers and authors",
      subtitleTelugu: "తెలుగు పుస్తక ప్రేమికులు మరియు రచయితలతో కనెక్ట్ అవ్వండి",
      buttonText: "Join Now",
      buttonTextTelugu: "ఇప్పుడే చేరండి",
      linkUrl: "/register",
      isActive: true,
      order: 3,
    },
  ];

  const slides = activeImages.length > 0 ? activeImages : defaultSlides;

  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, settings.autoPlayDelay);

    return () => clearInterval(interval);
  }, [isPlaying, slides.length, settings.autoPlayDelay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (slides.length === 0) {
    return null;
  }

  const currentSlideData = slides[currentSlide];

  return (
    <section
      className="relative overflow-hidden bg-gray-900"
      style={{ height: settings.height }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentSlideData.image}
          alt={currentSlideData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              {currentSlideData.title}
            </h1>
            {currentSlideData.titleTelugu && (
              <h2 className="text-2xl md:text-3xl font-semibold text-blue-200 mb-6 telugu-text">
                {currentSlideData.titleTelugu}
              </h2>
            )}

            <p className="text-lg md:text-xl text-gray-200 mb-4">
              {currentSlideData.subtitle}
            </p>
            {currentSlideData.subtitleTelugu && (
              <p className="text-base md:text-lg text-gray-300 mb-8 telugu-text">
                {currentSlideData.subtitleTelugu}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-brand-500 hover:bg-brand-600 text-white"
              >
                <Link to={currentSlideData.linkUrl || "/shop"}>
                  {currentSlideData.buttonText || "Shop Now"}
                </Link>
              </Button>

              {currentSlideData.buttonTextTelugu && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-gray-900"
                >
                  <Link to={currentSlideData.linkUrl || "/shop"}>
                    <span className="telugu-text">
                      {currentSlideData.buttonTextTelugu}
                    </span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {settings.showArrows && slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 text-white"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {settings.showDots && slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-200",
                currentSlide === index
                  ? "bg-white"
                  : "bg-white bg-opacity-50 hover:bg-opacity-75",
              )}
            />
          ))}
        </div>
      )}

      {/* Auto-play control */}
      {settings.autoPlay && slides.length > 1 && (
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 text-white"
          title={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          <Play className={cn("w-4 h-4", !isPlaying && "opacity-50")} />
        </button>
      )}

      {/* Slide counter */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 right-6 text-white text-sm bg-black bg-opacity-30 px-3 py-1 rounded-full">
          {currentSlide + 1} / {slides.length}
        </div>
      )}
    </section>
  );
}
