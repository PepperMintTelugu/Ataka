import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
  Image as ImageIcon,
  GripVertical,
} from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

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

interface SliderManagerProps {
  images: SliderImage[];
  onUpdate: (images: SliderImage[]) => void;
  onUploadImage: (file: File) => Promise<string | null>;
}

export default function SliderManager({
  images,
  onUpdate,
  onUploadImage,
}: SliderManagerProps) {
  const [isAddingSlide, setIsAddingSlide] = useState(false);
  const [editingSlide, setEditingSlide] = useState<SliderImage | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const [newSlide, setNewSlide] = useState<Omit<SliderImage, "id" | "order">>({
    image: "",
    title: "",
    titleTelugu: "",
    subtitle: "",
    subtitleTelugu: "",
    buttonText: "",
    buttonTextTelugu: "",
    linkUrl: "",
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
        if (isEditing && editingSlide) {
          setEditingSlide({ ...editingSlide, image: imageUrl });
        } else {
          setNewSlide({ ...newSlide, image: imageUrl });
        }

        toast({
          title: "Image Uploaded! ✅",
          description: "Image has been uploaded successfully.",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const addSlide = () => {
    if (!newSlide.title || !newSlide.image) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a title and image.",
        variant: "destructive",
      });
      return;
    }

    const slide: SliderImage = {
      ...newSlide,
      id: `slide-${Date.now()}`,
      order: images.length + 1,
    };

    onUpdate([...images, slide]);
    setNewSlide({
      image: "",
      title: "",
      titleTelugu: "",
      subtitle: "",
      subtitleTelugu: "",
      buttonText: "",
      buttonTextTelugu: "",
      linkUrl: "",
      isActive: true,
    });
    setIsAddingSlide(false);

    toast({
      title: "Slide Added! ✅",
      description: "New slider image has been added.",
    });
  };

  const updateSlide = () => {
    if (!editingSlide) return;

    const updatedImages = images.map((img) =>
      img.id === editingSlide.id ? editingSlide : img,
    );
    onUpdate(updatedImages);
    setEditingSlide(null);

    toast({
      title: "Slide Updated! ✅",
      description: "Slider image has been updated.",
    });
  };

  const deleteSlide = (slideId: string) => {
    const updatedImages = images
      .filter((img) => img.id !== slideId)
      .map((img, index) => ({ ...img, order: index + 1 }));
    onUpdate(updatedImages);

    toast({
      title: "Slide Deleted",
      description: "Slider image has been removed.",
    });
  };

  const toggleSlide = (slideId: string) => {
    const updatedImages = images.map((img) =>
      img.id === slideId ? { ...img, isActive: !img.isActive } : img,
    );
    onUpdate(updatedImages);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    onUpdate(updatedItems);
  };

  const SlideForm = ({
    slide,
    setSlide,
    isEditing = false,
  }: {
    slide: any;
    setSlide: any;
    isEditing?: boolean;
  }) => (
    <div className="space-y-4">
      {/* Image Upload */}
      <div>
        <Label htmlFor="image">Slider Image *</Label>
        <div className="mt-2">
          {slide.image && (
            <div className="mb-4">
              <img
                src={slide.image}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border"
              />
            </div>
          )}
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor={`image-upload-${isEditing ? "edit" : "new"}`}
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> slider
                  image
                </p>
                <p className="text-xs text-gray-500">PNG, JPG or WEBP</p>
              </div>
              <input
                id={`image-upload-${isEditing ? "edit" : "new"}`}
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

      {/* Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title (English) *</Label>
          <Input
            id="title"
            value={slide.title}
            onChange={(e) => setSlide({ ...slide, title: e.target.value })}
            placeholder="Enter slide title"
          />
        </div>
        <div>
          <Label htmlFor="titleTelugu">Title (Telugu)</Label>
          <Input
            id="titleTelugu"
            value={slide.titleTelugu}
            onChange={(e) =>
              setSlide({ ...slide, titleTelugu: e.target.value })
            }
            placeholder="స్లైడ్ శీర్షిక"
          />
        </div>
      </div>

      {/* Subtitle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="subtitle">Subtitle (English)</Label>
          <Textarea
            id="subtitle"
            value={slide.subtitle}
            onChange={(e) => setSlide({ ...slide, subtitle: e.target.value })}
            placeholder="Enter slide subtitle"
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="subtitleTelugu">Subtitle (Telugu)</Label>
          <Textarea
            id="subtitleTelugu"
            value={slide.subtitleTelugu}
            onChange={(e) =>
              setSlide({ ...slide, subtitleTelugu: e.target.value })
            }
            placeholder="స్లైడ్ ఉపశీర్షిక"
            rows={3}
          />
        </div>
      </div>

      {/* Button Text */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="buttonText">Button Text (English)</Label>
          <Input
            id="buttonText"
            value={slide.buttonText}
            onChange={(e) => setSlide({ ...slide, buttonText: e.target.value })}
            placeholder="e.g., Shop Now"
          />
        </div>
        <div>
          <Label htmlFor="buttonTextTelugu">Button Text (Telugu)</Label>
          <Input
            id="buttonTextTelugu"
            value={slide.buttonTextTelugu}
            onChange={(e) =>
              setSlide({ ...slide, buttonTextTelugu: e.target.value })
            }
            placeholder="e.g., ఇప్పుడే కొనండి"
          />
        </div>
      </div>

      {/* Link URL */}
      <div>
        <Label htmlFor="linkUrl">Link URL</Label>
        <Input
          id="linkUrl"
          value={slide.linkUrl}
          onChange={(e) => setSlide({ ...slide, linkUrl: e.target.value })}
          placeholder="/shop or https://example.com"
        />
      </div>

      {/* Active Status */}
      <div className="flex items-center space-x-2">
        <Switch
          checked={slide.isActive}
          onCheckedChange={(checked) =>
            setSlide({ ...slide, isActive: checked })
          }
        />
        <Label>Active (visible on homepage)</Label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <ImageIcon className="w-5 h-5 mr-2" />
                Hero Slider Management
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Manage slider images and content for the homepage hero section.
                Drag to reorder slides.
              </p>
            </div>
            <Dialog open={isAddingSlide} onOpenChange={setIsAddingSlide}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Slide
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Slider Image</DialogTitle>
                </DialogHeader>
                <SlideForm slide={newSlide} setSlide={setNewSlide} />
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingSlide(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={addSlide}>Add Slide</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {images.length > 0 ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="slider-images">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {images.map((slide, index) => (
                      <Draggable
                        key={slide.id}
                        draggableId={slide.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`bg-white border rounded-lg p-4 ${
                              snapshot.isDragging ? "shadow-lg" : ""
                            } ${!slide.isActive ? "opacity-50" : ""}`}
                          >
                            <div className="flex items-start space-x-4">
                              {/* Drag Handle */}
                              <div
                                {...provided.dragHandleProps}
                                className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing mt-2"
                              >
                                <GripVertical className="w-5 h-5" />
                              </div>

                              {/* Slide Image */}
                              <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                {slide.image ? (
                                  <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="w-8 h-8 text-gray-400" />
                                  </div>
                                )}
                              </div>

                              {/* Slide Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                      <h3 className="font-medium text-gray-900 truncate">
                                        {slide.title}
                                      </h3>
                                      <Badge
                                        variant={
                                          slide.isActive
                                            ? "default"
                                            : "secondary"
                                        }
                                      >
                                        {slide.isActive ? "Active" : "Hidden"}
                                      </Badge>
                                    </div>
                                    {slide.titleTelugu && (
                                      <p className="text-sm text-gray-600 mb-1">
                                        {slide.titleTelugu}
                                      </p>
                                    )}
                                    {slide.subtitle && (
                                      <p className="text-sm text-gray-500 line-clamp-2">
                                        {slide.subtitle}
                                      </p>
                                    )}
                                    {slide.buttonText && (
                                      <div className="mt-2">
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                                          Button: {slide.buttonText}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Controls */}
                                  <div className="flex items-center space-x-2 ml-4">
                                    <div className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">
                                      #{slide.order}
                                    </div>

                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleSlide(slide.id)}
                                    >
                                      {slide.isActive ? (
                                        <Eye className="w-4 h-4" />
                                      ) : (
                                        <EyeOff className="w-4 h-4" />
                                      )}
                                    </Button>

                                    <Dialog
                                      open={
                                        editingSlide?.id === slide.id ||
                                        undefined
                                      }
                                      onOpenChange={(open) =>
                                        setEditingSlide(open ? slide : null)
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
                                            Edit Slider Image
                                          </DialogTitle>
                                        </DialogHeader>
                                        {editingSlide && (
                                          <SlideForm
                                            slide={editingSlide}
                                            setSlide={setEditingSlide}
                                            isEditing={true}
                                          />
                                        )}
                                        <div className="flex justify-end space-x-2 pt-4">
                                          <Button
                                            variant="outline"
                                            onClick={() =>
                                              setEditingSlide(null)
                                            }
                                          >
                                            Cancel
                                          </Button>
                                          <Button onClick={updateSlide}>
                                            Update Slide
                                          </Button>
                                        </div>
                                      </DialogContent>
                                    </Dialog>

                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteSlide(slide.id)}
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
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No slider images
              </h3>
              <p className="text-gray-500 mb-4">
                Add your first slider image to get started with the homepage
                hero section.
              </p>
              <Button onClick={() => setIsAddingSlide(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Slide
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
