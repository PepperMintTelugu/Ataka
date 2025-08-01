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
  Building2,
  GripVertical,
  BookOpen,
  Globe,
  Calendar,
} from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { mockBooks } from "@/data/books";
import { ImageUpload } from "./ImageUpload";

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

interface PublishersManagerProps {
  publishers: Publisher[];
  title: string;
  titleTelugu: string;
  onUpdate: (
    publishers: Publisher[],
    title: string,
    titleTelugu: string,
  ) => void;
  onUploadImage: (file: File) => Promise<string | null>;
}

export default function PublishersManager({
  publishers,
  title,
  titleTelugu,
  onUpdate,
  onUploadImage,
}: PublishersManagerProps) {
  const [sectionTitle, setSectionTitle] = useState(title);
  const [sectionTitleTelugu, setSectionTitleTelugu] = useState(titleTelugu);
  const [isAddingPublisher, setIsAddingPublisher] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState<Publisher | null>(
    null,
  );
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  // Get available publishers from books data
  const availablePublishers = React.useMemo(() => {
    const publisherMap = new Map();
    mockBooks.forEach((book) => {
      const publisherKey = book.publisher;
      if (!publisherMap.has(publisherKey)) {
        publisherMap.set(publisherKey, {
          name: book.publisher,
          nameTelugu: book.publisherTelugu,
          booksCount: 1,
        });
      } else {
        publisherMap.get(publisherKey).booksCount += 1;
      }
    });
    return Array.from(publisherMap.values());
  }, []);

  const [newPublisher, setNewPublisher] = useState<Omit<Publisher, "order">>({
    id: "",
    name: "",
    nameTelugu: "",
    logo: "",
    description: "",
    descriptionTelugu: "",
    website: "",
    booksCount: 0,
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
        if (isEditing && editingPublisher) {
          setEditingPublisher({ ...editingPublisher, logo: imageUrl });
        } else {
          setNewPublisher({ ...newPublisher, logo: imageUrl });
        }

        toast({
          title: "Logo Uploaded! ✅",
          description: "Publisher logo has been uploaded successfully.",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const addPublisher = () => {
    if (!newPublisher.name) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a publisher name.",
        variant: "destructive",
      });
      return;
    }

    const publisher: Publisher = {
      ...newPublisher,
      id:
        newPublisher.id || newPublisher.name.toLowerCase().replace(/\s+/g, "-"),
      order: publishers.length + 1,
    };

    const updatedPublishers = [...publishers, publisher];
    onUpdate(updatedPublishers, sectionTitle, sectionTitleTelugu);

    setNewPublisher({
      id: "",
      name: "",
      nameTelugu: "",
      logo: "",
      description: "",
      descriptionTelugu: "",
      website: "",
      booksCount: 0,
      isActive: true,
    });
    setIsAddingPublisher(false);

    toast({
      title: "Publisher Added! ✅",
      description: "New publisher has been added to the homepage.",
    });
  };

  const updatePublisher = () => {
    if (!editingPublisher) return;

    const updatedPublishers = publishers.map((publisher) =>
      publisher.id === editingPublisher.id ? editingPublisher : publisher,
    );
    onUpdate(updatedPublishers, sectionTitle, sectionTitleTelugu);
    setEditingPublisher(null);

    toast({
      title: "Publisher Updated! ✅",
      description: "Publisher has been updated successfully.",
    });
  };

  const deletePublisher = (publisherId: string) => {
    const updatedPublishers = publishers
      .filter((publisher) => publisher.id !== publisherId)
      .map((publisher, index) => ({ ...publisher, order: index + 1 }));
    onUpdate(updatedPublishers, sectionTitle, sectionTitleTelugu);

    toast({
      title: "Publisher Deleted",
      description: "Publisher has been removed from homepage.",
    });
  };

  const togglePublisher = (publisherId: string) => {
    const updatedPublishers = publishers.map((publisher) =>
      publisher.id === publisherId
        ? { ...publisher, isActive: !publisher.isActive }
        : publisher,
    );
    onUpdate(updatedPublishers, sectionTitle, sectionTitleTelugu);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(publishers);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    onUpdate(updatedItems, sectionTitle, sectionTitleTelugu);
  };

  const updateSectionTitles = () => {
    onUpdate(publishers, sectionTitle, sectionTitleTelugu);
    toast({
      title: "Section Updated! ✅",
      description: "Section titles have been updated.",
    });
  };

  const selectExistingPublisher = (selectedPublisher: any) => {
    setNewPublisher({
      ...newPublisher,
      id: selectedPublisher.name.toLowerCase().replace(/\s+/g, "-"),
      name: selectedPublisher.name,
      nameTelugu: selectedPublisher.nameTelugu || "",
      booksCount: selectedPublisher.booksCount,
      description: `${selectedPublisher.name} is a leading publisher in Telugu literature, committed to bringing quality books to readers. With ${selectedPublisher.booksCount} published titles, they continue to contribute to Telugu literary heritage.`,
      descriptionTelugu: selectedPublisher.nameTelugu
        ? `${selectedPublisher.nameTelugu} తెలుగు సాహిత్యంలో ఒక ప్రముఖ ప్రచురణ సంస్థ, పాఠకులకు నాణ్యమైన పుస్తకాలను అందించడంలో కట్టుబడి ఉంది. ${selectedPublisher.booksCount} ప్రచురితమైన శీర్షికలతో, వారు తెలుగు సాహిత్య వారసత్వానికి సహకరి��్తూనే ఉన్నారు.`
        : "",
      website: "https://example.com",
    });
  };

  const PublisherForm = ({
    publisher,
    setPublisher,
    isEditing = false,
  }: {
    publisher: any;
    setPublisher: any;
    isEditing?: boolean;
  }) => (
    <div className="space-y-4">
      {/* Quick Select from Existing Publishers */}
      {!isEditing && (
        <div>
          <Label>Quick Select from Existing Publishers</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {availablePublishers
              .filter(
                (existingPublisher) =>
                  !publishers.some(
                    (publisher) => publisher.name === existingPublisher.name,
                  ),
              )
              .slice(0, 6)
              .map((existingPublisher) => (
                <Button
                  key={existingPublisher.name}
                  variant="outline"
                  size="sm"
                  onClick={() => selectExistingPublisher(existingPublisher)}
                  className="justify-start h-auto p-3"
                >
                  <div className="text-left">
                    <div className="font-medium text-sm">
                      {existingPublisher.name}
                    </div>
                    {existingPublisher.nameTelugu && (
                      <div className="text-xs text-gray-500">
                        {existingPublisher.nameTelugu}
                      </div>
                    )}
                    <div className="text-xs text-gray-400">
                      {existingPublisher.booksCount} books
                    </div>
                  </div>
                </Button>
              ))}
          </div>
        </div>
      )}

      {/* Publisher Names */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Publisher Name (English) *</Label>
          <Input
            id="name"
            value={publisher.name}
            onChange={(e) => {
              const name = e.target.value;
              setPublisher({
                ...publisher,
                name,
                id: name.toLowerCase().replace(/\s+/g, "-"),
              });
            }}
            placeholder="Enter publisher name"
          />
        </div>
        <div>
          <Label htmlFor="nameTelugu">Publisher Name (Telugu)</Label>
          <Input
            id="nameTelugu"
            value={publisher.nameTelugu}
            onChange={(e) =>
              setPublisher({ ...publisher, nameTelugu: e.target.value })
            }
            placeholder="ప్రచురణకర్త పేరు"
          />
        </div>
      </div>

      {/* Publisher ID */}
      <div>
        <Label htmlFor="id">Publisher ID (URL-friendly)</Label>
        <Input
          id="id"
          value={publisher.id}
          onChange={(e) => setPublisher({ ...publisher, id: e.target.value })}
          placeholder="publisher-name-slug"
          className="font-mono text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">
          Will be used in URLs like /publishers/{publisher.id}
        </p>
      </div>

      {/* Logo Upload */}
      <div>
        <Label>Publisher Logo</Label>
        <ImageUpload
          type="publishers"
          currentImage={publisher.logo}
          onImageSelect={(imageUrl) => setPublisher({ ...publisher, logo: imageUrl })}
          onImageDelete={() => setPublisher({ ...publisher, logo: "" })}
          maxSize={5}
          className="mt-2"
        />
      </div>

      {/* Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="description">Description (English)</Label>
          <Textarea
            id="description"
            value={publisher.description}
            onChange={(e) =>
              setPublisher({ ...publisher, description: e.target.value })
            }
            placeholder="Enter publisher description"
            rows={4}
          />
        </div>
        <div>
          <Label htmlFor="descriptionTelugu">Description (Telugu)</Label>
          <Textarea
            id="descriptionTelugu"
            value={publisher.descriptionTelugu}
            onChange={(e) =>
              setPublisher({ ...publisher, descriptionTelugu: e.target.value })
            }
            placeholder="ప్రచురణకర్త వి��రణ"
            rows={4}
          />
        </div>
      </div>

      {/* Website URL */}
      <div>
        <Label htmlFor="website">Website URL</Label>
        <Input
          id="website"
          type="url"
          value={publisher.website}
          onChange={(e) =>
            setPublisher({ ...publisher, website: e.target.value })
          }
          placeholder="https://publisherwebsite.com"
        />
      </div>

      {/* Books Count */}
      <div>
        <Label htmlFor="booksCount">Number of Books Published</Label>
        <Input
          id="booksCount"
          type="number"
          value={publisher.booksCount}
          onChange={(e) =>
            setPublisher({
              ...publisher,
              booksCount: parseInt(e.target.value) || 0,
            })
          }
          placeholder="0"
          min="0"
        />
      </div>

      {/* Active Status */}
      <div className="flex items-center space-x-2">
        <Switch
          checked={publisher.isActive}
          onCheckedChange={(checked) =>
            setPublisher({ ...publisher, isActive: checked })
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
            <Building2 className="w-5 h-5 mr-2" />
            Publishers Section Settings
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
                placeholder="Trusted Publishers"
              />
            </div>
            <div>
              <Label htmlFor="sectionTitleTelugu">Section Title (Telugu)</Label>
              <Input
                id="sectionTitleTelugu"
                value={sectionTitleTelugu}
                onChange={(e) => setSectionTitleTelugu(e.target.value)}
                placeholder="విశ్వసనీయ ప్రచురణకర్తలు"
              />
            </div>
          </div>
          <Button onClick={updateSectionTitles} size="sm">
            Update Section Titles
          </Button>
        </CardContent>
      </Card>

      {/* Publishers Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Featured Publishers
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Manage publishers displayed on the homepage. Drag to reorder.
              </p>
            </div>
            <Dialog
              open={isAddingPublisher}
              onOpenChange={setIsAddingPublisher}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Publisher
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Featured Publisher</DialogTitle>
                </DialogHeader>
                <PublisherForm
                  publisher={newPublisher}
                  setPublisher={setNewPublisher}
                />
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingPublisher(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={addPublisher}>Add Publisher</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {publishers.length > 0 ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="publishers">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {publishers.map((publisher, index) => (
                      <Draggable
                        key={publisher.id}
                        draggableId={publisher.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`bg-white border rounded-lg p-4 ${
                              snapshot.isDragging ? "shadow-lg" : ""
                            } ${!publisher.isActive ? "opacity-50" : ""}`}
                          >
                            <div className="flex items-start space-x-4">
                              {/* Drag Handle */}
                              <div
                                {...provided.dragHandleProps}
                                className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing mt-2"
                              >
                                <GripVertical className="w-5 h-5" />
                              </div>

                              {/* Publisher Logo */}
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 border flex items-center justify-center flex-shrink-0">
                                {publisher.logo ? (
                                  <img
                                    src={publisher.logo}
                                    alt={publisher.name}
                                    className="w-full h-full object-contain p-1"
                                  />
                                ) : (
                                  <Building2 className="w-8 h-8 text-gray-400" />
                                )}
                              </div>

                              {/* Publisher Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                      <h3 className="font-medium text-gray-900">
                                        {publisher.name}
                                      </h3>
                                      <Badge
                                        variant={
                                          publisher.isActive
                                            ? "default"
                                            : "secondary"
                                        }
                                      >
                                        {publisher.isActive
                                          ? "Active"
                                          : "Hidden"}
                                      </Badge>
                                    </div>
                                    {publisher.nameTelugu && (
                                      <p className="text-sm text-gray-600 mb-1">
                                        {publisher.nameTelugu}
                                      </p>
                                    )}
                                    {publisher.description && (
                                      <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                                        {publisher.description}
                                      </p>
                                    )}
                                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                                      <span className="flex items-center">
                                        <BookOpen className="w-4 h-4 mr-1" />
                                        {publisher.booksCount} books
                                      </span>
                                      {publisher.website && (
                                        <span className="flex items-center">
                                          <Globe className="w-4 h-4 mr-1" />
                                          Website
                                        </span>
                                      )}
                                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                        ID: {publisher.id}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Controls */}
                                  <div className="flex items-center space-x-2 ml-4">
                                    <div className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">
                                      #{publisher.order}
                                    </div>

                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        togglePublisher(publisher.id)
                                      }
                                    >
                                      {publisher.isActive ? (
                                        <Eye className="w-4 h-4" />
                                      ) : (
                                        <EyeOff className="w-4 h-4" />
                                      )}
                                    </Button>

                                    <Dialog
                                      open={
                                        editingPublisher?.id === publisher.id ||
                                        undefined
                                      }
                                      onOpenChange={(open) =>
                                        setEditingPublisher(
                                          open ? publisher : null,
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
                                            Edit Featured Publisher
                                          </DialogTitle>
                                        </DialogHeader>
                                        {editingPublisher && (
                                          <PublisherForm
                                            publisher={editingPublisher}
                                            setPublisher={setEditingPublisher}
                                            isEditing={true}
                                          />
                                        )}
                                        <div className="flex justify-end space-x-2 pt-4">
                                          <Button
                                            variant="outline"
                                            onClick={() =>
                                              setEditingPublisher(null)
                                            }
                                          >
                                            Cancel
                                          </Button>
                                          <Button onClick={updatePublisher}>
                                            Update Publisher
                                          </Button>
                                        </div>
                                      </DialogContent>
                                    </Dialog>

                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        deletePublisher(publisher.id)
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
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No featured publishers
              </h3>
              <p className="text-gray-500 mb-4">
                Add publishers to showcase on your homepage with their logos.
              </p>
              <Button onClick={() => setIsAddingPublisher(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Publisher
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
