import React, { useState, useEffect } from "react";
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
  BookOpen,
  Star,
  Package,
  IndianRupee,
  Search,
  Filter,
  Download,
  BarChart3,
  FileText,
  Globe,
  Database,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { ImageUpload } from "./ImageUpload";

interface Book {
  id: string;
  title: string;
  titleTelugu?: string;
  author: string;
  authorTelugu?: string;
  publisher: string;
  publisherTelugu?: string;
  category: string;
  price: number;
  originalPrice: number;
  isbn: string;
  sku: string;
  pages: number;
  language: string;
  description: string;
  descriptionTelugu?: string;
  coverImage: string;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewsCount: number;
  tags: string[];
  featured: boolean;
  publishedDate: string;
  addedDate: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
}

interface BooksManagerProps {
  onUploadImage: (file: File) => Promise<string | null>;
}

const categories = [
  "Literature",
  "Poetry",
  "Fiction",
  "Educational",
  "Children",
  "History",
  "Devotional",
  "Biography",
  "Philosophy",
  "Science",
];

const mockBooks: Book[] = [
  {
    id: "1",
    title: "Veyipadagalu",
    titleTelugu: "వ���యిపడగలు",
    author: "Viswanatha Satyanarayana",
    authorTelugu: "విశ్వనాథ సత్యనారాయణ",
    publisher: "Vishwakarma Publications",
    publisherTelugu: "విశ్వకర్మ పబ్లికేషన్స్",
    category: "Literature",
    price: 450,
    originalPrice: 500,
    isbn: "978-81-234-5678-9",
    sku: "ATK-VEY-001",
    pages: 824,
    language: "Telugu",
    description:
      "A masterpiece of Telugu literature by the renowned author Viswanatha Satyanarayana. This epic novel is considered one of the greatest works in modern Telugu literature.",
    descriptionTelugu:
      "విశ్వనాథ సత్యనారాయణ రచించిన తెలుగు సాహిత్యంలో ఒక కీర్తిస్తంభం. ఈ మహాకావ్యం ఆధునిక తెలుగు సాహిత్యంలో గొప్ప రచనలలో ఒకటిగా పరిగణించబడుతుంది.",
    coverImage:
      "https://via.placeholder.com/400x600/6366f1/white?text=వ���యిపడ���లు",
    images: ["https://via.placeholder.com/400x600/6366f1/white?text=వేయిపడగలు"],
    inStock: true,
    stockQuantity: 25,
    rating: 4.8,
    reviewsCount: 156,
    tags: ["classic", "literature", "award-winning"],
    featured: true,
    publishedDate: "1952-03-15",
    addedDate: "2024-01-15",
    weight: 0.8,
    dimensions: { length: 22, width: 14, height: 4 },
  },
  {
    id: "2",
    title: "Kanyasulkam",
    titleTelugu: "కన్యాశుల్కం",
    author: "Kandukuri Veeresalingam",
    authorTelugu: "కందుకూరి వీరేశలింగం",
    publisher: "Saraswati Pustakalayam",
    publisherTelugu: "సరస్వతి పుస్తకాలయం",
    category: "Literature",
    price: 350,
    originalPrice: 400,
    isbn: "978-81-234-5679-6",
    sku: "ATK-KAN-001",
    pages: 256,
    language: "Telugu",
    description:
      "The first Telugu novel that brought social reform and highlighted the issues of child marriage and dowry system.",
    descriptionTelugu:
      "సామాజిక సంస్కరణలను తీసుకువచ్చిన మరియు బాల్యవివాహాలు, కన్యాశుల్క సమస్యలను వెలికితీసిన మొదటి తెలుగు నవల.",
    coverImage:
      "https://via.placeholder.com/400x600/8b5cf6/white?text=కన్యాశుల్కం",
    images: [
      "https://via.placeholder.com/400x600/8b5cf6/white?text=��న్యాశుల్కం",
    ],
    inStock: true,
    stockQuantity: 18,
    rating: 4.6,
    reviewsCount: 89,
    tags: ["classic", "social-reform", "historical"],
    featured: true,
    publishedDate: "1897-06-10",
    addedDate: "2024-01-20",
    weight: 0.4,
    dimensions: { length: 20, width: 13, height: 2 },
  },
  {
    id: "3",
    title: "Mahaprasthanam",
    titleTelugu: "మహాప్రస్థానం",
    author: "Sri Sri",
    authorTelugu: "శ్రీ శ్రీ",
    publisher: "Andhra Saraswata Parishad",
    publisherTelugu: "ఆంధ్ర సరస్వత పరిషత్",
    category: "Poetry",
    price: 275,
    originalPrice: 300,
    isbn: "978-81-234-5680-2",
    sku: "ATK-MAH-001",
    pages: 128,
    language: "Telugu",
    description:
      "Revolutionary poetry collection that changed the landscape of Telugu literature with its progressive themes.",
    descriptionTelugu:
      "ప్రగతిశీల భావాలతో తెలుగు సా��ిత్య క్షేత్రంలో విప్లవం తెచ్చిన కవిత్వ సంకలనం.",
    coverImage:
      "https://via.placeholder.com/400x600/ec4899/white?text=మహాప్రస్థానం",
    images: [
      "https://via.placeholder.com/400x600/ec4899/white?text=మహాప్రస్థానం",
    ],
    inStock: true,
    stockQuantity: 32,
    rating: 4.9,
    reviewsCount: 234,
    tags: ["poetry", "progressive", "revolutionary"],
    featured: true,
    publishedDate: "1950-08-15",
    addedDate: "2024-02-01",
    weight: 0.3,
    dimensions: { length: 19, width: 12, height: 1.5 },
  },
  {
    id: "4",
    title: "Barrister Parvateesam",
    titleTelugu: "బారిస్టర్ పార్వతీశం",
    author: "Mokkapati Narasimha Sastry",
    authorTelugu: "మొక్కపాటి నరసింహ శాస్త్రి",
    publisher: "Emesco Books",
    publisherTelugu: "ఎమేస్కో బుక్స్",
    category: "Fiction",
    price: 325,
    originalPrice: 375,
    isbn: "978-81-234-5681-9",
    sku: "ATK-BAR-001",
    pages: 284,
    language: "Telugu",
    description:
      "A satirical novel that humorously depicts the conflicts between traditional and modern values in Indian society.",
    descriptionTelugu:
      "భారతీయ సమాజంలో సంప్రదాయ మరియు ఆధునిక విలువల ��ధ్య వైరుధ్యాలను హాస్యభరితంగా చిత్రీకరించిన వ్య��గ్య నవల.",
    coverImage:
      "https://via.placeholder.com/400x600/f59e0b/white?text=బా��ిస్టర్+పార్వతీశం",
    images: [
      "https://via.placeholder.com/400x600/f59e0b/white?text=బారిస్టర్+పార్వతీశం",
    ],
    inStock: true,
    stockQuantity: 15,
    rating: 4.7,
    reviewsCount: 167,
    tags: ["humor", "satire", "social-commentary"],
    featured: false,
    publishedDate: "1924-12-25",
    addedDate: "2024-02-10",
    weight: 0.5,
    dimensions: { length: 21, width: 13.5, height: 2.2 },
  },
  {
    id: "5",
    title: "Ramayana Kalpavruksham",
    titleTelugu: "రామాయణ కల్పవృక్షం",
    author: "Viswanatha Satyanarayana",
    authorTelugu: "విశ్వనాథ సత్యనారాయ��",
    publisher: "Telugu University Press",
    publisherTelugu: "తెలుగు విశ్వవిద్యాలయం ప్రెస్",
    category: "Devotional",
    price: 650,
    originalPrice: 750,
    isbn: "978-81-234-5682-6",
    pages: 1248,
    language: "Telugu",
    description:
      "An elaborate retelling of the Ramayana in beautiful Telugu verse, considered a modern classic.",
    descriptionTelugu:
      "అందమైన తెలుగ�� పద్యంలో రామాయణం యొక్క విస్తృత వర్ణన, ఆధునిక కాలపు క్లాసిక్��గా పరిగణించబడుతుంది.",
    coverImage:
      "https://via.placeholder.com/400x600/10b981/white?text=రామ���యణ+కల్పవృక్షం",
    images: [
      "https://via.placeholder.com/400x600/10b981/white?text=రామాయణ+కల్పవృక్షం",
    ],
    inStock: true,
    stockQuantity: 8,
    rating: 4.9,
    reviewsCount: 298,
    tags: ["devotional", "epic", "poetry"],
    featured: true,
    publishedDate: "1957-10-02",
    addedDate: "2024-01-25",
    weight: 1.2,
    dimensions: { length: 24, width: 16, height: 6 },
  },
];

