
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BookGrid from '@/components/books/BookGrid';
import books from '@/data/books';
import { Book } from '@/data/books';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const categories = [
  { value: 'all', label: 'All Books' },
  { value: 'fiction', label: 'Fiction' },
  { value: 'poetry', label: 'Poetry' },
  { value: 'classic', label: 'Classics' },
  { value: 'novel', label: 'Novels' },
];

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [sortBy, setSortBy] = useState('popularity');
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    let filtered: Book[];
    
    if (slug && slug !== 'all') {
      // Map URL slug to category name patterns for filtering
      let categoryPatterns: string[];
      
      switch (slug) {
        case 'fiction':
          categoryPatterns = ['fiction', 'novel'];
          break;
        case 'poetry':
          categoryPatterns = ['poetry'];
          break;
        case 'classics':
          categoryPatterns = ['classic'];
          break;
        case 'children':
          categoryPatterns = ['children'];
          break;
        default:
          categoryPatterns = [slug];
      }
      
      filtered = books.filter(book => 
        book.categories.some(category => 
          categoryPatterns.some(pattern => 
            category.toLowerCase().includes(pattern.toLowerCase())
          )
        )
      );
    } else {
      filtered = [...books];
    }
    
    sortBooks(filtered, sortBy);
  }, [slug]);
  
  const sortBooks = (booksToSort: Book[], sorter: string) => {
    let sorted: Book[];
    
    switch (sorter) {
      case 'price-low':
        sorted = [...booksToSort].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted = [...booksToSort].sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sorted = [...booksToSort].sort((a, b) => b.publicationYear - a.publicationYear);
        break;
      case 'popularity':
      default:
        sorted = [...booksToSort].sort((a, b) => b.rating - a.rating);
        break;
    }
    
    setFilteredBooks(sorted);
  };
  
  const handleSortChange = (value: string) => {
    setSortBy(value);
    sortBooks(filteredBooks, value);
  };
  
  const getCategoryTitle = () => {
    if (!slug || slug === 'all') return 'All Books';
    
    const category = categories.find(cat => cat.value === slug);
    return category ? category.label : slug.charAt(0).toUpperCase() + slug.slice(1);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-serif font-bold mb-6">{getCategoryTitle()}</h1>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <p className="text-gray-600">{filteredBooks.length} books found</p>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-700">Sort by:</span>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Popularity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest Arrivals</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredBooks.length > 0 ? (
        <BookGrid books={filteredBooks} />
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No books found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
