import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Award, Truck, Heart, Star } from "lucide-react";

interface StatsSectionProps {
  settings?: {
    backgroundColor?: string;
    showAnimation?: boolean;
    customStats?: Array<{
      icon: string;
      label: string;
      labelTelugu?: string;
      value: string;
      color: string;
    }>;
  };
}

export default function StatsSection({
  settings = {
    backgroundColor: "bg-gradient-to-br from-blue-600 to-purple-700",
    showAnimation: true,
  },
}: StatsSectionProps) {
  const defaultStats = [
    {
      icon: "books",
      label: "Telugu Books",
      labelTelugu: "తెలుగు పుస్తకాలు",
      value: "10,000+",
      color: "text-blue-300",
    },
    {
      icon: "users",
      label: "Happy Readers",
      labelTelugu: "సంతుష్ట పాఠకులు",
      value: "50,000+",
      color: "text-green-300",
    },
    {
      icon: "authors",
      label: "Authors",
      labelTelugu: "రచయితలు",
      value: "2,500+",
      color: "text-yellow-300",
    },
    {
      icon: "delivery",
      label: "Orders Delivered",
      labelTelugu: "డెలివరీలు",
      value: "1,25,000+",
      color: "text-purple-300",
    },
    {
      icon: "rating",
      label: "Average Rating",
      labelTelugu: "సగటు రేటింగ్",
      value: "4.8/5",
      color: "text-orange-300",
    },
    {
      icon: "satisfaction",
      label: "Customer Satisfaction",
      labelTelugu: "కస్టమర్ సంతృప్తి",
      value: "98%",
      color: "text-pink-300",
    },
  ];

  const stats = settings.customStats || defaultStats;

  const getIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      books: <BookOpen className="w-8 h-8" />,
      users: <Users className="w-8 h-8" />,
      authors: <Award className="w-8 h-8" />,
      delivery: <Truck className="w-8 h-8" />,
      rating: <Star className="w-8 h-8" />,
      satisfaction: <Heart className="w-8 h-8" />,
    };
    return iconMap[iconName] || <BookOpen className="w-8 h-8" />;
  };

  return (
    <section
      className={`py-16 ${
        settings.backgroundColor ||
        "bg-gradient-to-br from-blue-600 to-purple-700"
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Our Achievements
          </h2>
          <p className="text-xl text-blue-200 telugu-text">మా విజయాలు</p>
          <div className="w-24 h-1 bg-gradient-to-r from-white to-blue-200 mx-auto mt-4"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={`bg-white bg-opacity-10 backdrop-blur-lg border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 ${
                settings.showAnimation
                  ? "transform hover:scale-105 hover:-translate-y-2"
                  : ""
              }`}
            >
              <CardContent className="p-6 text-center">
                <div className={`mb-4 ${stat.color} flex justify-center`}>
                  {getIcon(stat.icon)}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-blue-100 font-medium">
                  {stat.label}
                </div>
                {stat.labelTelugu && (
                  <div className="text-xs text-blue-200 telugu-text mt-1">
                    {stat.labelTelugu}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <p className="text-blue-200 mb-2">
            Trusted by readers across India for quality Telugu literature
          </p>
          <p className="text-blue-300 text-sm telugu-text">
            నాణ్యమైన తెలుగు సాహిత్యం కోసం భారతదేశం అంతటా పాఠకుల నమ్మకం
          </p>
        </div>
      </div>
    </section>
  );
}
