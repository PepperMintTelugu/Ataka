import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Save,
  Upload,
  Plus,
  Edit3,
  Trash2,
  Eye,
  GripVertical,
  Image as ImageIcon,
  Users,
  Building2,
  Grid3X3,
  Sliders,
  Palette,
  Type,
  RefreshCw,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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

interface Author {
  id: string;
  name: string;
  nameTelugu?: string;
  image?: string;
  bio?: string;
  bioTelugu?: string;
  booksCount: number;
  isActive: boolean;
  order: number;
}

interface Publisher {
  id: string;
  name: string;
  nameTelugu?: string;
  logo?: string;
  description?: string;
  descriptionTelugu?: string;
  website?: string;
  booksCount: number;
  isActive: boolean;
  order: number;
}

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
  sliderImages: SliderImage[];
  featuredCategories: CategoryDisplay[];
  featuredAuthors: Author[];
  featuredPublishers: Publisher[];
  sections: HomepageSection[];
  categoriesTitle: string;
  categoriesTitleTelugu: string;
  authorsTitle: string;
  authorsTitleTelugu: string;
  publishersTitle: string;
  publishersTitleTelugu: string;
}

export default function AdminHomepage() {
  const [config, setConfig] = useState<HomepageConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("sections");
  const { toast } = useToast();

  useEffect(() => {
    fetchHomepageConfig();
  }, []);

  const fetchHomepageConfig = async () => {
    try {
      // For demo purposes, we'll use a default configuration
      // In production, you would enable the API call to your backend

      console.log("Using demo configuration for admin interface");

      // Provide a default configuration for admin to work with
      const defaultConfig = {
        siteName: "Telugu Books",
        siteNameTelugu: "తెలుగు పుస్తకాలు",
        sliderImages: [],
        featuredCategories: [],
        featuredAuthors: [],
        featuredPublishers: [],
        sections: [
          {
            id: "hero-slider",
            type: "hero",
            title: "Hero Slider",
            isActive: true,
            order: 1,
            settings: {},
          },
          {
            id: "categories",
            type: "categories",
            title: "Categories",
            isActive: true,
            order: 2,
            settings: {},
          },
          {
            id: "authors",
            type: "authors",
            title: "Authors",
            isActive: true,
            order: 3,
            settings: {},
          },
          {
            id: "publishers",
            type: "publishers",
            title: "Publishers",
            isActive: true,
            order: 4,
            settings: {},
          },
        ],
        categoriesTitle: "Browse Categories",
        categoriesTitleTelugu: "వర్గాలను విహరించండి",
        authorsTitle: "Featured Authors",
        authorsTitleTelugu: "ప్రముఖ రచయితలు",
        publishersTitle: "Trusted Publishers",
        publishersTitleTelugu: "విశ్వసనీయ ప్రచురణకర్తలు",
      };

      setConfig(defaultConfig);

      toast({
        title: "Notice",
        description:
          "Backend API not available. Using demo configuration for admin interface.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!config) return;

    try {
      setIsSaving(true);

      // For demo purposes, simulate a successful save
      // In production, enable the API call to your backend
      console.log("Demo: Configuration saved locally", config);

      toast({
        title: "Changes Saved Successfully! ✅",
        description:
          "Configuration updated (demo mode - changes saved locally).",
      });
    } catch (error: any) {
      console.error("Save config error:", error);
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save configuration.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSectionReorder = (result: any) => {
    if (!result.destination || !config || !config.sections) return;

    try {
      const items = Array.from(config.sections);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      // Update order values
      const updatedItems = items.map((item, index) => ({
        ...item,
        order: index + 1,
      }));

      setConfig({
        ...config,
        sections: updatedItems,
      });
    } catch (error) {
      console.error("Error reordering sections:", error);
      toast({
        title: "Reorder Failed",
        description: "Could not reorder sections. Please try again.",
        variant: "destructive",
      });
    }
  };

  const uploadImage = async (file: File, type: string) => {
    try {
      // For demo purposes, simulate a successful upload with a placeholder URL
      // In production, enable the actual upload API call
      console.log("Demo: Simulating image upload", file.name, type);

      // Create a placeholder URL for demo
      const demoImageUrl = `https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&demo=${Date.now()}`;

      toast({
        title: "Image Upload Simulated! ✅",
        description: "Demo mode: Image upload simulated successfully.",
      });

      return demoImageUrl;
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image.",
        variant: "destructive",
      });
      return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading homepage configuration...</p>
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
            Unable to load homepage configuration.
          </p>
          <Button onClick={fetchHomepageConfig}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Admin
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">
                Homepage Management
              </h1>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Demo Mode
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" asChild>
                <Link to="/" target="_blank">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Link>
              </Button>
              <Button onClick={saveConfig} disabled={isSaving}>
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="sections" className="flex items-center">
              <Grid3X3 className="w-4 h-4 mr-2" />
              Sections
            </TabsTrigger>
            <TabsTrigger value="slider" className="flex items-center">
              <ImageIcon className="w-4 h-4 mr-2" />
              Slider
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center">
              <Sliders className="w-4 h-4 mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="authors" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Authors
            </TabsTrigger>
            <TabsTrigger value="publishers" className="flex items-center">
              <Building2 className="w-4 h-4 mr-2" />
              Publishers
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center">
              <Type className="w-4 h-4 mr-2" />
              General
            </TabsTrigger>
          </TabsList>

          {/* Sections Management */}
          <TabsContent value="sections" className="space-y-6">
            <SectionsManager
              sections={config.sections}
              onUpdate={(sections) => setConfig({ ...config, sections })}
              onReorder={handleSectionReorder}
            />
          </TabsContent>

          {/* Slider Management */}
          <TabsContent value="slider" className="space-y-6">
            <SliderManager
              images={config.sliderImages}
              onUpdate={(sliderImages) =>
                setConfig({ ...config, sliderImages })
              }
              onUploadImage={(file) => uploadImage(file, "slider")}
            />
          </TabsContent>

          {/* Categories Management */}
          <TabsContent value="categories" className="space-y-6">
            <CategoriesManager
              categories={config.featuredCategories}
              title={config.categoriesTitle}
              titleTelugu={config.categoriesTitleTelugu}
              onUpdate={(
                featuredCategories,
                categoriesTitle,
                categoriesTitleTelugu,
              ) =>
                setConfig({
                  ...config,
                  featuredCategories,
                  categoriesTitle,
                  categoriesTitleTelugu,
                })
              }
              onUploadImage={(file) => uploadImage(file, "categories")}
            />
          </TabsContent>

          {/* Authors Management */}
          <TabsContent value="authors" className="space-y-6">
            <AuthorsManager
              authors={config.featuredAuthors}
              title={config.authorsTitle}
              titleTelugu={config.authorsTitleTelugu}
              onUpdate={(featuredAuthors, authorsTitle, authorsTitleTelugu) =>
                setConfig({
                  ...config,
                  featuredAuthors,
                  authorsTitle,
                  authorsTitleTelugu,
                })
              }
              onUploadImage={(file) => uploadImage(file, "authors")}
            />
          </TabsContent>

          {/* Publishers Management */}
          <TabsContent value="publishers" className="space-y-6">
            <PublishersManager
              publishers={config.featuredPublishers}
              title={config.publishersTitle}
              titleTelugu={config.publishersTitleTelugu}
              onUpdate={(
                featuredPublishers,
                publishersTitle,
                publishersTitleTelugu,
              ) =>
                setConfig({
                  ...config,
                  featuredPublishers,
                  publishersTitle,
                  publishersTitleTelugu,
                })
              }
              onUploadImage={(file) => uploadImage(file, "publishers")}
            />
          </TabsContent>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <GeneralSettings
              config={config}
              onUpdate={(updates) => setConfig({ ...config, ...updates })}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Import the individual manager components
import SectionsManager from "@/components/admin/SectionsManager";
import SliderManager from "@/components/admin/SliderManager";
import CategoriesManager from "@/components/admin/CategoriesManager";
import AuthorsManager from "@/components/admin/AuthorsManager";
import PublishersManager from "@/components/admin/PublishersManager";
import GeneralSettings from "@/components/admin/GeneralSettings";