export default function BooksManager({ onUploadImage }: BooksManagerProps) {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const [newBook, setNewBook] = useState<Omit<Book, "id" | "addedDate">>({
    title: "",
    titleTelugu: "",
    author: "",
    authorTelugu: "",
    publisher: "",
    publisherTelugu: "",
    category: "",
    price: 0,
    originalPrice: 0,
    isbn: "",
    pages: 0,
    language: "Telugu",
    description: "",
    descriptionTelugu: "",
    coverImage: "",
    images: [],
    inStock: true,
    stockQuantity: 0,
    rating: 0,
    reviewsCount: 0,
    tags: [],
    featured: false,
    publishedDate: "",
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
  });

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || book.category === filterCategory;
    return matchesSearch && matchesCategory;
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
        if (isEditing && editingBook) {
          setEditingBook({ ...editingBook, coverImage: imageUrl });
        } else {
          setNewBook({ ...newBook, coverImage: imageUrl });
        }
        toast({
          title: "Success",
          description: "Image uploaded successfully!",
        });
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddBook = () => {
    if (
      !newBook.title ||
      !newBook.author ||
      !newBook.publisher ||
      !newBook.sku
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including SKU.",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate SKU
    if (books.some((book) => book.sku === newBook.sku)) {
      toast({
        title: "Duplicate SKU",
        description: "A book with this SKU already exists.",
        variant: "destructive",
      });
      return;
    }

    const book: Book = {
      ...newBook,
      id: Date.now().toString(),
      addedDate: new Date().toISOString().split("T")[0],
    };

    setBooks([...books, book]);
    setNewBook({
      title: "",
      titleTelugu: "",
      author: "",
      authorTelugu: "",
      publisher: "",
      publisherTelugu: "",
      category: "",
      price: 0,
      originalPrice: 0,
      isbn: "",
      sku: "",
      pages: 0,
      language: "Telugu",
      description: "",
      descriptionTelugu: "",
      coverImage: "",
      images: [],
      inStock: true,
      stockQuantity: 0,
      rating: 0,
      reviewsCount: 0,
      tags: [],
      featured: false,
      publishedDate: "",
      weight: 0,
      dimensions: { length: 0, width: 0, height: 0 },
    });
    setIsAddingBook(false);

    toast({
      title: "Success",
      description: "Book added successfully!",
    });
  };

  const handleEditBook = () => {
    if (!editingBook) return;

    setBooks(
      books.map((book) => (book.id === editingBook.id ? editingBook : book)),
    );
    setEditingBook(null);

    toast({
      title: "Success",
      description: "Book updated successfully!",
    });
  };

  const handleDeleteBook = (id: string) => {
    setBooks(books.filter((book) => book.id !== id));
    toast({
      title: "Success",
      description: "Book deleted successfully!",
    });
  };

  const toggleBookStatus = (id: string) => {
    setBooks(
      books.map((book) =>
        book.id === id ? { ...book, inStock: !book.inStock } : book,
      ),
    );
  };

  const toggleFeatured = (id: string) => {
    setBooks(
      books.map((book) =>
        book.id === id ? { ...book, featured: !book.featured } : book,
      ),
    );
  };

  const exportData = () => {
    const dataStr = JSON.stringify(books, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "books-data.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleBooksImport = (importedBooks: Book[]) => {
    const newBooks = importedBooks.map((book) => ({
      ...book,
      id:
        book.id ||
        Date.now().toString() + Math.random().toString(36).substr(2, 9),
    }));
    setBooks([...books, ...newBooks]);
    setIsImportDialogOpen(false);
    toast({
      title: "Import Successful",
      description: `Successfully imported ${importedBooks.length} books.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Books Management
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Manage your book inventory, pricing, and catalog
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Dialog
                open={isImportDialogOpen}
                onOpenChange={setIsImportDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Import Books</DialogTitle>
                    <p className="text-sm text-gray-600">
                      Import books from WooCommerce, CSV files, or other formats
                    </p>
                  </DialogHeader>
                  <ImportBooksForm
                    onImport={handleBooksImport}
                    onClose={() => setIsImportDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
              <Dialog open={isAddingBook} onOpenChange={setIsAddingBook}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Book
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Book</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={newBook.title}
                        onChange={(e) =>
                          setNewBook({ ...newBook, title: e.target.value })
                        }
                        placeholder="Book title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="titleTelugu">Title (Telugu)</Label>
                      <Input
                        id="titleTelugu"
                        value={newBook.titleTelugu}
                        onChange={(e) =>
                          setNewBook({
                            ...newBook,
                            titleTelugu: e.target.value,
                          })
                        }
                        placeholder="తెలుగు పుస్తక పేరు"
                        className="telugu-text"
                      />
                    </div>
                    <div>
                      <Label htmlFor="author">Author *</Label>
                      <Input
                        id="author"
                        value={newBook.author}
                        onChange={(e) =>
                          setNewBook({ ...newBook, author: e.target.value })
                        }
                        placeholder="Author name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="authorTelugu">Author (Telugu)</Label>
                      <Input
                        id="authorTelugu"
                        value={newBook.authorTelugu}
                        onChange={(e) =>
                          setNewBook({
                            ...newBook,
                            authorTelugu: e.target.value,
                          })
                        }
                        placeholder="రచయిత పేరు"
                        className="telugu-text"
                      />
                    </div>
                    <div>
                      <Label htmlFor="publisher">Publisher *</Label>
                      <Input
                        id="publisher"
                        value={newBook.publisher}
                        onChange={(e) =>
                          setNewBook({ ...newBook, publisher: e.target.value })
                        }
                        placeholder="Publisher name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newBook.category}
                        onValueChange={(value) =>
                          setNewBook({ ...newBook, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="price">Price (₹) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newBook.price}
                        onChange={(e) =>
                          setNewBook({
                            ...newBook,
                            price: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="originalPrice">Original Price (₹)</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        value={newBook.originalPrice}
                        onChange={(e) =>
                          setNewBook({
                            ...newBook,
                            originalPrice: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="isbn">ISBN</Label>
                      <Input
                        id="isbn"
                        value={newBook.isbn}
                        onChange={(e) =>
                          setNewBook({ ...newBook, isbn: e.target.value })
                        }
                        placeholder="978-81-234-5678-9"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sku">SKU *</Label>
                      <Input
                        id="sku"
                        value={newBook.sku}
                        onChange={(e) =>
                          setNewBook({
                            ...newBook,
                            sku: e.target.value.toUpperCase(),
                          })
                        }
                        placeholder="ATK-BK-001"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Unique product identifier (auto-uppercase)
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="pages">Pages</Label>
                      <Input
                        id="pages"
                        type="number"
                        value={newBook.pages}
                        onChange={(e) =>
                          setNewBook({
                            ...newBook,
                            pages: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stockQuantity">Stock Quantity</Label>
                      <Input
                        id="stockQuantity"
                        type="number"
                        value={newBook.stockQuantity}
                        onChange={(e) =>
                          setNewBook({
                            ...newBook,
                            stockQuantity: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        value={newBook.weight}
                        onChange={(e) =>
                          setNewBook({
                            ...newBook,
                            weight: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0.0"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newBook.description}
                        onChange={(e) =>
                          setNewBook({
                            ...newBook,
                            description: e.target.value,
                          })
                        }
                        placeholder="Book description..."
                        rows={3}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="coverImage">Cover Image</Label>
                      <div className="flex items-center space-x-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, false)}
                          disabled={uploading}
                        />
                        {newBook.coverImage && (
                          <img
                            src={newBook.coverImage}
                            alt="Cover"
                            className="w-16 h-20 object-cover rounded"
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newBook.featured}
                        onCheckedChange={(checked) =>
                          setNewBook({ ...newBook, featured: checked })
                        }
                      />
                      <Label>Featured Book</Label>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingBook(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddBook} disabled={uploading}>
                      {uploading ? "Uploading..." : "Add Book"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search books, authors, ISBN, SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold">{books.length}</p>
                <p className="text-sm text-gray-600">Total Books</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold">
                  {books.filter((b) => b.inStock).length}
                </p>
                <p className="text-sm text-gray-600">In Stock</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold">
                  {books.filter((b) => b.featured).length}
                </p>
                <p className="text-sm text-gray-600">Featured</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <IndianRupee className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold">
                  ₹
                  {books
                    .reduce((sum, b) => sum + b.stockQuantity * b.price, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Value</p>
              </CardContent>
            </Card>
          </div>

          {/* Books Table */}
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50/50">
                    <th className="text-left p-4 font-medium">Book</th>
                    <th className="text-left p-4 font-medium">Author</th>
                    <th className="text-left p-4 font-medium">Category</th>
                    <th className="text-left p-4 font-medium">Price</th>
                    <th className="text-left p-4 font-medium">Stock</th>
                    <th className="text-left p-4 font-medium">Rating</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="border-b hover:bg-gray-50/50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">{book.title}</p>
                            {book.titleTelugu && (
                              <p className="text-sm text-gray-600 telugu-text">
                                {book.titleTelugu}
                              </p>
                            )}
                            <p className="text-xs text-gray-500">
                              ISBN: {book.isbn}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{book.author}</p>
                        {book.authorTelugu && (
                          <p className="text-sm text-gray-600 telugu-text">
                            {book.authorTelugu}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary">{book.category}</Badge>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">₹{book.price}</p>
                        {book.originalPrice > book.price && (
                          <p className="text-xs text-gray-500 line-through">
                            ₹{book.originalPrice}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <p
                          className={`font-medium ${book.stockQuantity < 5 ? "text-red-600" : "text-green-600"}`}
                        >
                          {book.stockQuantity}
                        </p>
                        <p className="text-xs text-gray-500">
                          {book.inStock ? "In Stock" : "Out of Stock"}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{book.rating}</span>
                          <span className="text-xs text-gray-500">
                            ({book.reviewsCount})
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center space-x-1">
                            <button onClick={() => toggleBookStatus(book.id)}>
                              {book.inStock ? (
                                <Eye className="w-4 h-4 text-green-600" />
                              ) : (
                                <EyeOff className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                            <span className="text-xs">
                              {book.inStock ? "Active" : "Inactive"}
                            </span>
                          </div>
                          {book.featured && (
                            <Badge variant="default" className="text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingBook(book)}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFeatured(book.id)}
                            className={
                              book.featured
                                ? "text-yellow-600"
                                : "text-gray-400"
                            }
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBook(book.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No books found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterCategory !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by adding your first book"}
              </p>
              {!searchTerm && filterCategory === "all" && (
                <Button onClick={() => setIsAddingBook(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Book
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Book Dialog */}
      {editingBook && (
        <Dialog open={!!editingBook} onOpenChange={() => setEditingBook(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Book</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingBook.title}
                  onChange={(e) =>
                    setEditingBook({ ...editingBook, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-author">Author</Label>
                <Input
                  id="edit-author"
                  value={editingBook.author}
                  onChange={(e) =>
                    setEditingBook({ ...editingBook, author: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-price">Price (₹)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editingBook.price}
                  onChange={(e) =>
                    setEditingBook({
                      ...editingBook,
                      price: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-stock">Stock Quantity</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={editingBook.stockQuantity}
                  onChange={(e) =>
                    setEditingBook({
                      ...editingBook,
                      stockQuantity: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingBook.description}
                  onChange={(e) =>
                    setEditingBook({
                      ...editingBook,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingBook.inStock}
                  onCheckedChange={(checked) =>
                    setEditingBook({ ...editingBook, inStock: checked })
                  }
                />
                <Label>In Stock</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingBook.featured}
                  onCheckedChange={(checked) =>
                    setEditingBook({ ...editingBook, featured: checked })
                  }
                />
                <Label>Featured</Label>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setEditingBook(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditBook}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Import Books Form Component
function ImportBooksForm({
  onImport,
  onClose,
}: {
  onImport: (books: Book[]) => void;
  onClose: () => void;
}) {
  const [importMethod, setImportMethod] = useState("csv");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [woocommerceUrl, setWoocommerceUrl] = useState("");
  const [woocommerceKey, setWoocommerceKey] = useState("");
  const [woocommerceSecret, setWoocommerceSecret] = useState("");
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [totalBooksToImport, setTotalBooksToImport] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
      parseCSVFile(file);
    }
  };

  const handleJsonUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/json") {
      setJsonFile(file);
      parseJSONFile(file);
    }
  };

  const parseCSVFile = async (file: File) => {
    const text = await file.text();
    const lines = text.split("\n");
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));

    // Count total valid books
    const allBooks = lines
      .slice(1)
      .map((line) => {
        const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || "";
        });
        return obj;
      })
      .filter((obj) => obj.title || obj.Title || obj.name || obj.Name);

    setTotalBooksToImport(allBooks.length);

    // Show preview of first 5
    const preview = allBooks.slice(0, 5);
    setImportPreview(preview);
  };

  const parseJSONFile = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const allBooks = Array.isArray(data) ? data : [data];
      const validBooks = allBooks.filter((book) => book.title || book.name);

      setTotalBooksToImport(validBooks.length);

      // Show preview of first 5
      const preview = validBooks.slice(0, 5);
      setImportPreview(preview);
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON file format.",
        variant: "destructive",
      });
    }
  };

  const testWooCommerceConnection = async () => {
    setIsLoading(true);
    try {
      // First get total count of products
      const countResponse = await fetch(
        `${woocommerceUrl}/wp-json/wc/v3/products?per_page=1`,
        {
          headers: {
            Authorization: `Basic ${btoa(`${woocommerceKey}:${woocommerceSecret}`)}`,
          },
        },
      );

      if (countResponse.ok) {
        const totalProducts = parseInt(
          countResponse.headers.get("X-WP-Total") || "0",
        );
        setTotalBooksToImport(totalProducts);

        // Get first 5 products for preview
        const previewResponse = await fetch(
          `${woocommerceUrl}/wp-json/wc/v3/products?per_page=5`,
          {
            headers: {
              Authorization: `Basic ${btoa(`${woocommerceKey}:${woocommerceSecret}`)}`,
            },
          },
        );

        const products = await previewResponse.json();
        const preview = products.map((product: any) => ({
          title: product.name,
          author:
            product.attributes?.find((attr: any) => attr.name === "Author")
              ?.options?.[0] || "Unknown Author",
          price: parseFloat(product.price) || 0,
          description: product.description?.replace(/<[^>]*>/g, "") || "",
          category: product.categories?.[0]?.name || "General",
          stock: product.stock_quantity || 0,
          images: product.images?.length || 0,
        }));
        setImportPreview(preview);
        toast({
          title: "Connection Successful",
          description: `Found ${totalProducts} total products. Showing preview of first 5.`,
        });
      } else {
        throw new Error("Connection failed");
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please check your WooCommerce credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    setIsLoading(true);
    try {
      let booksToImport: Book[] = [];

      if (importMethod === "csv" && csvFile) {
        booksToImport = await parseCSVForImport(csvFile);
      } else if (importMethod === "json" && jsonFile) {
        booksToImport = await parseJSONForImport(jsonFile);
      } else if (importMethod === "woocommerce") {
        booksToImport = await importFromWooCommerce();
      }

      if (booksToImport.length > 0) {
        onImport(booksToImport);
        toast({
          title: "Import Successful",
          description: `Successfully imported ${booksToImport.length} books.`,
        });
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Please check your file format and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const parseCSVForImport = async (file: File): Promise<Book[]> => {
    const text = await file.text();
    const lines = text.split("\n");
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));

    return lines
      .slice(1)
      .map((line, index) => {
        const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || "";
        });

        // Handle multiple images - check for image1, image2, etc. or comma-separated images
        const images = [];
        if (obj.images && obj.images.includes(",")) {
          images.push(
            ...obj.images
              .split(",")
              .map((img: string) => img.trim())
              .filter(Boolean),
          );
        } else {
          for (let i = 1; i <= 10; i++) {
            const imgField = obj[`image${i}`] || obj[`Image${i}`];
            if (imgField) images.push(imgField);
          }
          if (images.length === 0) {
            images.push(
              obj.image ||
                obj.Image ||
                obj.cover_image ||
                obj.coverImage ||
                "https://via.placeholder.com/400x600/gray/white?text=No+Image",
            );
          }
        }

        return {
          id: `imported_${Date.now()}_${index}`,
          title: obj.title || obj.Title || obj.name || obj.Name || "",
          titleTelugu:
            obj.title_telugu || obj.titleTelugu || obj.Title_Telugu || "",
          author: obj.author || obj.Author || "Unknown Author",
          authorTelugu:
            obj.author_telugu || obj.authorTelugu || obj.Author_Telugu || "",
          publisher: obj.publisher || obj.Publisher || "Unknown Publisher",
          publisherTelugu:
            obj.publisher_telugu ||
            obj.publisherTelugu ||
            obj.Publisher_Telugu ||
            "",
          category: obj.category || obj.Category || "General",
          price: parseFloat(obj.price || obj.Price) || 0,
          originalPrice:
            parseFloat(
              obj.original_price || obj.originalPrice || obj.regular_price,
            ) ||
            parseFloat(obj.price || obj.Price) ||
            0,
          isbn: obj.isbn || obj.ISBN || obj.sku || obj.SKU || "",
          pages: parseInt(obj.pages || obj.Pages) || 0,
          language: obj.language || obj.Language || "Telugu",
          description:
            obj.description || obj.Description || obj.short_description || "",
          descriptionTelugu:
            obj.description_telugu ||
            obj.descriptionTelugu ||
            obj.Description_Telugu ||
            "",
          coverImage:
            images[0] ||
            "https://via.placeholder.com/400x600/gray/white?text=No+Image",
          images:
            images.length > 0
              ? images
              : [
                  "https://via.placeholder.com/400x600/gray/white?text=No+Image",
                ],
          inStock:
            (
              obj.in_stock ||
              obj.inStock ||
              obj.stock_status ||
              "true"
            ).toLowerCase() === "true" ||
            (
              obj.in_stock ||
              obj.inStock ||
              obj.stock_status ||
              "true"
            ).toLowerCase() === "instock",
          stockQuantity:
            parseInt(
              obj.stock || obj.Stock || obj.quantity || obj.stock_quantity,
            ) || 0,
          rating:
            parseFloat(obj.rating || obj.Rating || obj.average_rating) || 4.0,
          reviewsCount:
            parseInt(
              obj.reviews ||
                obj.Reviews ||
                obj.review_count ||
                obj.rating_count,
            ) || 0,
          tags: (obj.tags || obj.Tags || "")
            .split(",")
            .map((t: string) => t.trim())
            .filter(Boolean),
          featured:
            (obj.featured || obj.Featured || "false").toLowerCase() === "true",
          publishedDate:
            obj.published_date ||
            obj.publishedDate ||
            obj.date_created ||
            new Date().toISOString().split("T")[0],
          addedDate: new Date().toISOString().split("T")[0],
          weight: parseFloat(obj.weight || obj.Weight) || 0.5,
          dimensions: {
            length:
              parseFloat(obj.length || obj.Length || obj.dimension_length) ||
              20,
            width:
              parseFloat(obj.width || obj.Width || obj.dimension_width) || 13,
            height:
              parseFloat(obj.height || obj.Height || obj.dimension_height) || 2,
          },
        };
      })
      .filter((book) => book.title);
  };

  const parseJSONForImport = async (file: File): Promise<Book[]> => {
    const text = await file.text();
    const data = JSON.parse(text);
    const books = Array.isArray(data) ? data : [data];

    return books
      .map((item, index) => ({
        id: item.id || `imported_${Date.now()}_${index}`,
        title: item.title || item.name || "",
        author: item.author || "Unknown Author",
        publisher: item.publisher || "Unknown Publisher",
        category: item.category || "General",
        price: parseFloat(item.price) || 0,
        originalPrice: parseFloat(item.originalPrice || item.price) || 0,
        isbn: item.isbn || "",
        pages: parseInt(item.pages) || 0,
        language: item.language || "Telugu",
        description: item.description || "",
        coverImage:
          item.coverImage ||
          item.image ||
          "https://via.placeholder.com/400x600/gray/white?text=No+Image",
        images: item.images || [item.coverImage || item.image] || [
            "https://via.placeholder.com/400x600/gray/white?text=No+Image",
          ],
        inStock: item.inStock !== false,
        stockQuantity: parseInt(item.stockQuantity || item.stock) || 0,
        rating: parseFloat(item.rating) || 4.0,
        reviewsCount: parseInt(item.reviewsCount || item.reviews) || 0,
        tags: Array.isArray(item.tags) ? item.tags : [],
        featured: item.featured || false,
        publishedDate:
          item.publishedDate || new Date().toISOString().split("T")[0],
        addedDate: new Date().toISOString().split("T")[0],
        weight: parseFloat(item.weight) || 0.5,
        dimensions: item.dimensions || { length: 20, width: 13, height: 2 },
      }))
      .filter((book) => book.title);
  };

  const importFromWooCommerce = async (): Promise<Book[]> => {
    let allProducts: any[] = [];
    let page = 1;
    let hasMore = true;

    // Fetch all products by paginating through all pages
    while (hasMore) {
      const response = await fetch(
        `${woocommerceUrl}/wp-json/wc/v3/products?per_page=100&page=${page}`,
        {
          headers: {
            Authorization: `Basic ${btoa(`${woocommerceKey}:${woocommerceSecret}`)}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch from WooCommerce");

      const products = await response.json();
      allProducts = [...allProducts, ...products];

      // Check if there are more pages
      hasMore = products.length === 100;
      page++;
    }

    return allProducts
      .map((product: any, index: number) => ({
        id: `wc_import_${product.id}`,
        title: product.name || "",
        titleTelugu:
          product.attributes?.find(
            (attr: any) =>
              attr.name.toLowerCase().includes("telugu") &&
              attr.name.toLowerCase().includes("title"),
          )?.options?.[0] || "",
        author:
          product.attributes?.find((attr: any) => attr.name === "Author")
            ?.options?.[0] || "Unknown Author",
        authorTelugu:
          product.attributes?.find(
            (attr: any) =>
              attr.name.toLowerCase().includes("telugu") &&
              attr.name.toLowerCase().includes("author"),
          )?.options?.[0] || "",
        publisher:
          product.attributes?.find((attr: any) => attr.name === "Publisher")
            ?.options?.[0] || "Unknown Publisher",
        publisherTelugu:
          product.attributes?.find(
            (attr: any) =>
              attr.name.toLowerCase().includes("telugu") &&
              attr.name.toLowerCase().includes("publisher"),
          )?.options?.[0] || "",
        category: product.categories?.[0]?.name || "General",
        price: parseFloat(product.price) || 0,
        originalPrice:
          parseFloat(product.regular_price) || parseFloat(product.price) || 0,
        isbn: product.sku || "",
        pages:
          parseInt(
            product.attributes?.find((attr: any) => attr.name === "Pages")
              ?.options?.[0],
          ) || 0,
        language:
          product.attributes?.find((attr: any) => attr.name === "Language")
            ?.options?.[0] || "Telugu",
        description:
          product.description?.replace(/<[^>]*>/g, "") ||
          product.short_description?.replace(/<[^>]*>/g, "") ||
          "",
        descriptionTelugu:
          product.attributes?.find(
            (attr: any) =>
              attr.name.toLowerCase().includes("telugu") &&
              attr.name.toLowerCase().includes("description"),
          )?.options?.[0] || "",
        coverImage:
          product.images?.[0]?.src ||
          "https://via.placeholder.com/400x600/gray/white?text=No+Image",
        images: product.images?.map((img: any) => img.src) || [
          "https://via.placeholder.com/400x600/gray/white?text=No+Image",
        ],
        inStock: product.stock_status === "instock",
        stockQuantity: parseInt(product.stock_quantity) || 0,
        rating: parseFloat(product.average_rating) || 4.0,
        reviewsCount: parseInt(product.rating_count) || 0,
        tags: product.tags?.map((tag: any) => tag.name) || [],
        featured: product.featured || false,
        publishedDate:
          product.date_created?.split("T")[0] ||
          new Date().toISOString().split("T")[0],
        addedDate: new Date().toISOString().split("T")[0],
        weight: parseFloat(product.weight) || 0.5,
        dimensions: {
          length: parseFloat(product.dimensions?.length) || 20,
          width: parseFloat(product.dimensions?.width) || 13,
          height: parseFloat(product.dimensions?.height) || 2,
        },
      }))
      .filter((book) => book.title);
  };

  return (
    <div className="space-y-6">
      {/* Import Method Selection */}
      <div className="space-y-4">
        <Label>Import Method</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            className={`cursor-pointer border-2 ${importMethod === "woocommerce" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
            onClick={() => setImportMethod("woocommerce")}
          >
            <CardContent className="p-4 text-center">
              <Globe className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-medium">WooCommerce</h3>
              <p className="text-xs text-gray-600">
                Import from WordPress WooCommerce
              </p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer border-2 ${importMethod === "csv" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
            onClick={() => setImportMethod("csv")}
          >
            <CardContent className="p-4 text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-medium">CSV File</h3>
              <p className="text-xs text-gray-600">Upload CSV spreadsheet</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer border-2 ${importMethod === "json" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
            onClick={() => setImportMethod("json")}
          >
            <CardContent className="p-4 text-center">
              <Database className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-medium">JSON File</h3>
              <p className="text-xs text-gray-600">Upload JSON data file</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* WooCommerce Configuration */}
      {importMethod === "woocommerce" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">WooCommerce Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wooUrl">Store URL</Label>
              <Input
                id="wooUrl"
                value={woocommerceUrl}
                onChange={(e) => setWoocommerceUrl(e.target.value)}
                placeholder="https://yourstore.com"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wooKey">Consumer Key</Label>
                <Input
                  id="wooKey"
                  value={woocommerceKey}
                  onChange={(e) => setWoocommerceKey(e.target.value)}
                  placeholder="ck_..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wooSecret">Consumer Secret</Label>
                <Input
                  id="wooSecret"
                  type="password"
                  value={woocommerceSecret}
                  onChange={(e) => setWoocommerceSecret(e.target.value)}
                  placeholder="cs_..."
                />
              </div>
            </div>
            <Button onClick={testWooCommerceConnection} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Test Connection
            </Button>
          </CardContent>
        </Card>
      )}

      {/* CSV Upload */}
      {importMethod === "csv" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upload CSV File</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csvFile">CSV File</Label>
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
              />
              <p className="text-xs text-gray-600">
                Expected columns: title, author, publisher, category, price,
                originalPrice, isbn, pages, description, image1, image2, stock,
                rating, tags, featured, language
                <br />
                <span className="text-blue-600">Telugu fields:</span>{" "}
                title_telugu, author_telugu, publisher_telugu,
                description_telugu
                <br />
                <span className="text-green-600">Multiple images:</span> Use
                image1, image2, image3... or comma-separated images column
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* JSON Upload */}
      {importMethod === "json" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upload JSON File</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jsonFile">JSON File</Label>
              <Input
                id="jsonFile"
                type="file"
                accept=".json"
                onChange={handleJsonUpload}
              />
              <p className="text-xs text-gray-600">
                JSON array of book objects with standard fields
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      {importPreview.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Import Preview</CardTitle>
            <p className="text-sm text-gray-600">
              Preview of first 5 records •{" "}
              <span className="font-semibold text-green-600">
                Total to import: {totalBooksToImport}
              </span>
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {importPreview.map((item, index) => (
                <div key={index} className="border rounded p-3 bg-gray-50">
                  <h4 className="font-medium">
                    {item.title || item.Title || item.name || item.Name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {item.author || item.Author} •{" "}
                    {item.category || item.Category} • ₹
                    {item.price || item.Price}
                  </p>
                  {item.images && (
                    <p className="text-xs text-blue-600">
                      {typeof item.images === "number"
                        ? `${item.images} images`
                        : `${item.images.length || 1} images`}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                      {(item.description || "").substring(0, 100)}...
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleImport}
          disabled={isLoading || totalBooksToImport === 0}
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          Import{" "}
          {totalBooksToImport > 0
            ? `All ${totalBooksToImport}`
            : importPreview.length}{" "}
          Books
        </Button>
      </div>
    </div>
  );
}
