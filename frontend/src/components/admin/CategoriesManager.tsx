import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
  Plus,
  Edit3,
  Trash2,
  Upload,
  Eye,
  EyeOff,
  Grid3X3,
  GripVertical,
  Palette,
  BookOpen,
  Heart,
  Star,
  Users,
  Lightbulb,
  Award,
  Globe,
  Music,
} from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { categories } from "@/data/books";

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

interface CategoriesManagerProps {
  categories: CategoryDisplay[];
  title: string;
  titleTelugu: string;
  onUpdate: (
    categories: CategoryDisplay[],
    title: string,
    titleTelugu: string,
  ) => void;
  onUploadImage: (file: File) => Promise<string | null>;
}

const iconOptions = [
  { value: "BookOpen", label: "Book", icon: BookOpen },
  { value: "Heart", label: "Heart", icon: Heart },
  { value: "Star", label: "Star", icon: Star },
  { value: "Users", label: "Users", icon: Users },
  { value: "Lightbulb", label: "Ideas", icon: Lightbulb },
  { value: "Award", label: "Award", icon: Award },
  { value: "Globe", label: "Globe", icon: Globe },
  { value: "Music", label: "Music", icon: Music },
];

const colorOptions = [
  { value: "#3B82F6", label: "Blue", class: "bg-blue-500" },
  { value: "#10B981", label: "Green", class: "bg-green-500" },
  { value: "#8B5CF6", label: "Purple", class: "bg-purple-500" },
  { value: "#F59E0B", label: "Orange", class: "bg-orange-500" },
  { value: "#EF4444", label: "Red", class: "bg-red-500" },
  { value: "#6366F1", label: "Indigo", class: "bg-indigo-500" },
  { value: "#EC4899", label: "Pink", class: "bg-pink-500" },
  { value: "#14B8A6", label: "Teal", class: "bg-teal-500" },
];

