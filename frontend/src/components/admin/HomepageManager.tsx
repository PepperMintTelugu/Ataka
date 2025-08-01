import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Home,
  Images,
  Grid3X3,
  Save,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Palette,
  Settings,
  ChevronUp,
  ChevronDown,
  Copy,
  BarChart3,
  BookOpen,
  Users,
  Star,
  Mail,
  MessageSquare,
  Quote,
  Newspaper,
  Globe,
  Heart,
  Trophy,
  Zap,
  Target,
  CheckCircle,
} from "lucide-react";

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

interface StatItem {
  id: string;
  number: string;
  label: string;
  labelTelugu?: string;
  icon: string;
  color: string;
  isActive: boolean;
  order: number;
}

interface FeaturedBook {
  id: string;
  bookId: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  badgeColor?: string;
  isActive: boolean;
  order: number;
}

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  textTelugu?: string;
  avatar?: string;
  isActive: boolean;
  order: number;
}

interface NewsletterSettings {
  enabled: boolean;
  title: string;
  titleTelugu?: string;
  subtitle: string;
  subtitleTelugu?: string;
  placeholder: string;
  placeholderTelugu?: string;
  buttonText: string;
  buttonTextTelugu?: string;
  successMessage: string;
  successMessageTelugu?: string;
  mailchimpApiKey?: string;
  mailchimpListId?: string;
}

interface WhyChooseUsItem {
  id: string;
  title: string;
  titleTelugu?: string;
  description: string;
  descriptionTelugu?: string;
  icon: string;
  color: string;
  isActive: boolean;
  order: number;
}

interface SocialMediaLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  color: string;
  isActive: boolean;
  order: number;
}

interface HomepageSettings {
  heroSlider: {
    images: SliderImage[];
    settings: {
      autoPlay: boolean;
      autoPlayDelay: number;
      showDots: boolean;
      showArrows: boolean;
      height: string;
    };
  };
  categories: {
    title: string;
    titleTelugu?: string;
    categories: CategoryDisplay[];
    settings: {
      layout: "grid" | "carousel";
      itemsPerRow: number;
      showDescription: boolean;
      showIcons: boolean;
    };
  };
  stats: {
    enabled: boolean;
    title: string;
    titleTelugu?: string;
    backgroundColor: string;
    items: StatItem[];
  };
  featuredBooks: {
    enabled: boolean;
    title: string;
    titleTelugu?: string;
    books: FeaturedBook[];
    settings: {
      itemsToShow: number;
      autoRotate: boolean;
      showPrices: boolean;
      showBadges: boolean;
    };
  };
  whyChooseUs: {
    enabled: boolean;
    title: string;
    titleTelugu?: string;
    subtitle: string;
    subtitleTelugu?: string;
    items: WhyChooseUsItem[];
  };
  testimonials: {
    enabled: boolean;
    title: string;
    titleTelugu?: string;
    items: Testimonial[];
    settings: {
      autoRotate: boolean;
      showRatings: boolean;
      itemsPerView: number;
    };
  };
  newsletter: NewsletterSettings;
  socialMedia: {
    enabled: boolean;
    title: string;
    titleTelugu?: string;
    links: SocialMediaLink[];
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
    ogImage: string;
    structuredData: boolean;
  };
}

