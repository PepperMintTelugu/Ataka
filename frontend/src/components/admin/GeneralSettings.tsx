import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Settings,
  Globe,
  Palette,
  Search,
  Share2,
  Mail,
  Shield,
  BarChart3,
  MessageSquare,
} from "lucide-react";

interface HomepageConfig {
  siteName: string;
  siteNameTelugu: string;
  sliderImages: any[];
  featuredCategories: any[];
  featuredAuthors: any[];
  featuredPublishers: any[];
  sections: any[];
  categoriesTitle: string;
  categoriesTitleTelugu: string;
  authorsTitle: string;
  authorsTitleTelugu: string;
  publishersTitle: string;
  publishersTitleTelugu: string;
}

interface GeneralSettingsProps {
  config: HomepageConfig;
  onUpdate: (updates: Partial<HomepageConfig>) => void;
}

export default function GeneralSettings({
  config,
  onUpdate,
}: GeneralSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Site Information State
  const [siteInfo, setSiteInfo] = useState({
    siteName: config.siteName || "",
    siteNameTelugu: config.siteNameTelugu || "",
    tagline: "Your Digital Telugu Library",
    taglineTelugu: "మీ డిజిటల్ తెలుగు గ్రంథాలయం",
    description:
      "Discover the finest collection of Telugu books from classic literature to modern stories.",
    descriptionTelugu:
      "క్లాసిక్ సాహిత్యం నుండి ఆధునిక కథల వరకు తెలుగు పుస్తకాల అత్యుత్తమ సంగ్రహాన్ని కనుగొనండి.",
  });

  // SEO Settings State
  const [seoSettings, setSeoSettings] = useState({
    metaTitle: "Telugu Books Online - Buy Best Telugu Literature",
    metaTitleTelugu:
      "తెలుగు పుస్తకాలు ఆన్‌లైన్ - ఉత్తమ తెలుగు సాహిత్యాన్ని కొనండి",
    metaDescription:
      "Shop for authentic Telugu books online. Classic literature, modern stories, educational books and more. Free delivery across India.",
    metaDescriptionTelugu:
      "ప్రామాణిక తెలుగు పుస్తకాలను ఆన్‌లైన్‌లో కొనుగోలు చేయండి. క్లాసిక్ సాహిత్యం, ఆధునిక కథలు, విద్యా పుస్తకాలు మరియు మరిన్ని. భారతదేశం అంతటా ఉచిత డెలివరీ.",
    keywords:
      "telugu books, telugu literature, telugu novels, telugu poetry, telugu educational books",
    ogImage: "/api/placeholder/1200/630",
    structuredData: true,
    sitemap: true,
    robots: "index, follow",
  });

  // Social Media State
  const [socialMedia, setSocialMedia] = useState({
    facebook: "https://facebook.com/telugubooks",
    instagram: "https://instagram.com/telugubooks",
    twitter: "https://twitter.com/telugubooks",
    youtube: "https://youtube.com/telugubooks",
    whatsapp: "+91 90000 00000",
    telegram: "https://t.me/telugubooks",
  });

  // Analytics State
  const [analytics, setAnalytics] = useState({
    googleAnalyticsId: "",
    googleTagManagerId: "",
    facebookPixelId: "",
    hotjarId: "",
    enableTracking: true,
    enableCookieConsent: true,
  });

  // Contact Information State
  const [contactInfo, setContactInfo] = useState({
    email: "info@telugubooks.com",
    phone: "+91 90000 00000",
    whatsapp: "+91 90000 00000",
    address: "Hyderabad, Telangana, India",
    businessHours: "Monday - Saturday: 9:00 AM - 6:00 PM",
    businessHoursTelugu: "సోమవారం - శనివారం: ఉదయం 9:00 - సాయంత్రం 6:00",
  });

  const updateSettings = (section: string, updates: any) => {
    switch (section) {
      case "site":
        setSiteInfo({ ...siteInfo, ...updates });
        onUpdate({
          siteName: updates.siteName || siteInfo.siteName,
          siteNameTelugu: updates.siteNameTelugu || siteInfo.siteNameTelugu,
        });
        break;
      case "seo":
        setSeoSettings({ ...seoSettings, ...updates });
        break;
      case "social":
        setSocialMedia({ ...socialMedia, ...updates });
        break;
      case "analytics":
        setAnalytics({ ...analytics, ...updates });
        break;
      case "contact":
        setContactInfo({ ...contactInfo, ...updates });
        break;
    }

    toast({
      title: "Settings Updated! ✅",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            General Homepage Settings
          </CardTitle>
          <p className="text-sm text-gray-600">
            Configure global settings for your Telugu books ecommerce site.
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="site" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="site" className="flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Site Info
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center">
                <Search className="w-4 h-4 mr-2" />
                SEO
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center">
                <Share2 className="w-4 h-4 mr-2" />
                Social
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </TabsTrigger>
            </TabsList>

            {/* Site Information */}
            <TabsContent value="site" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Site Name (English)</Label>
                  <Input
                    id="siteName"
                    value={siteInfo.siteName}
                    onChange={(e) =>
                      updateSettings("site", { siteName: e.target.value })
                    }
                    placeholder="Telugu Books Store"
                  />
                </div>
                <div>
                  <Label htmlFor="siteNameTelugu">Site Name (Telugu)</Label>
                  <Input
                    id="siteNameTelugu"
                    value={siteInfo.siteNameTelugu}
                    onChange={(e) =>
                      updateSettings("site", { siteNameTelugu: e.target.value })
                    }
                    placeholder="తెలుగు పుస్తకాల దుకాణం"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tagline">Tagline (English)</Label>
                  <Input
                    id="tagline"
                    value={siteInfo.tagline}
                    onChange={(e) =>
                      updateSettings("site", { tagline: e.target.value })
                    }
                    placeholder="Your Digital Telugu Library"
                  />
                </div>
                <div>
                  <Label htmlFor="taglineTelugu">Tagline (Telugu)</Label>
                  <Input
                    id="taglineTelugu"
                    value={siteInfo.taglineTelugu}
                    onChange={(e) =>
                      updateSettings("site", { taglineTelugu: e.target.value })
                    }
                    placeholder="మీ డిజిటల్ తెలుగు గ్రంథాలయం"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description">
                    Site Description (English)
                  </Label>
                  <Textarea
                    id="description"
                    value={siteInfo.description}
                    onChange={(e) =>
                      updateSettings("site", { description: e.target.value })
                    }
                    placeholder="Describe your Telugu books store"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="descriptionTelugu">
                    Site Description (Telugu)
                  </Label>
                  <Textarea
                    id="descriptionTelugu"
                    value={siteInfo.descriptionTelugu}
                    onChange={(e) =>
                      updateSettings("site", {
                        descriptionTelugu: e.target.value,
                      })
                    }
                    placeholder="మీ తెలుగు పుస్తకాల దుకాణాన్ని వివరించండి"
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>

            {/* SEO Settings */}
            <TabsContent value="seo" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="metaTitle">Meta Title (English)</Label>
                  <Input
                    id="metaTitle"
                    value={seoSettings.metaTitle}
                    onChange={(e) =>
                      updateSettings("seo", { metaTitle: e.target.value })
                    }
                    placeholder="Telugu Books Online - Buy Best Telugu Literature"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Max 60 characters for optimal SEO
                  </p>
                </div>
                <div>
                  <Label htmlFor="metaTitleTelugu">Meta Title (Telugu)</Label>
                  <Input
                    id="metaTitleTelugu"
                    value={seoSettings.metaTitleTelugu}
                    onChange={(e) =>
                      updateSettings("seo", { metaTitleTelugu: e.target.value })
                    }
                    placeholder="తెలుగు పుస్తకాలు ఆన్‌లైన్"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="metaDescription">
                    Meta Description (English)
                  </Label>
                  <Textarea
                    id="metaDescription"
                    value={seoSettings.metaDescription}
                    onChange={(e) =>
                      updateSettings("seo", { metaDescription: e.target.value })
                    }
                    placeholder="Shop for authentic Telugu books online..."
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Max 160 characters for optimal SEO
                  </p>
                </div>
                <div>
                  <Label htmlFor="metaDescriptionTelugu">
                    Meta Description (Telugu)
                  </Label>
                  <Textarea
                    id="metaDescriptionTelugu"
                    value={seoSettings.metaDescriptionTelugu}
                    onChange={(e) =>
                      updateSettings("seo", {
                        metaDescriptionTelugu: e.target.value,
                      })
                    }
                    placeholder="ప్రామాణిక తెలుగు పుస్తకాలను ఆన్‌లైన్‌లో కొనుగోలు చేయండి..."
                    rows={3}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                <Textarea
                  id="keywords"
                  value={seoSettings.keywords}
                  onChange={(e) =>
                    updateSettings("seo", { keywords: e.target.value })
                  }
                  placeholder="telugu books, telugu literature, telugu novels..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="robots">Robots Meta Tag</Label>
                  <Select
                    value={seoSettings.robots}
                    onValueChange={(value) =>
                      updateSettings("seo", { robots: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="index, follow">
                        Index, Follow
                      </SelectItem>
                      <SelectItem value="noindex, nofollow">
                        No Index, No Follow
                      </SelectItem>
                      <SelectItem value="index, nofollow">
                        Index, No Follow
                      </SelectItem>
                      <SelectItem value="noindex, follow">
                        No Index, Follow
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    checked={seoSettings.structuredData}
                    onCheckedChange={(checked) =>
                      updateSettings("seo", { structuredData: checked })
                    }
                  />
                  <Label>Enable Structured Data</Label>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    checked={seoSettings.sitemap}
                    onCheckedChange={(checked) =>
                      updateSettings("seo", { sitemap: checked })
                    }
                  />
                  <Label>Generate Sitemap</Label>
                </div>
              </div>
            </TabsContent>

            {/* Social Media */}
            <TabsContent value="social" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebook">Facebook Page URL</Label>
                  <Input
                    id="facebook"
                    value={socialMedia.facebook}
                    onChange={(e) =>
                      updateSettings("social", { facebook: e.target.value })
                    }
                    placeholder="https://facebook.com/telugubooks"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram Profile URL</Label>
                  <Input
                    id="instagram"
                    value={socialMedia.instagram}
                    onChange={(e) =>
                      updateSettings("social", { instagram: e.target.value })
                    }
                    placeholder="https://instagram.com/telugubooks"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="twitter">Twitter Profile URL</Label>
                  <Input
                    id="twitter"
                    value={socialMedia.twitter}
                    onChange={(e) =>
                      updateSettings("social", { twitter: e.target.value })
                    }
                    placeholder="https://twitter.com/telugubooks"
                  />
                </div>
                <div>
                  <Label htmlFor="youtube">YouTube Channel URL</Label>
                  <Input
                    id="youtube"
                    value={socialMedia.youtube}
                    onChange={(e) =>
                      updateSettings("social", { youtube: e.target.value })
                    }
                    placeholder="https://youtube.com/telugubooks"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    value={socialMedia.whatsapp}
                    onChange={(e) =>
                      updateSettings("social", { whatsapp: e.target.value })
                    }
                    placeholder="+91 90000 00000"
                  />
                </div>
                <div>
                  <Label htmlFor="telegram">Telegram Channel URL</Label>
                  <Input
                    id="telegram"
                    value={socialMedia.telegram}
                    onChange={(e) =>
                      updateSettings("social", { telegram: e.target.value })
                    }
                    placeholder="https://t.me/telugubooks"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                  <Input
                    id="googleAnalyticsId"
                    value={analytics.googleAnalyticsId}
                    onChange={(e) =>
                      updateSettings("analytics", {
                        googleAnalyticsId: e.target.value,
                      })
                    }
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
                <div>
                  <Label htmlFor="googleTagManagerId">
                    Google Tag Manager ID
                  </Label>
                  <Input
                    id="googleTagManagerId"
                    value={analytics.googleTagManagerId}
                    onChange={(e) =>
                      updateSettings("analytics", {
                        googleTagManagerId: e.target.value,
                      })
                    }
                    placeholder="GTM-XXXXXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                  <Input
                    id="facebookPixelId"
                    value={analytics.facebookPixelId}
                    onChange={(e) =>
                      updateSettings("analytics", {
                        facebookPixelId: e.target.value,
                      })
                    }
                    placeholder="123456789012345"
                  />
                </div>
                <div>
                  <Label htmlFor="hotjarId">Hotjar Site ID</Label>
                  <Input
                    id="hotjarId"
                    value={analytics.hotjarId}
                    onChange={(e) =>
                      updateSettings("analytics", { hotjarId: e.target.value })
                    }
                    placeholder="1234567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={analytics.enableTracking}
                    onCheckedChange={(checked) =>
                      updateSettings("analytics", { enableTracking: checked })
                    }
                  />
                  <Label>Enable Analytics Tracking</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={analytics.enableCookieConsent}
                    onCheckedChange={(checked) =>
                      updateSettings("analytics", {
                        enableCookieConsent: checked,
                      })
                    }
                  />
                  <Label>Show Cookie Consent Banner</Label>
                </div>
              </div>
            </TabsContent>

            {/* Contact Information */}
            <TabsContent value="contact" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Business Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) =>
                      updateSettings("contact", { email: e.target.value })
                    }
                    placeholder="info@telugubooks.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={contactInfo.phone}
                    onChange={(e) =>
                      updateSettings("contact", { phone: e.target.value })
                    }
                    placeholder="+91 90000 00000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="whatsappContact">WhatsApp Business</Label>
                  <Input
                    id="whatsappContact"
                    value={contactInfo.whatsapp}
                    onChange={(e) =>
                      updateSettings("contact", { whatsapp: e.target.value })
                    }
                    placeholder="+91 90000 00000"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Business Address</Label>
                  <Input
                    id="address"
                    value={contactInfo.address}
                    onChange={(e) =>
                      updateSettings("contact", { address: e.target.value })
                    }
                    placeholder="Hyderabad, Telangana, India"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessHours">
                    Business Hours (English)
                  </Label>
                  <Input
                    id="businessHours"
                    value={contactInfo.businessHours}
                    onChange={(e) =>
                      updateSettings("contact", {
                        businessHours: e.target.value,
                      })
                    }
                    placeholder="Monday - Saturday: 9:00 AM - 6:00 PM"
                  />
                </div>
                <div>
                  <Label htmlFor="businessHoursTelugu">
                    Business Hours (Telugu)
                  </Label>
                  <Input
                    id="businessHoursTelugu"
                    value={contactInfo.businessHoursTelugu}
                    onChange={(e) =>
                      updateSettings("contact", {
                        businessHoursTelugu: e.target.value,
                      })
                    }
                    placeholder="సోమవారం - శనివారం: ఉదయం 9:00 - సాయంత్రం 6:00"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-6 border-t">
            <Button>
              <Settings className="w-4 h-4 mr-2" />
              Save All Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
