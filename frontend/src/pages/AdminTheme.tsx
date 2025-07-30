import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  RefreshCw,
  Upload,
  Palette,
  Type,
  Image,
  Eye,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useTheme, useBrandedComponents } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";

export default function AdminTheme() {
  const { settings, updateSettings, resetToDefault } = useTheme();
  const { BrandedButton, BrandLogo } = useBrandedComponents();
  const { toast } = useToast();
  const [tempSettings, setTempSettings] = useState(settings);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);

  const handleInputChange = (section: string, field: string, value: string) => {
    setTempSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleButtonStyleChange = (
    button: string,
    field: string,
    value: string,
  ) => {
    setTempSettings((prev) => ({
      ...prev,
      buttons: {
        ...prev.buttons,
        [button]: {
          ...prev.buttons[button as keyof typeof prev.buttons],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = () => {
    updateSettings(tempSettings);
    toast({
      title: "Settings Saved",
      description: "Theme settings have been updated successfully.",
    });
  };

  const handleReset = () => {
    resetToDefault();
    setTempSettings(settings);
    toast({
      title: "Settings Reset",
      description: "Theme settings have been reset to default.",
    });
  };

  const handlePreview = () => {
    updateSettings(tempSettings);
    toast({
      title: "Preview Updated",
      description: "Theme preview has been updated.",
    });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setTempSettings((prev) => ({
        ...prev,
        brand: {
          ...prev.brand,
          logo: previewUrl,
        },
      }));
    }
  };

  const handleFaviconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFaviconFile(file);
      const previewUrl = URL.createObjectURL(file);
      setTempSettings((prev) => ({
        ...prev,
        brand: {
          ...prev.brand,
          favicon: previewUrl,
        },
      }));
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(tempSettings, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "telugu-books-theme.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Admin</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">
                Theme Customization
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={exportSettings}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="brand" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="brand">Brand</TabsTrigger>
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="buttons">Buttons</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              {/* Brand Settings */}
              <TabsContent value="brand" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Type className="w-5 h-5 mr-2" />
                      Brand Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="brandName">Brand Name</Label>
                        <Input
                          id="brandName"
                          value={tempSettings.brand.name}
                          onChange={(e) =>
                            handleInputChange("brand", "name", e.target.value)
                          }
                          placeholder="TeluguBooks"
                        />
                      </div>
                      <div>
                        <Label htmlFor="brandNameTelugu">
                          Brand Name (Telugu)
                        </Label>
                        <Input
                          id="brandNameTelugu"
                          value={tempSettings.brand.nameTelugu}
                          onChange={(e) =>
                            handleInputChange(
                              "brand",
                              "nameTelugu",
                              e.target.value,
                            )
                          }
                          placeholder="తెలుగు పుస్తకాలు"
                          className="telugu-text"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="tagline">Tagline</Label>
                      <Input
                        id="tagline"
                        value={tempSettings.brand.tagline}
                        onChange={(e) =>
                          handleInputChange("brand", "tagline", e.target.value)
                        }
                        placeholder="Preserving and promoting Telugu literature"
                      />
                    </div>

                    <div>
                      <Label htmlFor="taglineTelugu">Tagline (Telugu)</Label>
                      <Input
                        id="taglineTelugu"
                        value={tempSettings.brand.taglineTelugu}
                        onChange={(e) =>
                          handleInputChange(
                            "brand",
                            "taglineTelugu",
                            e.target.value,
                          )
                        }
                        placeholder="తెలుగు సాహిత్య ప్రేమికుల కోసం"
                        className="telugu-text"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Image className="w-5 h-5 mr-2" />
                      Logo & Images
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label>Logo</Label>
                      <div className="mt-2 flex items-center space-x-4">
                        <div className="w-32 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                          <img
                            src={tempSettings.brand.logo}
                            alt="Logo preview"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                            id="logo-upload"
                          />
                          <Button asChild variant="outline">
                            <label
                              htmlFor="logo-upload"
                              className="cursor-pointer"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Logo
                            </label>
                          </Button>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG up to 2MB
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Favicon</Label>
                      <div className="mt-2 flex items-center space-x-4">
                        <div className="w-8 h-8 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                          <img
                            src={tempSettings.brand.favicon}
                            alt="Favicon preview"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFaviconUpload}
                            className="hidden"
                            id="favicon-upload"
                          />
                          <Button asChild variant="outline" size="sm">
                            <label
                              htmlFor="favicon-upload"
                              className="cursor-pointer"
                            >
                              <Upload className="w-3 h-3 mr-1" />
                              Upload
                            </label>
                          </Button>
                          <p className="text-xs text-gray-500 mt-1">
                            ICO, PNG 32x32px
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Color Settings */}
              <TabsContent value="colors" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Palette className="w-5 h-5 mr-2" />
                      Theme Colors
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            id="primaryColor"
                            type="color"
                            value={tempSettings.theme.primary}
                            onChange={(e) =>
                              handleInputChange(
                                "theme",
                                "primary",
                                e.target.value,
                              )
                            }
                            className="w-12 h-10 p-1 border rounded"
                          />
                          <Input
                            value={tempSettings.theme.primary}
                            onChange={(e) =>
                              handleInputChange(
                                "theme",
                                "primary",
                                e.target.value,
                              )
                            }
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="secondaryColor">Secondary Color</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            id="secondaryColor"
                            type="color"
                            value={tempSettings.theme.secondary}
                            onChange={(e) =>
                              handleInputChange(
                                "theme",
                                "secondary",
                                e.target.value,
                              )
                            }
                            className="w-12 h-10 p-1 border rounded"
                          />
                          <Input
                            value={tempSettings.theme.secondary}
                            onChange={(e) =>
                              handleInputChange(
                                "theme",
                                "secondary",
                                e.target.value,
                              )
                            }
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="accentColor">Accent Color</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            id="accentColor"
                            type="color"
                            value={tempSettings.theme.accent}
                            onChange={(e) =>
                              handleInputChange(
                                "theme",
                                "accent",
                                e.target.value,
                              )
                            }
                            className="w-12 h-10 p-1 border rounded"
                          />
                          <Input
                            value={tempSettings.theme.accent}
                            onChange={(e) =>
                              handleInputChange(
                                "theme",
                                "accent",
                                e.target.value,
                              )
                            }
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="backgroundColor">Background</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            id="backgroundColor"
                            type="color"
                            value={tempSettings.theme.background}
                            onChange={(e) =>
                              handleInputChange(
                                "theme",
                                "background",
                                e.target.value,
                              )
                            }
                            className="w-12 h-10 p-1 border rounded"
                          />
                          <Input
                            value={tempSettings.theme.background}
                            onChange={(e) =>
                              handleInputChange(
                                "theme",
                                "background",
                                e.target.value,
                              )
                            }
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="textColor">Text Color</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            id="textColor"
                            type="color"
                            value={tempSettings.theme.text}
                            onChange={(e) =>
                              handleInputChange("theme", "text", e.target.value)
                            }
                            className="w-12 h-10 p-1 border rounded"
                          />
                          <Input
                            value={tempSettings.theme.text}
                            onChange={(e) =>
                              handleInputChange("theme", "text", e.target.value)
                            }
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="mutedColor">Muted Color</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            id="mutedColor"
                            type="color"
                            value={tempSettings.theme.muted}
                            onChange={(e) =>
                              handleInputChange(
                                "theme",
                                "muted",
                                e.target.value,
                              )
                            }
                            className="w-12 h-10 p-1 border rounded"
                          />
                          <Input
                            value={tempSettings.theme.muted}
                            onChange={(e) =>
                              handleInputChange(
                                "theme",
                                "muted",
                                e.target.value,
                              )
                            }
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Button Settings */}
              <TabsContent value="buttons" className="space-y-6">
                {["addToCart", "buyNow", "wishlist"].map((buttonType) => (
                  <Card key={buttonType}>
                    <CardHeader>
                      <CardTitle className="capitalize">
                        {buttonType === "addToCart"
                          ? "Add to Cart"
                          : buttonType === "buyNow"
                            ? "Buy Now"
                            : "Wishlist"}{" "}
                        Button
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Background Color</Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Input
                              type="color"
                              value={
                                tempSettings.buttons[
                                  buttonType as keyof typeof tempSettings.buttons
                                ].backgroundColor
                              }
                              onChange={(e) =>
                                handleButtonStyleChange(
                                  buttonType,
                                  "backgroundColor",
                                  e.target.value,
                                )
                              }
                              className="w-12 h-10 p-1 border rounded"
                            />
                            <Input
                              value={
                                tempSettings.buttons[
                                  buttonType as keyof typeof tempSettings.buttons
                                ].backgroundColor
                              }
                              onChange={(e) =>
                                handleButtonStyleChange(
                                  buttonType,
                                  "backgroundColor",
                                  e.target.value,
                                )
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Text Color</Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Input
                              type="color"
                              value={
                                tempSettings.buttons[
                                  buttonType as keyof typeof tempSettings.buttons
                                ].textColor
                              }
                              onChange={(e) =>
                                handleButtonStyleChange(
                                  buttonType,
                                  "textColor",
                                  e.target.value,
                                )
                              }
                              className="w-12 h-10 p-1 border rounded"
                            />
                            <Input
                              value={
                                tempSettings.buttons[
                                  buttonType as keyof typeof tempSettings.buttons
                                ].textColor
                              }
                              onChange={(e) =>
                                handleButtonStyleChange(
                                  buttonType,
                                  "textColor",
                                  e.target.value,
                                )
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Hover Color</Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Input
                              type="color"
                              value={
                                tempSettings.buttons[
                                  buttonType as keyof typeof tempSettings.buttons
                                ].hoverColor
                              }
                              onChange={(e) =>
                                handleButtonStyleChange(
                                  buttonType,
                                  "hoverColor",
                                  e.target.value,
                                )
                              }
                              className="w-12 h-10 p-1 border rounded"
                            />
                            <Input
                              value={
                                tempSettings.buttons[
                                  buttonType as keyof typeof tempSettings.buttons
                                ].hoverColor
                              }
                              onChange={(e) =>
                                handleButtonStyleChange(
                                  buttonType,
                                  "hoverColor",
                                  e.target.value,
                                )
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Button Preview */}
                      <div className="pt-4 border-t">
                        <Label>Preview:</Label>
                        <div className="mt-2">
                          <BrandedButton
                            variant={
                              buttonType as "addToCart" | "buyNow" | "wishlist"
                            }
                            className="px-6 py-2"
                          >
                            {buttonType === "addToCart"
                              ? "Add to Cart"
                              : buttonType === "buyNow"
                                ? "Buy Now"
                                : "♡ Wishlist"}
                          </BrandedButton>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Advanced Settings */}
              <TabsContent value="advanced" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Import/Export Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Export Current Settings</Label>
                      <p className="text-sm text-gray-600 mb-2">
                        Download your current theme settings as a JSON file.
                      </p>
                      <Button onClick={exportSettings} variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export Settings
                      </Button>
                    </div>

                    <Separator />

                    <div>
                      <Label>Reset to Default</Label>
                      <p className="text-sm text-gray-600 mb-2">
                        Reset all theme settings to their default values.
                      </p>
                      <Button onClick={handleReset} variant="destructive">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset to Default
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Brand Preview */}
                  <div className="p-4 border rounded-lg">
                    <BrandLogo />
                  </div>

                  {/* Color Swatches */}
                  <div>
                    <Label className="text-sm font-medium">Colors</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="text-center">
                        <div
                          className="w-full h-8 rounded border"
                          style={{
                            backgroundColor: tempSettings.theme.primary,
                          }}
                        ></div>
                        <span className="text-xs">Primary</span>
                      </div>
                      <div className="text-center">
                        <div
                          className="w-full h-8 rounded border"
                          style={{
                            backgroundColor: tempSettings.theme.secondary,
                          }}
                        ></div>
                        <span className="text-xs">Secondary</span>
                      </div>
                      <div className="text-center">
                        <div
                          className="w-full h-8 rounded border"
                          style={{
                            backgroundColor: tempSettings.theme.accent,
                          }}
                        ></div>
                        <span className="text-xs">Accent</span>
                      </div>
                    </div>
                  </div>

                  {/* Button Previews */}
                  <div>
                    <Label className="text-sm font-medium">Buttons</Label>
                    <div className="space-y-2 mt-2">
                      <BrandedButton
                        variant="addToCart"
                        className="w-full py-2 text-sm"
                      >
                        Add to Cart
                      </BrandedButton>
                      <BrandedButton
                        variant="buyNow"
                        className="w-full py-2 text-sm"
                      >
                        Buy Now
                      </BrandedButton>
                      <BrandedButton
                        variant="wishlist"
                        className="w-full py-2 text-sm"
                      >
                        ♡ Wishlist
                      </BrandedButton>
                    </div>
                  </div>

                  {/* Sample Book Card */}
                  <div>
                    <Label className="text-sm font-medium">Sample Card</Label>
                    <div
                      className="mt-2 p-4 border rounded-lg"
                      style={{
                        backgroundColor: tempSettings.theme.background,
                      }}
                    >
                      <div className="space-y-2">
                        <h4
                          className="font-semibold text-sm"
                          style={{ color: tempSettings.theme.text }}
                        >
                          Sample Book Title
                        </h4>
                        <p
                          className="text-xs"
                          style={{ color: tempSettings.theme.muted }}
                        >
                          by Author Name
                        </p>
                        <div
                          className="text-lg font-bold"
                          style={{ color: tempSettings.theme.primary }}
                        >
                          ₹299
                        </div>
                        <BrandedButton
                          variant="addToCart"
                          className="w-full py-1 text-xs"
                        >
                          Add to Cart
                        </BrandedButton>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