export default function HomepageManager() {
  const [homepageData, setHomepageData] = useState<HomepageSettings>({
    heroSlider: {
      images: [],
      settings: {
        autoPlay: true,
        autoPlayDelay: 5000,
        showDots: true,
        showArrows: true,
        height: "500px",
      },
    },
    categories: {
      title: "Browse Categories",
      titleTelugu: "వర్గాలను విహరించండి",
      categories: [],
      settings: {
        layout: "grid",
        itemsPerRow: 4,
        showDescription: true,
        showIcons: true,
      },
    },
    stats: {
      enabled: true,
      title: "Our Impact",
      titleTelugu: "మా ప్రభావం",
      backgroundColor: "#f8fafc",
      items: [],
    },
    featuredBooks: {
      enabled: true,
      title: "Featured Books",
      titleTelugu: "ప్రత్యేక పుస్తకాలు",
      books: [],
      settings: {
        itemsToShow: 8,
        autoRotate: false,
        showPrices: true,
        showBadges: true,
      },
    },
    whyChooseUs: {
      enabled: true,
      title: "Why Choose TeluguBooks?",
      titleTelugu: "తెలుగుబుక్స్ ఎందుకు ఎంచుకోవాలి?",
      subtitle: "We provide the best Telugu literature experience",
      subtitleTelugu: "మేము అత్యుత్తమ తెలుగు సాహిత్య అనుభవాన్ని అందిస్తాము",
      items: [],
    },
    testimonials: {
      enabled: true,
      title: "What Our Customers Say",
      titleTelugu: "మా కస్టమర్లు ఏమంటున్నారు",
      items: [],
      settings: {
        autoRotate: true,
        showRatings: true,
        itemsPerView: 3,
      },
    },
    newsletter: {
      enabled: true,
      title: "Stay Updated",
      titleTelugu: "అప్‌డేట్‌లు పొందండి",
      subtitle:
        "Get the latest Telugu books and offers delivered to your inbox",
      subtitleTelugu:
        "తాజా తెలుగు పుస్తకాలు మరియు ఆఫర్లను మీ ఇన్‌బాక్స్‌లో పొందండి",
      placeholder: "Enter your email address",
      placeholderTelugu: "మీ ఇమెయిల్ చిరునామా నమోదు చేయండి",
      buttonText: "Subscribe",
      buttonTextTelugu: "సబ్‌స్క్రైబ్ చేయండి",
      successMessage: "Thank you for subscribing!",
      successMessageTelugu: "సబ్‌స్క్రైబ్ చేసినందుకు ధన���యవాదాలు!",
      mailchimpApiKey: "",
      mailchimpListId: "",
    },
    socialMedia: {
      enabled: true,
      title: "Follow Us",
      titleTelugu: "మమ్మల్ని అనుసరించండి",
      links: [],
    },
    seo: {
      metaTitle: "TeluguBooks - Your Premier Destination for Telugu Literature",
      metaDescription:
        "Discover the finest collection of Telugu books with free delivery across India. Classic literature, devotional books, poetry and more.",
      metaKeywords: [
        "telugu books",
        "telugu literature",
        "free delivery",
        "devotional books",
        "poetry",
      ],
      ogImage: "",
      structuredData: true,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { toast } = useToast();

  const iconOptions = [
    "book-open",
    "heart",
    "star",
    "trophy",
    "zap",
    "target",
    "check-circle",
    "users",
    "globe",
    "mail",
    "phone",
    "clock",
    "shield",
    "award",
    "thumbs-up",
  ];

  const socialPlatforms = [
    { id: "facebook", name: "Facebook", icon: "facebook", color: "#1877f2" },
    { id: "twitter", name: "Twitter", icon: "twitter", color: "#1da1f2" },
    { id: "instagram", name: "Instagram", icon: "instagram", color: "#e4405f" },
    { id: "youtube", name: "YouTube", icon: "youtube", color: "#ff0000" },
    { id: "linkedin", name: "LinkedIn", icon: "linkedin", color: "#0077b5" },
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: "message-circle",
      color: "#25d366",
    },
    { id: "telegram", name: "Telegram", icon: "send", color: "#0088cc" },
  ];

  useEffect(() => {
    fetchHomepageData();
  }, []);

  const fetchHomepageData = async () => {
    try {
      setIsLoading(true);

      // Try to fetch from API, but don't fail if it doesn't work
      try {
        const response = await fetch("/api/admin/homepage", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.homepage) {
            setHomepageData((prev) => ({
              ...prev,
              ...data.homepage,
            }));
          }
        } else {
          console.log("API not available, using default data");
        }
      } catch (apiError) {
        console.log("API error, using default data:", apiError);
        // Continue with default data
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        title: "Info",
        description:
          "Using default homepage settings. Save to create initial configuration.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveHomepageData = async () => {
    try {
      setIsSaving(true);

      const response = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ homepage: homepageData }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Homepage settings saved successfully",
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: "Failed to save homepage settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addDefaultStats = () => {
    const defaultStats: StatItem[] = [
      {
        id: "1",
        number: "10,000+",
        label: "Telugu Books",
        labelTelugu: "తెలుగు పుస్తకాలు",
        icon: "book-open",
        color: "#3b82f6",
        isActive: true,
        order: 1,
      },
      {
        id: "2",
        number: "50,000+",
        label: "Happy Customers",
        labelTelugu: "సంతోషకరమైన కస్టమర్లు",
        icon: "users",
        color: "#10b981",
        isActive: true,
        order: 2,
      },
      {
        id: "3",
        number: "500+",
        label: "Cities Served",
        labelTelugu: "సేవ చేసిన నగరాలు",
        icon: "globe",
        color: "#f59e0b",
        isActive: true,
        order: 3,
      },
      {
        id: "4",
        number: "99%",
        label: "Customer Satisfaction",
        labelTelugu: "కస్టమర్ సంతృప్తి",
        icon: "star",
        color: "#ef4444",
        isActive: true,
        order: 4,
      },
    ];

    setHomepageData((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        items: defaultStats,
      },
    }));
  };

  const addDefaultWhyChooseUs = () => {
    const defaultItems: WhyChooseUsItem[] = [
      {
        id: "1",
        title: "Free Delivery",
        titleTelugu: "ఉచిత డెలివరీ",
        description: "Free delivery across India for all orders",
        descriptionTelugu: "అన్ని ఆర్డర్లకు భారతదేశం అంతటా ఉచిత డెలివరీ",
        icon: "truck",
        color: "#10b981",
        isActive: true,
        order: 1,
      },
      {
        id: "2",
        title: "Authentic Books",
        titleTelugu: "ప్రామాణిక పుస్తకాలు",
        description: "Only genuine and original Telugu books",
        descriptionTelugu: "కేవలం వాస్తవ మరియు అసలైన తెలుగు పుస్తకాలు",
        icon: "check-circle",
        color: "#3b82f6",
        isActive: true,
        order: 2,
      },
      {
        id: "3",
        title: "Fast Shipping",
        titleTelugu: "వేగవంతమైన షిప్పింగ్",
        description: "Quick delivery within 2-3 business days",
        descriptionTelugu: "2-3 వ్యాపార దినాలలో త్వరిత డెలివరీ",
        icon: "zap",
        color: "#f59e0b",
        isActive: true,
        order: 3,
      },
      {
        id: "4",
        title: "24/7 Support",
        titleTelugu: "24/7 మద్దతు",
        description: "Round the clock customer support",
        descriptionTelugu: "గుండ్రంగా గంట కస్టమర్ మద్దతు",
        icon: "heart",
        color: "#ef4444",
        isActive: true,
        order: 4,
      },
    ];

    setHomepageData((prev) => ({
      ...prev,
      whyChooseUs: {
        ...prev.whyChooseUs,
        items: defaultItems,
      },
    }));
  };

  const addDefaultSocialMedia = () => {
    const defaultLinks: SocialMediaLink[] = [
      {
        id: "1",
        platform: "Facebook",
        url: "https://facebook.com/telugubooks",
        icon: "facebook",
        color: "#1877f2",
        isActive: true,
        order: 1,
      },
      {
        id: "2",
        platform: "Instagram",
        url: "https://instagram.com/telugubooks",
        icon: "instagram",
        color: "#e4405f",
        isActive: true,
        order: 2,
      },
      {
        id: "3",
        platform: "Twitter",
        url: "https://twitter.com/telugubooks",
        icon: "twitter",
        color: "#1da1f2",
        isActive: true,
        order: 3,
      },
      {
        id: "4",
        platform: "YouTube",
        url: "https://youtube.com/telugubooks",
        icon: "youtube",
        color: "#ff0000",
        isActive: true,
        order: 4,
      },
    ];

    setHomepageData((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        links: defaultLinks,
      },
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading homepage settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Home className="w-5 h-5 mr-2" />
                Homepage Management
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Configure all homepage sections and content
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" onClick={saveHomepageData} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save All Changes"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="hero" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="why-us">Why Us</TabsTrigger>
              <TabsTrigger value="testimonials">Reviews</TabsTrigger>
              <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            {/* Hero Slider Tab - Keep existing implementation */}
            <TabsContent value="hero" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Hero Slider Configuration</CardTitle>
                  <p className="text-sm text-gray-600">
                    Configure the main banner slider on your homepage
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Images className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Hero Slider Settings
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Add compelling hero images with call-to-action buttons to
                      showcase your best content.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <Label>Auto Play</Label>
                        <Switch
                          checked={homepageData.heroSlider.settings.autoPlay}
                          onCheckedChange={(checked) =>
                            setHomepageData((prev) => ({
                              ...prev,
                              heroSlider: {
                                ...prev.heroSlider,
                                settings: {
                                  ...prev.heroSlider.settings,
                                  autoPlay: checked,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="p-3 border rounded">
                        <Label>Delay (ms)</Label>
                        <Input
                          type="number"
                          value={homepageData.heroSlider.settings.autoPlayDelay}
                          onChange={(e) =>
                            setHomepageData((prev) => ({
                              ...prev,
                              heroSlider: {
                                ...prev.heroSlider,
                                settings: {
                                  ...prev.heroSlider.settings,
                                  autoPlayDelay: parseInt(e.target.value),
                                },
                              },
                            }))
                          }
                          className="mt-2"
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <Label>Show Dots</Label>
                        <Switch
                          checked={homepageData.heroSlider.settings.showDots}
                          onCheckedChange={(checked) =>
                            setHomepageData((prev) => ({
                              ...prev,
                              heroSlider: {
                                ...prev.heroSlider,
                                settings: {
                                  ...prev.heroSlider.settings,
                                  showDots: checked,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <Label>Show Arrows</Label>
                        <Switch
                          checked={homepageData.heroSlider.settings.showArrows}
                          onCheckedChange={(checked) =>
                            setHomepageData((prev) => ({
                              ...prev,
                              heroSlider: {
                                ...prev.heroSlider,
                                settings: {
                                  ...prev.heroSlider.settings,
                                  showArrows: checked,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Hero Slide
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Categories Tab - Keep existing implementation */}
            <TabsContent value="categories" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Categories Section</CardTitle>
                  <p className="text-sm text-gray-600">
                    Configure the categories showcase section
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Section Title (English)</Label>
                        <Input
                          value={homepageData.categories.title}
                          onChange={(e) =>
                            setHomepageData((prev) => ({
                              ...prev,
                              categories: {
                                ...prev.categories,
                                title: e.target.value,
                              },
                            }))
                          }
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Section Title (Telugu)</Label>
                        <Input
                          value={homepageData.categories.titleTelugu}
                          onChange={(e) =>
                            setHomepageData((prev) => ({
                              ...prev,
                              categories: {
                                ...prev.categories,
                                titleTelugu: e.target.value,
                              },
                            }))
                          }
                          className="mt-2 telugu-text"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Items Per Row</Label>
                        <Select
                          value={homepageData.categories.settings.itemsPerRow.toString()}
                          onValueChange={(value) =>
                            setHomepageData((prev) => ({
                              ...prev,
                              categories: {
                                ...prev.categories,
                                settings: {
                                  ...prev.categories.settings,
                                  itemsPerRow: parseInt(value),
                                },
                              },
                            }))
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2">2 per row</SelectItem>
                            <SelectItem value="3">3 per row</SelectItem>
                            <SelectItem value="4">4 per row</SelectItem>
                            <SelectItem value="5">5 per row</SelectItem>
                            <SelectItem value="6">6 per row</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between pt-6">
                        <Label>Show Descriptions</Label>
                        <Switch
                          checked={
                            homepageData.categories.settings.showDescription
                          }
                          onCheckedChange={(checked) =>
                            setHomepageData((prev) => ({
                              ...prev,
                              categories: {
                                ...prev.categories,
                                settings: {
                                  ...prev.categories.settings,
                                  showDescription: checked,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between pt-6">
                        <Label>Show Icons</Label>
                        <Switch
                          checked={homepageData.categories.settings.showIcons}
                          onCheckedChange={(checked) =>
                            setHomepageData((prev) => ({
                              ...prev,
                              categories: {
                                ...prev.categories,
                                settings: {
                                  ...prev.categories.settings,
                                  showIcons: checked,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label>Layout Style</Label>
                        <Select
                          value={homepageData.categories.settings.layout}
                          onValueChange={(value: "grid" | "carousel") =>
                            setHomepageData((prev) => ({
                              ...prev,
                              categories: {
                                ...prev.categories,
                                settings: {
                                  ...prev.categories.settings,
                                  layout: value,
                                },
                              },
                            }))
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="grid">Grid Layout</SelectItem>
                            <SelectItem value="carousel">Carousel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Category
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Stats Section */}
            <TabsContent value="stats" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Statistics Section
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Showcase impressive numbers and achievements
                      </p>
                    </div>
                    <Switch
                      checked={homepageData.stats.enabled}
                      onCheckedChange={(checked) =>
                        setHomepageData((prev) => ({
                          ...prev,
                          stats: { ...prev.stats, enabled: checked },
                        }))
                      }
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {homepageData.stats.enabled ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Section Title (English)</Label>
                          <Input
                            value={homepageData.stats.title}
                            onChange={(e) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                stats: { ...prev.stats, title: e.target.value },
                              }))
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Section Title (Telugu)</Label>
                          <Input
                            value={homepageData.stats.titleTelugu}
                            onChange={(e) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                stats: {
                                  ...prev.stats,
                                  titleTelugu: e.target.value,
                                },
                              }))
                            }
                            className="mt-2 telugu-text"
                          />
                        </div>
                        <div>
                          <Label>Background Color</Label>
                          <Input
                            type="color"
                            value={homepageData.stats.backgroundColor}
                            onChange={(e) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                stats: {
                                  ...prev.stats,
                                  backgroundColor: e.target.value,
                                },
                              }))
                            }
                            className="mt-2 h-10"
                          />
                        </div>
                      </div>

                      {homepageData.stats.items.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed rounded-lg">
                          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 mb-4">
                            No statistics configured yet
                          </p>
                          <Button onClick={addDefaultStats}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Default Stats
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {homepageData.stats.items.map((stat) => (
                            <div
                              key={stat.id}
                              className="flex items-center space-x-4 p-4 border rounded-lg"
                            >
                              <div
                                className="w-12 h-12 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: stat.color + "20" }}
                              >
                                <div
                                  className="w-6 h-6"
                                  style={{ color: stat.color }}
                                >
                                  <BarChart3 className="w-full h-full" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="text-2xl font-bold">
                                    {stat.number}
                                  </span>
                                  <span className="font-medium">
                                    {stat.label}
                                  </span>
                                  {stat.labelTelugu && (
                                    <span className="text-sm text-gray-600 telugu-text">
                                      ({stat.labelTelugu})
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Button variant="outline" className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Custom Statistic
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        Statistics Section Disabled
                      </h3>
                      <p>
                        Enable the statistics section to showcase your
                        achievements and numbers
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Featured Books */}
            <TabsContent value="featured" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <BookOpen className="w-5 h-5 mr-2" />
                        Featured Books Section
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Highlight your best and newest books
                      </p>
                    </div>
                    <Switch
                      checked={homepageData.featuredBooks.enabled}
                      onCheckedChange={(checked) =>
                        setHomepageData((prev) => ({
                          ...prev,
                          featuredBooks: {
                            ...prev.featuredBooks,
                            enabled: checked,
                          },
                        }))
                      }
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {homepageData.featuredBooks.enabled ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Section Title (English)</Label>
                          <Input
                            value={homepageData.featuredBooks.title}
                            onChange={(e) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                featuredBooks: {
                                  ...prev.featuredBooks,
                                  title: e.target.value,
                                },
                              }))
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Section Title (Telugu)</Label>
                          <Input
                            value={homepageData.featuredBooks.titleTelugu}
                            onChange={(e) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                featuredBooks: {
                                  ...prev.featuredBooks,
                                  titleTelugu: e.target.value,
                                },
                              }))
                            }
                            className="mt-2 telugu-text"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label>Books to Show</Label>
                          <Select
                            value={homepageData.featuredBooks.settings.itemsToShow.toString()}
                            onValueChange={(value) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                featuredBooks: {
                                  ...prev.featuredBooks,
                                  settings: {
                                    ...prev.featuredBooks.settings,
                                    itemsToShow: parseInt(value),
                                  },
                                },
                              }))
                            }
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="4">4 books</SelectItem>
                              <SelectItem value="6">6 books</SelectItem>
                              <SelectItem value="8">8 books</SelectItem>
                              <SelectItem value="12">12 books</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between pt-6">
                          <Label>Auto Rotate</Label>
                          <Switch
                            checked={
                              homepageData.featuredBooks.settings.autoRotate
                            }
                            onCheckedChange={(checked) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                featuredBooks: {
                                  ...prev.featuredBooks,
                                  settings: {
                                    ...prev.featuredBooks.settings,
                                    autoRotate: checked,
                                  },
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between pt-6">
                          <Label>Show Prices</Label>
                          <Switch
                            checked={
                              homepageData.featuredBooks.settings.showPrices
                            }
                            onCheckedChange={(checked) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                featuredBooks: {
                                  ...prev.featuredBooks,
                                  settings: {
                                    ...prev.featuredBooks.settings,
                                    showPrices: checked,
                                  },
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between pt-6">
                          <Label>Show Badges</Label>
                          <Switch
                            checked={
                              homepageData.featuredBooks.settings.showBadges
                            }
                            onCheckedChange={(checked) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                featuredBooks: {
                                  ...prev.featuredBooks,
                                  settings: {
                                    ...prev.featuredBooks.settings,
                                    showBadges: checked,
                                  },
                                },
                              }))
                            }
                          />
                        </div>
                      </div>

                      <div className="text-center py-8 border-2 border-dashed rounded-lg">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 mb-4">
                          Featured books will be automatically selected from
                          your catalog
                        </p>
                        <p className="text-sm text-gray-500">
                          You can also manually curate specific books for this
                          section
                        </p>
                        <Button className="mt-4">
                          <Plus className="w-4 h-4 mr-2" />
                          Manually Select Books
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        Featured Books Section Disabled
                      </h3>
                      <p>
                        Enable this section to showcase your best books on the
                        homepage
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Why Choose Us */}
            <TabsContent value="why-us" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Trophy className="w-5 h-5 mr-2" />
                        Why Choose Us Section
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Highlight your unique value propositions
                      </p>
                    </div>
                    <Switch
                      checked={homepageData.whyChooseUs.enabled}
                      onCheckedChange={(checked) =>
                        setHomepageData((prev) => ({
                          ...prev,
                          whyChooseUs: {
                            ...prev.whyChooseUs,
                            enabled: checked,
                          },
                        }))
                      }
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {homepageData.whyChooseUs.enabled ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Main Title (English)</Label>
                          <Input
                            value={homepageData.whyChooseUs.title}
                            onChange={(e) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                whyChooseUs: {
                                  ...prev.whyChooseUs,
                                  title: e.target.value,
                                },
                              }))
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Main Title (Telugu)</Label>
                          <Input
                            value={homepageData.whyChooseUs.titleTelugu}
                            onChange={(e) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                whyChooseUs: {
                                  ...prev.whyChooseUs,
                                  titleTelugu: e.target.value,
                                },
                              }))
                            }
                            className="mt-2 telugu-text"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Subtitle (English)</Label>
                          <Input
                            value={homepageData.whyChooseUs.subtitle}
                            onChange={(e) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                whyChooseUs: {
                                  ...prev.whyChooseUs,
                                  subtitle: e.target.value,
                                },
                              }))
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Subtitle (Telugu)</Label>
                          <Input
                            value={homepageData.whyChooseUs.subtitleTelugu}
                            onChange={(e) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                whyChooseUs: {
                                  ...prev.whyChooseUs,
                                  subtitleTelugu: e.target.value,
                                },
                              }))
                            }
                            className="mt-2 telugu-text"
                          />
                        </div>
                      </div>

                      {homepageData.whyChooseUs.items.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed rounded-lg">
                          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 mb-4">
                            No value propositions configured yet
                          </p>
                          <Button onClick={addDefaultWhyChooseUs}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Default Items
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {homepageData.whyChooseUs.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center space-x-4 p-4 border rounded-lg"
                            >
                              <div
                                className="w-12 h-12 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: item.color + "20" }}
                              >
                                <div
                                  className="w-6 h-6"
                                  style={{ color: item.color }}
                                >
                                  <CheckCircle className="w-full h-full" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium">
                                    {item.title}
                                  </span>
                                  {item.titleTelugu && (
                                    <span className="text-sm text-gray-600 telugu-text">
                                      ({item.titleTelugu})
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-1">
                                  {item.description}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Button variant="outline" className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Custom Feature
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        Why Choose Us Section Disabled
                      </h3>
                      <p>
                        Enable this section to showcase your unique value
                        propositions
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Testimonials */}
            <TabsContent value="testimonials" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Quote className="w-5 h-5 mr-2" />
                        Customer Testimonials
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Display customer reviews and feedback
                      </p>
                    </div>
                    <Switch
                      checked={homepageData.testimonials.enabled}
                      onCheckedChange={(checked) =>
                        setHomepageData((prev) => ({
                          ...prev,
                          testimonials: {
                            ...prev.testimonials,
                            enabled: checked,
                          },
                        }))
                      }
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {homepageData.testimonials.enabled ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Section Title (English)</Label>
                          <Input
                            value={homepageData.testimonials.title}
                            onChange={(e) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                testimonials: {
                                  ...prev.testimonials,
                                  title: e.target.value,
                                },
                              }))
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Section Title (Telugu)</Label>
                          <Input
                            value={homepageData.testimonials.titleTelugu}
                            onChange={(e) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                testimonials: {
                                  ...prev.testimonials,
                                  titleTelugu: e.target.value,
                                },
                              }))
                            }
                            className="mt-2 telugu-text"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Items Per View</Label>
                          <Select
                            value={homepageData.testimonials.settings.itemsPerView.toString()}
                            onValueChange={(value) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                testimonials: {
                                  ...prev.testimonials,
                                  settings: {
                                    ...prev.testimonials.settings,
                                    itemsPerView: parseInt(value),
                                  },
                                },
                              }))
                            }
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 testimonial</SelectItem>
                              <SelectItem value="2">2 testimonials</SelectItem>
                              <SelectItem value="3">3 testimonials</SelectItem>
                              <SelectItem value="4">4 testimonials</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between pt-6">
                          <Label>Auto Rotate</Label>
                          <Switch
                            checked={
                              homepageData.testimonials.settings.autoRotate
                            }
                            onCheckedChange={(checked) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                testimonials: {
                                  ...prev.testimonials,
                                  settings: {
                                    ...prev.testimonials.settings,
                                    autoRotate: checked,
                                  },
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between pt-6">
                          <Label>Show Ratings</Label>
                          <Switch
                            checked={
                              homepageData.testimonials.settings.showRatings
                            }
                            onCheckedChange={(checked) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                testimonials: {
                                  ...prev.testimonials,
                                  settings: {
                                    ...prev.testimonials.settings,
                                    showRatings: checked,
                                  },
                                },
                              }))
                            }
                          />
                        </div>
                      </div>

                      <div className="text-center py-8 border-2 border-dashed rounded-lg">
                        <Quote className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 mb-4">
                          No testimonials configured yet
                        </p>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Customer Testimonial
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Quote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        Testimonials Section Disabled
                      </h3>
                      <p>
                        Enable this section to showcase customer reviews and
                        build trust
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Newsletter */}
            <TabsContent value="newsletter" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Mail className="w-5 h-5 mr-2" />
                        Newsletter Signup
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Configure email newsletter subscription
                      </p>
                    </div>
                    <Switch
                      checked={homepageData.newsletter.enabled}
                      onCheckedChange={(checked) =>
                        setHomepageData((prev) => ({
                          ...prev,
                          newsletter: { ...prev.newsletter, enabled: checked },
                        }))
                      }
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {homepageData.newsletter.enabled ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Title (English)</Label>
                          <Input
                            value={homepageData.newsletter.title}
                            onChange={(e) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                newsletter: {
                                  ...prev.newsletter,
                                  title: e.target.value,
                                },
                              }))
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Title (Telugu)</Label>
                          <Input
                            value={homepageData.newsletter.titleTelugu}
                            onChange={(e) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                newsletter: {
                                  ...prev.newsletter,
                                  titleTelugu: e.target.value,
                                },
                              }))
                            }
                            className="mt-2 telugu-text"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Subtitle (English)</Label>
                          <Textarea
                            value={homepageData.newsletter.subtitle}
                            onChange={(e) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                newsletter: {
                                  ...prev.newsletter,
                                  subtitle: e.target.value,
                                },
                              }))
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Subtitle (Telugu)</Label>
                          <Textarea
                            value={homepageData.newsletter.subtitleTelugu}
                            onChange={(e) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                newsletter: {
                                  ...prev.newsletter,
                                  subtitleTelugu: e.target.value,
                                },
                              }))
                            }
                            className="mt-2 telugu-text"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label>Button Text (English)</Label>
                          <Input
                            value={homepageData.newsletter.buttonText}
                            onChange={(e) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                newsletter: {
                                  ...prev.newsletter,
                                  buttonText: e.target.value,
                                },
                              }))
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Button Text (Telugu)</Label>
                          <Input
                            value={homepageData.newsletter.buttonTextTelugu}
                            onChange={(e) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                newsletter: {
                                  ...prev.newsletter,
                                  buttonTextTelugu: e.target.value,
                                },
                              }))
                            }
                            className="mt-2 telugu-text"
                          />
                        </div>
                        <div>
                          <Label>Placeholder (English)</Label>
                          <Input
                            value={homepageData.newsletter.placeholder}
                            onChange={(e) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                newsletter: {
                                  ...prev.newsletter,
                                  placeholder: e.target.value,
                                },
                              }))
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Placeholder (Telugu)</Label>
                          <Input
                            value={homepageData.newsletter.placeholderTelugu}
                            onChange={(e) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                newsletter: {
                                  ...prev.newsletter,
                                  placeholderTelugu: e.target.value,
                                },
                              }))
                            }
                            className="mt-2 telugu-text"
                          />
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">
                          Email Service Integration
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Mailchimp API Key</Label>
                            <Input
                              type="password"
                              value={homepageData.newsletter.mailchimpApiKey}
                              onChange={(e) =>
                                setHomepageData((prev) => ({
                                  ...prev,
                                  newsletter: {
                                    ...prev.newsletter,
                                    mailchimpApiKey: e.target.value,
                                  },
                                }))
                              }
                              placeholder="Your Mailchimp API key"
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label>Mailchimp List ID</Label>
                            <Input
                              value={homepageData.newsletter.mailchimpListId}
                              onChange={(e) =>
                                setHomepageData((prev) => ({
                                  ...prev,
                                  newsletter: {
                                    ...prev.newsletter,
                                    mailchimpListId: e.target.value,
                                  },
                                }))
                              }
                              placeholder="Your Mailchimp list ID"
                              className="mt-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        Newsletter Section Disabled
                      </h3>
                      <p>Enable this section to collect email subscribers</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Social Media Links */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Globe className="w-5 h-5 mr-2" />
                        Social Media Links
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Connect with your audience on social platforms
                      </p>
                    </div>
                    <Switch
                      checked={homepageData.socialMedia.enabled}
                      onCheckedChange={(checked) =>
                        setHomepageData((prev) => ({
                          ...prev,
                          socialMedia: {
                            ...prev.socialMedia,
                            enabled: checked,
                          },
                        }))
                      }
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {homepageData.socialMedia.enabled ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Section Title (English)</Label>
                          <Input
                            value={homepageData.socialMedia.title}
                            onChange={(e) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                socialMedia: {
                                  ...prev.socialMedia,
                                  title: e.target.value,
                                },
                              }))
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Section Title (Telugu)</Label>
                          <Input
                            value={homepageData.socialMedia.titleTelugu}
                            onChange={(e) =>
                              setHomepageData((prev) => ({
                                ...prev,
                                socialMedia: {
                                  ...prev.socialMedia,
                                  titleTelugu: e.target.value,
                                },
                              }))
                            }
                            className="mt-2 telugu-text"
                          />
                        </div>
                      </div>

                      {homepageData.socialMedia.links.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed rounded-lg">
                          <Globe className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 mb-4">
                            No social media links configured yet
                          </p>
                          <Button onClick={addDefaultSocialMedia}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Default Links
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {homepageData.socialMedia.links.map((link) => (
                            <div
                              key={link.id}
                              className="flex items-center space-x-4 p-4 border rounded-lg"
                            >
                              <div
                                className="w-12 h-12 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: link.color + "20" }}
                              >
                                <div
                                  className="w-6 h-6"
                                  style={{ color: link.color }}
                                >
                                  <Globe className="w-full h-full" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium">
                                    {link.platform}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-1">
                                  {link.url}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Button variant="outline" className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Social Media Link
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        Social Media Section Disabled
                      </h3>
                      <p>
                        Enable this section to showcase your social media
                        presence
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* SEO Settings */}
            <TabsContent value="seo" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    SEO & Meta Settings
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Optimize your homepage for search engines
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Meta Title</Label>
                    <Input
                      value={homepageData.seo.metaTitle}
                      onChange={(e) =>
                        setHomepageData((prev) => ({
                          ...prev,
                          seo: { ...prev.seo, metaTitle: e.target.value },
                        }))
                      }
                      placeholder="TeluguBooks - Your Premier Destination for Telugu Literature"
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {homepageData.seo.metaTitle.length}/60 characters
                      (recommended)
                    </p>
                  </div>

                  <div>
                    <Label>Meta Description</Label>
                    <Textarea
                      value={homepageData.seo.metaDescription}
                      onChange={(e) =>
                        setHomepageData((prev) => ({
                          ...prev,
                          seo: { ...prev.seo, metaDescription: e.target.value },
                        }))
                      }
                      placeholder="Discover the finest collection of Telugu books with free delivery across India..."
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {homepageData.seo.metaDescription.length}/160 characters
                      (recommended)
                    </p>
                  </div>

                  <div>
                    <Label>Meta Keywords (comma separated)</Label>
                    <Input
                      value={homepageData.seo.metaKeywords.join(", ")}
                      onChange={(e) =>
                        setHomepageData((prev) => ({
                          ...prev,
                          seo: {
                            ...prev.seo,
                            metaKeywords: e.target.value
                              .split(",")
                              .map((k) => k.trim()),
                          },
                        }))
                      }
                      placeholder="telugu books, telugu literature, free delivery, devotional books"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Open Graph Image URL</Label>
                    <Input
                      value={homepageData.seo.ogImage}
                      onChange={(e) =>
                        setHomepageData((prev) => ({
                          ...prev,
                          seo: { ...prev.seo, ogImage: e.target.value },
                        }))
                      }
                      placeholder="https://yoursite.com/og-image.jpg"
                      className="mt-2"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Structured Data</Label>
                      <p className="text-sm text-gray-600">
                        Add JSON-LD structured data for better SEO
                      </p>
                    </div>
                    <Switch
                      checked={homepageData.seo.structuredData}
                      onCheckedChange={(checked) =>
                        setHomepageData((prev) => ({
                          ...prev,
                          seo: { ...prev.seo, structuredData: checked },
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
