
import { useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import BookCard from '@/components/books/BookCard';
import { Book } from '@/data/books';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Package, Edit, Trash2 } from 'lucide-react';

const AdminBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState<Book>({
    id: '',
    title: '',
    author: '',
    price: 0,
    originalPrice: 0,
    coverImage: '',
    description: '',
    language: 'Telugu',
    publisher: '',
    publicationYear: new Date().getFullYear(),
    pages: 0,
    categories: [],
    tags: [],
    isbn: '',
    stockStatus: 'in_stock',
    rating: 0,
    slug: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Load from local storage on mount
  useEffect(() => {
    const storedBooks = localStorage.getItem('adminBooks');
    if (storedBooks) {
      try {
        setBooks(JSON.parse(storedBooks));
      } catch (e) {
        console.error('Failed to parse stored books', e);
      }
    }
  }, []);

  // Save to local storage on update
  useEffect(() => {
    localStorage.setItem('adminBooks', JSON.stringify(books));
  }, [books]);

  const resetBookForm = () => {
    setNewBook({
      id: '',
      title: '',
      author: '',
      price: 0,
      originalPrice: 0,
      coverImage: '',
      description: '',
      language: 'Telugu',
      publisher: '',
      publicationYear: new Date().getFullYear(),
      pages: 0,
      categories: [],
      tags: [],
      isbn: '',
      stockStatus: 'in_stock',
      rating: 0,
      slug: ''
    });
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: keyof Book) => {
    setNewBook({ ...newBook, [key]: e.target.value });
  };

  const handleSelectChange = (value: string, key: keyof Book) => {
    setNewBook({ ...newBook, [key]: value });
  };

  const handleAddBook = () => {
    if (!newBook.title || !newBook.author) {
      toast.error('Title and author are required');
      return;
    }

    const bookWithId = {
      ...newBook,
      id: isEditing ? newBook.id : `book-${Date.now()}`,
      slug: newBook.slug || newBook.title.toLowerCase().replace(/\s+/g, '-'),
      stockStatus: newBook.stockStatus || 'in_stock',
      categories: newBook.categories.length > 0 ? newBook.categories : ['Fiction'],
      tags: newBook.tags || []
    };

    if (isEditing) {
      setBooks(books.map(book => book.id === newBook.id ? bookWithId : book));
      toast.success(`"${newBook.title}" updated successfully`);
    } else {
      setBooks([...books, bookWithId]);
      toast.success(`"${newBook.title}" added to catalog`);
    }
    
    // Reset form and close dialog
    resetBookForm();
    setIsDialogOpen(false);
  };

  const handleEditBook = (book: Book) => {
    setNewBook(book);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteBook = (id: string) => {
    const bookToDelete = books.find(book => book.id === id);
    if (window.confirm(`Are you sure you want to delete "${bookToDelete?.title}"?`)) {
      setBooks(books.filter(book => book.id !== id));
      toast.success('Book deleted successfully');
    }
  };

  const handleDuplicateBook = (book: Book) => {
    const duplicatedBook = {
      ...book,
      id: `book-${Date.now()}`,
      title: `${book.title} (Copy)`,
      slug: `${book.slug}-copy`
    };
    setBooks([...books, duplicatedBook]);
    toast.success(`Duplicated "${book.title}"`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center">
          <Package className="mr-2 h-5 w-5" />
          <h2 className="text-2xl font-bold">Book Management</h2>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-muted rounded-md p-1 flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-background shadow' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-background shadow' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="18" y2="18" /></svg>
            </button>
          </div>

          {/* Add Book Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetBookForm(); setIsDialogOpen(true); }}>
                Add New Book
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Book' : 'Add New Book'}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input 
                      id="title" 
                      value={newBook.title}
                      onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author *</Label>
                    <Input 
                      id="author"
                      value={newBook.author}
                      onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input 
                      id="price" 
                      type="number"
                      value={newBook.price}
                      onChange={(e) => setNewBook({...newBook, price: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price (₹)</Label>
                    <Input 
                      id="originalPrice" 
                      type="number"
                      value={newBook.originalPrice}
                      onChange={(e) => setNewBook({...newBook, originalPrice: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={newBook.description}
                    onChange={(e) => setNewBook({...newBook, description: e.target.value})}
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categories">Category</Label>
                    <Select 
                      value={newBook.categories[0] || ''} 
                      onValueChange={(value) => setNewBook({...newBook, categories: [value]})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fiction">Fiction</SelectItem>
                        <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                        <SelectItem value="Poetry">Poetry</SelectItem>
                        <SelectItem value="Children">Children's Books</SelectItem>
                        <SelectItem value="Educational">Educational</SelectItem>
                        <SelectItem value="Reference">Reference</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stockStatus">Stock Status</Label>
                    <Select 
                      value={newBook.stockStatus} 
                      onValueChange={(value: 'in_stock' | 'low_stock' | 'out_of_stock') => 
                        setNewBook({...newBook, stockStatus: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in_stock">In Stock</SelectItem>
                        <SelectItem value="low_stock">Low Stock</SelectItem>
                        <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="coverImage">Cover Image URL</Label>
                  <Input 
                    id="coverImage" 
                    value={newBook.coverImage}
                    onChange={(e) => setNewBook({...newBook, coverImage: e.target.value})}
                    placeholder="https://example.com/book-cover.jpg"
                  />
                  {newBook.coverImage && (
                    <div className="mt-2 max-w-[100px]">
                      <img src={newBook.coverImage} alt="Cover preview" className="rounded-md border" />
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Input 
                      id="language" 
                      value={newBook.language}
                      onChange={(e) => setNewBook({...newBook, language: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="publisher">Publisher</Label>
                    <Input 
                      id="publisher"
                      value={newBook.publisher}
                      onChange={(e) => setNewBook({...newBook, publisher: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pages">Pages</Label>
                    <Input 
                      id="pages" 
                      type="number"
                      value={newBook.pages}
                      onChange={(e) => setNewBook({...newBook, pages: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input 
                    id="isbn"
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({...newBook, isbn: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publicationYear">Publication Year</Label>
                  <Input 
                    id="publicationYear"
                    type="number"
                    value={newBook.publicationYear}
                    onChange={(e) => setNewBook({...newBook, publicationYear: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddBook}>{isEditing ? 'Update Book' : 'Add Book'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Stats Summary */}
      <div className="bg-muted p-4 rounded-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Total Books</p>
            <p className="text-2xl font-bold">{books.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">In Stock</p>
            <p className="text-2xl font-bold text-green-500">
              {books.filter(book => book.stockStatus === 'in_stock').length}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Out of Stock</p>
            <p className="text-2xl font-bold text-red-500">
              {books.filter(book => book.stockStatus === 'out_of_stock').length}
            </p>
          </div>
        </div>
      </div>
      
      {/* Book List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {books.map(book => (
            <Card key={book.id} className="overflow-hidden">
              <div className="p-4">
                <BookCard book={book} />
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEditBook(book)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDeleteBook(book.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          
          {books.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              <p>No books added yet. Click "Add New Book" to get started.</p>
            </div>
          )}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Book</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map(book => (
              <TableRow key={book.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {book.coverImage && (
                      <img 
                        src={book.coverImage} 
                        alt={book.title} 
                        className="h-12 w-10 object-cover rounded-sm"
                      />
                    )}
                    <div>
                      <div className="font-medium">{book.title}</div>
                      <div className="text-xs text-muted-foreground">ISBN: {book.isbn || 'N/A'}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>₹{book.price}</TableCell>
                <TableCell>{book.categories.join(', ')}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    book.stockStatus === 'in_stock' ? 'bg-green-100 text-green-800' : 
                    book.stockStatus === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {book.stockStatus === 'in_stock' ? 'In Stock' : 
                     book.stockStatus === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDuplicateBook(book)}
                    >
                      Duplicate
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditBook(book)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteBook(book.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            
            {books.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  <p>No books added yet. Click "Add New Book" to get started.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AdminBooks;
