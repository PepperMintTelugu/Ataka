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
  Users,
  GripVertical,
  BookOpen,
  User,
} from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { mockBooks } from "@/data/books";
import { ImageUpload } from "./ImageUpload";

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

interface AuthorsManagerProps {
  authors: Author[];
  title: string;
  titleTelugu: string;
  onUpdate: (authors: Author[], title: string, titleTelugu: string) => void;
  onUploadImage: (file: File) => Promise<string | null>;
}

export default function AuthorsManager({
  authors,
  title,
  titleTelugu,
  onUpdate,
  onUploadImage,
}: AuthorsManagerProps) {
  const [sectionTitle, setSectionTitle] = useState(title);
  const [sectionTitleTelugu, setSectionTitleTelugu] = useState(titleTelugu);
  const [isAddingAuthor, setIsAddingAuthor] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  // Get available authors from books data
  const availableAuthors = React.useMemo(() => {
    const authorMap = new Map();
    mockBooks.forEach((book) => {
      const authorKey = book.author;
      if (!authorMap.has(authorKey)) {
        authorMap.set(authorKey, {
          name: book.author,
          nameTelugu: book.authorTelugu,
          booksCount: 1,
        });
      } else {
        authorMap.get(authorKey).booksCount += 1;
      }
    });
    return Array.from(authorMap.values());
  }, []);

  const [newAuthor, setNewAuthor] = useState<Omit<Author, "order">>({
    id: "",
    name: "",
    nameTelugu: "",
    image: "",
    bio: "",
    bioTelugu: "",
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
        if (isEditing && editingAuthor) {
          setEditingAuthor({ ...editingAuthor, image: imageUrl });
        } else {
          setNewAuthor({ ...newAuthor, image: imageUrl });
        }

        toast({
          title: "Image Uploaded! ✅",
          description: "Author image has been uploaded successfully.",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const addAuthor = () => {
    if (!newAuthor.name) {
      toast({
        title: "Missing Information",
        description: "Please provide at least an author name.",
        variant: "destructive",
      });
      return;
    }

    const author: Author = {
      ...newAuthor,
      id: newAuthor.id || newAuthor.name.toLowerCase().replace(/\s+/g, "-"),
      order: authors.length + 1,
    };

    const updatedAuthors = [...authors, author];
    onUpdate(updatedAuthors, sectionTitle, sectionTitleTelugu);

    setNewAuthor({
      id: "",
      name: "",
      nameTelugu: "",
      image: "",
      bio: "",
      bioTelugu: "",
      booksCount: 0,
      isActive: true,
    });
    setIsAddingAuthor(false);

    toast({
      title: "Author Added! ✅",
      description: "New author has been added to the homepage.",
    });
  };

  const updateAuthor = () => {
    if (!editingAuthor) return;

    const updatedAuthors = authors.map((author) =>
      author.id === editingAuthor.id ? editingAuthor : author,
    );
    onUpdate(updatedAuthors, sectionTitle, sectionTitleTelugu);
    setEditingAuthor(null);

    toast({
      title: "Author Updated! ✅",
      description: "Author has been updated successfully.",
    });
  };

  const deleteAuthor = (authorId: string) => {
    const updatedAuthors = authors
      .filter((author) => author.id !== authorId)
      .map((author, index) => ({ ...author, order: index + 1 }));
    onUpdate(updatedAuthors, sectionTitle, sectionTitleTelugu);

    toast({
      title: "Author Deleted",
      description: "Author has been removed from homepage.",
    });
  };

  const toggleAuthor = (authorId: string) => {
    const updatedAuthors = authors.map((author) =>
      author.id === authorId
        ? { ...author, isActive: !author.isActive }
        : author,
    );
    onUpdate(updatedAuthors, sectionTitle, sectionTitleTelugu);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(authors);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    onUpdate(updatedItems, sectionTitle, sectionTitleTelugu);
  };

  const updateSectionTitles = () => {
    onUpdate(authors, sectionTitle, sectionTitleTelugu);
    toast({
      title: "Section Updated! ✅",
      description: "Section titles have been updated.",
    });
  };

  const selectExistingAuthor = (selectedAuthor: any) => {
    setNewAuthor({
      ...newAuthor,
      id: selectedAuthor.name.toLowerCase().replace(/\s+/g, "-"),
      name: selectedAuthor.name,
      nameTelugu: selectedAuthor.nameTelugu || "",
      booksCount: selectedAuthor.booksCount,
      bio: `${selectedAuthor.name} is a renowned Telugu author known for their contribution to Telugu literature. With ${selectedAuthor.booksCount} published works, they have captivated readers with their unique storytelling style.`,
      bioTelugu: selectedAuthor.nameTelugu
        ? `${selectedAuthor.nameTelugu} తెలుగు సాహిత్యానికి తమ సహకారంతో ప్రసిద్ధి చెందిన రచయిత. ${selectedAuthor.booksCount} ప్రచురితమైన రచనలతో, వారు తమ అనుపమ కథా శైలితో పాఠకులను మంత్రముగ్ధులను చేశారు.`
        : "",
    });
  };

  const AuthorForm = ({
    author,
    setAuthor,
    isEditing = false,
  }: {
    author: any;
    setAuthor: any;
    isEditing?: boolean;
  }) => (
    <div className="space-y-4">
      {/* Quick Select from Existing Authors */}
      {!isEditing && (
        <div>
          <Label>Quick Select from Existing Authors</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {availableAuthors
              .filter(
                (existingAuthor) =>
                  !authors.some(
                    (author) => author.name === existingAuthor.name,
                  ),
              )
              .slice(0, 6)
              .map((existingAuthor) => (
                <Button
                  key={existingAuthor.name}
                  variant="outline"
                  size="sm"
                  onClick={() => selectExistingAuthor(existingAuthor)}
                  className="justify-start h-auto p-3"
                >
                  <div className="text-left">
                    <div className="font-medium text-sm">
                      {existingAuthor.name}
                    </div>
                    {existingAuthor.nameTelugu && (
                      <div className="text-xs text-gray-500">
                        {existingAuthor.nameTelugu}
                      </div>
                    )}
                    <div className="text-xs text-gray-400">
                      {existingAuthor.booksCount} books
                    </div>
                  </div>
                </Button>
              ))}
          </div>
        </div>
      )}

      {/* Author Names */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Author Name (English) *</Label>
          <Input
            id="name"
            value={author.name}
            onChange={(e) => {
              const name = e.target.value;
              setAuthor({
                ...author,
                name,
                id: name.toLowerCase().replace(/\s+/g, "-"),
              });
            }}
            placeholder="Enter author name"
          />
        </div>
        <div>
          <Label htmlFor="nameTelugu">Author Name (Telugu)</Label>
          <Input
            id="nameTelugu"
            value={author.nameTelugu}
            onChange={(e) =>
              setAuthor({ ...author, nameTelugu: e.target.value })
            }
            placeholder="రచయిత పేరు"
          />
        </div>
      </div>

      {/* Author ID */}
      <div>
        <Label htmlFor="id">Author ID (URL-friendly)</Label>
        <Input
          id="id"
          value={author.id}
          onChange={(e) => setAuthor({ ...author, id: e.target.value })}
          placeholder="author-name-slug"
          className="font-mono text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">
          Will be used in URLs like /authors/{author.id}
        </p>
      </div>

      {/* Image Upload */}
      <div>
        <Label>Author Photo</Label>
        <ImageUpload
          type="authors"
          currentImage={author.image}
          onImageSelect={(imageUrl) => setAuthor({ ...author, image: imageUrl })}
          onImageDelete={() => setAuthor({ ...author, image: "" })}
          maxSize={5}
          className="mt-2"
        />
      </div>

      {/* Biography */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bio">Biography (English)</Label>
          <Textarea
            id="bio"
            value={author.bio}
            onChange={(e) => setAuthor({ ...author, bio: e.target.value })}
            placeholder="Enter author biography"
            rows={4}
          />
        </div>
        <div>
          <Label htmlFor="bioTelugu">Biography (Telugu)</Label>
          <Textarea
            id="bioTelugu"
            value={author.bioTelugu}
            onChange={(e) =>
              setAuthor({ ...author, bioTelugu: e.target.value })
            }
            placeholder="రచయిత జీవిత చరిత్ర"
            rows={4}
          />
        </div>
      </div>

      {/* Books Count */}
      <div>
        <Label htmlFor="booksCount">Number of Books</Label>
        <Input
          id="booksCount"
          type="number"
          value={author.booksCount}
          onChange={(e) =>
            setAuthor({ ...author, booksCount: parseInt(e.target.value) || 0 })
          }
          placeholder="0"
          min="0"
        />
      </div>

      {/* Active Status */}
      <div className="flex items-center space-x-2">
        <Switch
          checked={author.isActive}
          onCheckedChange={(checked) =>
            setAuthor({ ...author, isActive: checked })
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
            <Users className="w-5 h-5 mr-2" />
            Authors Section Settings
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
                placeholder="Featured Authors"
              />
            </div>
            <div>
              <Label htmlFor="sectionTitleTelugu">Section Title (Telugu)</Label>
              <Input
                id="sectionTitleTelugu"
                value={sectionTitleTelugu}
                onChange={(e) => setSectionTitleTelugu(e.target.value)}
                placeholder="ప్రముఖ రచయితలు"
              />
            </div>
          </div>
          <Button onClick={updateSectionTitles} size="sm">
            Update Section Titles
          </Button>
        </CardContent>
      </Card>

      {/* Authors Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Featured Authors
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Manage authors displayed on the homepage. Drag to reorder.
              </p>
            </div>
            <Dialog open={isAddingAuthor} onOpenChange={setIsAddingAuthor}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Author
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Featured Author</DialogTitle>
                </DialogHeader>
                <AuthorForm author={newAuthor} setAuthor={setNewAuthor} />
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingAuthor(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={addAuthor}>Add Author</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {authors.length > 0 ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="authors">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {authors.map((author, index) => (
                      <Draggable
                        key={author.id}
                        draggableId={author.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`bg-white border rounded-lg p-4 ${
                              snapshot.isDragging ? "shadow-lg" : ""
                            } ${!author.isActive ? "opacity-50" : ""}`}
                          >
                            <div className="flex items-start space-x-4">
                              {/* Drag Handle */}
                              <div
                                {...provided.dragHandleProps}
                                className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing mt-2"
                              >
                                <GripVertical className="w-5 h-5" />
                              </div>

                              {/* Author Photo */}
                              <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                                {author.image ? (
                                  <img
                                    src={author.image}
                                    alt={author.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <User className="w-8 h-8 text-blue-500" />
                                )}
                              </div>

                              {/* Author Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                      <h3 className="font-medium text-gray-900">
                                        {author.name}
                                      </h3>
                                      <Badge
                                        variant={
                                          author.isActive
                                            ? "default"
                                            : "secondary"
                                        }
                                      >
                                        {author.isActive ? "Active" : "Hidden"}
                                      </Badge>
                                    </div>
                                    {author.nameTelugu && (
                                      <p className="text-sm text-gray-600 mb-1">
                                        {author.nameTelugu}
                                      </p>
                                    )}
                                    {author.bio && (
                                      <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                                        {author.bio}
                                      </p>
                                    )}
                                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                                      <span className="flex items-center">
                                        <BookOpen className="w-4 h-4 mr-1" />
                                        {author.booksCount} books
                                      </span>
                                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                        ID: {author.id}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Controls */}
                                  <div className="flex items-center space-x-2 ml-4">
                                    <div className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">
                                      #{author.order}
                                    </div>

                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleAuthor(author.id)}
                                    >
                                      {author.isActive ? (
                                        <Eye className="w-4 h-4" />
                                      ) : (
                                        <EyeOff className="w-4 h-4" />
                                      )}
                                    </Button>

                                    <Dialog
                                      open={
                                        editingAuthor?.id === author.id ||
                                        undefined
                                      }
                                      onOpenChange={(open) =>
                                        setEditingAuthor(open ? author : null)
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
                                            Edit Featured Author
                                          </DialogTitle>
                                        </DialogHeader>
                                        {editingAuthor && (
                                          <AuthorForm
                                            author={editingAuthor}
                                            setAuthor={setEditingAuthor}
                                            isEditing={true}
                                          />
                                        )}
                                        <div className="flex justify-end space-x-2 pt-4">
                                          <Button
                                            variant="outline"
                                            onClick={() =>
                                              setEditingAuthor(null)
                                            }
                                          >
                                            Cancel
                                          </Button>
                                          <Button onClick={updateAuthor}>
                                            Update Author
                                          </Button>
                                        </div>
                                      </DialogContent>
                                    </Dialog>

                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteAuthor(author.id)}
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
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No featured authors
              </h3>
              <p className="text-gray-500 mb-4">
                Add authors to showcase on your homepage with circular photos.
              </p>
              <Button onClick={() => setIsAddingAuthor(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Author
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