export default function CategoriesManager({
  categories: displayCategories,
  title,
  titleTelugu,
  onUpdate,
  onUploadImage,
}: CategoriesManagerProps) {
  const [sectionTitle, setSectionTitle] = useState(title);
  const [sectionTitleTelugu, setSectionTitleTelugu] = useState(titleTelugu);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryDisplay | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const [newCategory, setNewCategory] = useState<
    Omit<CategoryDisplay, "order">
  >({
    categoryId: "",
    name: "",
    nameTelugu: "",
    description: "",
    descriptionTelugu: "",
    image: "",
    icon: "BookOpen",
    color: "#3B82F6",
    isActive: true,
  });

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    isEditing = false,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await onUploadImage(file);

      if (imageUrl) {
        if (isEditing && editingCategory) {
          setEditingCategory({ ...editingCategory, image: imageUrl });
        } else {
          setNewCategory({ ...newCategory, image: imageUrl });
        }

        toast({
          title: "Image Uploaded! ✅",
          description: "Category image has been uploaded successfully.",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const addCategory = () => {
    if (!newCategory.name || !newCategory.categoryId) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a category name and ID.",
        variant: "destructive",
      });
      return;
    }

    const category: CategoryDisplay = {
      ...newCategory,
      order: displayCategories.length + 1,
    };

    const updatedCategories = [...displayCategories, category];
    onUpdate(updatedCategories, sectionTitle, sectionTitleTelugu);

    setNewCategory({
      categoryId: "",
      name: "",
      nameTelugu: "",
      description: "",
      descriptionTelugu: "",
      image: "",
      icon: "BookOpen",
      color: "#3B82F6",
      isActive: true,
    });
    setIsAddingCategory(false);

    toast({
      title: "Category Added! ✅",
      description: "New category has been added to the homepage.",
    });
  };

  const updateCategory = () => {
    if (!editingCategory) return;

    const updatedCategories = displayCategories.map((cat) =>
      cat.categoryId === editingCategory.categoryId ? editingCategory : cat,
    );
    onUpdate(updatedCategories, sectionTitle, sectionTitleTelugu);
    setEditingCategory(null);

    toast({
      title: "Category Updated! ✅",
      description: "Category has been updated successfully.",
    });
  };

  const deleteCategory = (categoryId: string) => {
    const updatedCategories = displayCategories
      .filter((cat) => cat.categoryId !== categoryId)
      .map((cat, index) => ({ ...cat, order: index + 1 }));
    onUpdate(updatedCategories, sectionTitle, sectionTitleTelugu);

    toast({
      title: "Category Deleted",
      description: "Category has been removed from homepage.",
    });
  };

  const toggleCategory = (categoryId: string) => {
    const updatedCategories = displayCategories.map((cat) =>
      cat.categoryId === categoryId ? { ...cat, isActive: !cat.isActive } : cat,
    );
    onUpdate(updatedCategories, sectionTitle, sectionTitleTelugu);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(displayCategories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    onUpdate(updatedItems, sectionTitle, sectionTitleTelugu);
  };

  const updateSectionTitles = () => {
    onUpdate(displayCategories, sectionTitle, sectionTitleTelugu);
    toast({
      title: "Section Updated! ✅",
      description: "Section titles have been updated.",
    });
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find((opt) => opt.value === iconName);
    return iconOption ? iconOption.icon : BookOpen;
  };

  const CategoryForm = ({
    category,
    setCategory,
    isEditing = false,
  }: {
    category: any;
    setCategory: any;
    isEditing?: boolean;
  }) => (
    <div className="space-y-4">
      {/* Category Selection */}
      <div>
        <Label htmlFor="categoryId">Book Category *</Label>
        <Select
          value={category.categoryId}
          onValueChange={(value) => {
            const selectedCat = categories.find((cat) => cat.id === value);
            setCategory({
              ...category,
              categoryId: value,
              name: selectedCat?.name || "",
              nameTelugu: selectedCat?.nameTelugu || "",
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a book category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name} ({cat.nameTelugu})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Display Names */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Display Name (English) *</Label>
          <Input
            id="name"
            value={category.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
            placeholder="Enter display name"
          />
        </div>
        <div>
          <Label htmlFor="nameTelugu">Display Name (Telugu)</Label>
          <Input
            id="nameTelugu"
            value={category.nameTelugu}
            onChange={(e) =>
              setCategory({ ...category, nameTelugu: e.target.value })
            }
            placeholder="ప్రదర్శన పేరు"
          />
        </div>
      </div>

      {/* Descriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="description">Description (English)</Label>
          <Textarea
            id="description"
            value={category.description}
            onChange={(e) =>
              setCategory({ ...category, description: e.target.value })
            }
            placeholder="Enter category description"
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="descriptionTelugu">Description (Telugu)</Label>
          <Textarea
            id="descriptionTelugu"
            value={category.descriptionTelugu}
            onChange={(e) =>
              setCategory({ ...category, descriptionTelugu: e.target.value })
            }
            placeholder="వర్గ వివరణ"
            rows={3}
          />
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <Label htmlFor="image">Category Image</Label>
        <div className="mt-2">
          {category.image && (
            <div className="mb-4">
              <img
                src={category.image}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border"
              />
            </div>
          )}
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor={`category-image-upload-${isEditing ? "edit" : "new"}`}
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span>{" "}
                  category image
                </p>
                <p className="text-xs text-gray-500">PNG, JPG or WEBP</p>
              </div>
              <input
                id={`category-image-upload-${isEditing ? "edit" : "new"}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, isEditing)}
                disabled={uploading}
              />
            </label>
          </div>
          {uploading && (
            <p className="text-sm text-blue-600 mt-2">Uploading image...</p>
          )}
        </div>
      </div>

      {/* Icon and Color */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="icon">Icon</Label>
          <Select
            value={category.icon}
            onValueChange={(value) => setCategory({ ...category, icon: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an icon" />
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center">
                      <Icon className="w-4 h-4 mr-2" />
                      {option.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="color">Theme Color</Label>
          <Select
            value={category.color}
            onValueChange={(value) =>
              setCategory({ ...category, color: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a color" />
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded mr-2 ${option.class}`}
                    ></div>
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Status */}
      <div className="flex items-center space-x-2">
        <Switch
          checked={category.isActive}
          onCheckedChange={(checked) =>
            setCategory({ ...category, isActive: checked })
          }
        />
        <Label>Active (visible on homepage)</Label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Section Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Grid3X3 className="w-5 h-5 mr-2" />
            Categories Section Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="sectionTitle">Section Title (English)</Label>
              <Input
                id="sectionTitle"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                placeholder="Browse Categories"
              />
            </div>
            <div>
              <Label htmlFor="sectionTitleTelugu">Section Title (Telugu)</Label>
              <Input
                id="sectionTitleTelugu"
                value={sectionTitleTelugu}
                onChange={(e) => setSectionTitleTelugu(e.target.value)}
                placeholder="వర్గాలను విహరించండి"
              />
            </div>
          </div>
          <Button onClick={updateSectionTitles} size="sm">
            Update Section Titles
          </Button>
        </CardContent>
      </Card>

      {/* Categories Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Featured Categories
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Manage categories displayed on the homepage. Drag to reorder.
              </p>
            </div>
            <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Featured Category</DialogTitle>
                </DialogHeader>
                <CategoryForm
                  category={newCategory}
                  setCategory={setNewCategory}
                />
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingCategory(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={addCategory}>Add Category</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {displayCategories.length > 0 ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="categories">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {displayCategories.map((category, index) => {
                      const IconComponent = getIconComponent(
                        category.icon || "BookOpen",
                      );

                      return (
                        <Draggable
                          key={category.categoryId}
                          draggableId={category.categoryId}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`bg-white border rounded-lg p-4 ${
                                snapshot.isDragging ? "shadow-lg" : ""
                              } ${!category.isActive ? "opacity-50" : ""}`}
                            >
                              <div className="flex items-start space-x-4">
                                {/* Drag Handle */}
                                <div
                                  {...provided.dragHandleProps}
                                  className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing mt-2"
                                >
                                  <GripVertical className="w-5 h-5" />
                                </div>

                                {/* Category Preview */}
                                <div
                                  className="w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center"
                                  style={{ backgroundColor: category.color }}
                                >
                                  {category.image ? (
                                    <img
                                      src={category.image}
                                      alt={category.name}
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                  ) : (
                                    <IconComponent className="w-8 h-8 text-white" />
                                  )}
                                </div>

                                {/* Category Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <div className="flex items-center space-x-2 mb-1">
                                        <h3 className="font-medium text-gray-900">
                                          {category.name}
                                        </h3>
                                        <Badge
                                          variant={
                                            category.isActive
                                              ? "default"
                                              : "secondary"
                                          }
                                        >
                                          {category.isActive
                                            ? "Active"
                                            : "Hidden"}
                                        </Badge>
                                      </div>
                                      {category.nameTelugu && (
                                        <p className="text-sm text-gray-600 mb-1">
                                          {category.nameTelugu}
                                        </p>
                                      )}
                                      {category.description && (
                                        <p className="text-sm text-gray-500 line-clamp-2">
                                          {category.description}
                                        </p>
                                      )}
                                      <div className="mt-2 flex items-center space-x-2">
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                                          ID: {category.categoryId}
                                        </span>
                                        <div
                                          className="w-4 h-4 rounded"
                                          style={{
                                            backgroundColor: category.color,
                                          }}
                                        ></div>
                                      </div>
                                    </div>

                                    {/* Controls */}
                                    <div className="flex items-center space-x-2 ml-4">
                                      <div className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">
                                        #{category.order}
                                      </div>

                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          toggleCategory(category.categoryId)
                                        }
                                      >
                                        {category.isActive ? (
                                          <Eye className="w-4 h-4" />
                                        ) : (
                                          <EyeOff className="w-4 h-4" />
                                        )}
                                      </Button>

                                      <Dialog
                                        open={
                                          editingCategory?.categoryId ===
                                            category.categoryId || undefined
                                        }
                                        onOpenChange={(open) =>
                                          setEditingCategory(
                                            open ? category : null,
                                          )
                                        }
                                      >
                                        <DialogTrigger asChild>
                                          <Button variant="ghost" size="sm">
                                            <Edit3 className="w-4 h-4" />
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                          <DialogHeader>
                                            <DialogTitle>
                                              Edit Featured Category
                                            </DialogTitle>
                                          </DialogHeader>
                                          {editingCategory && (
                                            <CategoryForm
                                              category={editingCategory}
                                              setCategory={setEditingCategory}
                                              isEditing={true}
                                            />
                                          )}
                                          <div className="flex justify-end space-x-2 pt-4">
                                            <Button
                                              variant="outline"
                                              onClick={() =>
                                                setEditingCategory(null)
                                              }
                                            >
                                              Cancel
                                            </Button>
                                            <Button onClick={updateCategory}>
                                              Update Category
                                            </Button>
                                          </div>
                                        </DialogContent>
                                      </Dialog>

                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          deleteCategory(category.categoryId)
                                        }
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <Grid3X3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No featured categories
              </h3>
              <p className="text-gray-500 mb-4">
                Add categories to showcase on your homepage for easy browsing.
              </p>
              <Button onClick={() => setIsAddingCategory(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Category
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
