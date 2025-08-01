import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Truck,
  Shield,
  RefreshCw,
  Heart,
  BookOpen,
  Award,
  Clock,
  Phone,
} from "lucide-react";

interface WhyChooseUsSectionProps {
  settings?: {
    backgroundColor?: string;
    features?: Array<{
      icon: string;
      title: string;
      titleTelugu?: string;
      description: string;
      descriptionTelugu?: string;
      color: string;
    }>;
  };
}

export default function WhyChooseUsSection({
  settings = {},
}: WhyChooseUsSectionProps) {
  const defaultFeatures = [
    {
      icon: "truck",
      title: "Free Delivery",
      titleTelugu: "ఉచిత డెలివరీ",
      description: "Free delivery on orders above ₹500 across India",
      descriptionTelugu: "₹500 మించిన ఆర్డర్లకు భారతదేశం అంతటా ఉచిత డెలివరీ",
      color: "text-green-600",
    },
    {
      icon: "shield",
      title: "Secure Payment",
      titleTelugu: "సురక్షిత చెల్లింపు",
      description: "100% secure payment with Razorpay encryption",
      descriptionTelugu: "Razorpay ఎన్క్రిప్షన్‌తో 100% సురక్షిత చెల్లింపు",
      color: "text-blue-600",
    },
    {
      icon: "refresh",
      title: "Easy Returns",
      titleTelugu: "సులభ రిటర్న్స్",
      description: "7-day easy return policy for all books",
      descriptionTelugu: "అన్ని పుస్తకాలకు 7-రోజుల సులభ రిటర్న్ పాలసీ",
      color: "text-purple-600",
    },
    {
      icon: "heart",
      title: "Quality Assured",
      titleTelugu: "నాణ్యత హామీ",
      description: "Original books with quality guarantee",
      descriptionTelugu: "నాణ్యత హామీతో అసలైన పుస్తకాలు",
      color: "text-red-600",
    },
    {
      icon: "book",
      title: "Vast Collection",
      titleTelugu: "విస్తృత సేకరణ",
      description: "10,000+ Telugu books from all genres",
      descriptionTelugu: "అన్ని రకాలకు చెందిన 10,000+ తెలుగు పుస్తకాలు",
      color: "text-indigo-600",
    },
    {
      icon: "award",
      title: "Award Winners",
      titleTelugu: "పురస్కార విజేతలు",
      description: "Books by Jnanpith and Sahitya Akademi winners",
      descriptionTelugu: "జ్ఞానపీఠ మరియు సాహిత్య అకాడమీ విజేతల పుస్తకాలు",
      color: "text-yellow-600",
    },
    {
      icon: "clock",
      title: "24/7 Support",
      titleTelugu: "24/7 మద్దతు",
      description: "Round-the-clock customer support",
      descriptionTelugu: "గడియారం గొట్టం కస్టమర్ మద్దతు",
      color: "text-teal-600",
    },
    {
      icon: "phone",
      title: "Expert Guidance",
      titleTelugu: "నిపుణుల మార్గదర్శకత్వం",
      description: "Get book recommendations from our experts",
      descriptionTelugu: "మా నిపుణుల నుండి పుస్తక సిఫార్సులు పొందండి",
      color: "text-orange-600",
    },
  ];

  const features = settings.features || defaultFeatures;

  const getIcon = (iconName: string, className: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      truck: <Truck className={className} />,
      shield: <Shield className={className} />,
      refresh: <RefreshCw className={className} />,
      heart: <Heart className={className} />,
      book: <BookOpen className={className} />,
      award: <Award className={className} />,
      clock: <Clock className={className} />,
      phone: <Phone className={className} />,
    };
    return iconMap[iconName] || <BookOpen className={className} />;
  };

  return (
    <section
      className={`py-16 ${
        settings.backgroundColor || "bg-gradient-to-br from-gray-50 to-white"
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Why Choose Telugu Books?
          </h2>
          <p className="text-xl text-gray-600 telugu-text">
            తెలుగు బుక్స్‌ను ఎందుకు ఎంచుకోవాలి?
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-brand-500 to-telugu-500 mx-auto mt-4"></div>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            We are committed to preserving and promoting Telugu literature while
            providing the best reading experience to our customers.
          </p>
          <p className="mt-2 text-base text-gray-500 telugu-text max-w-3xl mx-auto">
            తెలుగు సాహిత్యాన్ని పరిరక్షించడంలో మరియు ప్రోత్సహించడంలో మేము
            కట్టుబడి ఉన్నాము, అదే సమయంలో మా కస్టమర్లకు ఉత్తమ పఠన అనుభవాన్ని
            అందిస్తున్నాము.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 h-full bg-white"
            >
              <CardContent className="p-6 text-center h-full flex flex-col">
                {/* Icon */}
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
                    {getIcon(feature.icon, `w-8 h-8 ${feature.color}`)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  {feature.titleTelugu && (
                    <h4 className="text-sm font-medium text-gray-600 telugu-text mb-3">
                      {feature.titleTelugu}
                    </h4>
                  )}
                  <p className="text-sm text-gray-600 mb-2">
                    {feature.description}
                  </p>
                  {feature.descriptionTelugu && (
                    <p className="text-xs text-gray-500 telugu-text">
                      {feature.descriptionTelugu}
                    </p>
                  )}
                </div>

                {/* Hover Effect */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div
                    className="w-full h-0.5 rounded-full"
                    style={{
                      backgroundColor: feature.color.replace("text-", ""),
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-brand-500 to-telugu-500 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-2">
              Ready to Start Your Reading Journey?
            </h3>
            <p className="text-brand-100 telugu-text mb-6">
              మీ పఠన ప్రయాణాన్ని ప్రారంభించడానికి సిద్ధంగా ఉన్నారా?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/shop"
                className="bg-white text-brand-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Browse Books
              </a>
              <a
                href="/register"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-brand-600 transition-colors duration-200"
              >
                Join Our Community
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
