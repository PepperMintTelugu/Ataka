
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import BookGrid from '@/components/books/BookGrid';
import { useCart } from '@/hooks/useCart';
import books from '@/data/books';
import { Book } from '@/data/books';
import { toast } from '@/components/ui/sonner';
import { ArrowLeft } from 'lucide-react';

const BookDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Find book with matching slug
    const foundBook = books.find(b => b.slug === slug);
    
    if (foundBook) {
      setBook(foundBook);
      
      // Find related books (same category)
      const related = books
        .filter(b => 
          b.id !== foundBook.id && 
          b.categories.some(cat => foundBook.categories.includes(cat))
        )
        .slice(0, 4);
      
      setRelatedBooks(related);
    } else {
      toast.error('Book not found!');
    }
    
    setLoading(false);
  }, [slug]);

  const handleAddToCart = () => {
    if (book) {
      addItem(book);
    }
  };

  const handleBuyNow = () => {
    if (book) {
      addItem(book);
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="md:col-span-2 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-serif mb-4">Book Not Found</h2>
        <p className="mb-6">Sorry, we couldn't find the book you're looking for.</p>
        <Button onClick={() => navigate('/')}>Return to Homepage</Button>
      </div>
    );
  }

  const discountPercentage = Math.round(
    ((book.originalPrice - book.price) / book.originalPrice) * 100
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <Button 
        variant="ghost" 
        className="mb-6 pl-0" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="flex justify-center">
          <div className="relative max-w-sm w-full">
            {discountPercentage > 0 && (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded z-10">
                -{discountPercentage}% OFF
              </span>
            )}
            <img 
              src={book.coverImage} 
              alt={book.title} 
              className="w-full h-auto rounded-lg shadow-md object-cover max-h-[500px]"
            />
          </div>
        </div>
        
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-primary">₹{book.price}</span>
              {book.originalPrice > book.price && (
                <span className="ml-2 text-gray-500 line-through">₹{book.originalPrice}</span>
              )}
            </div>
            {book.stockStatus === 'in_stock' ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">In Stock</Badge>
            ) : book.stockStatus === 'low_stock' ? (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Only Few Left</Badge>
            ) : (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Out of Stock</Badge>
            )}
          </div>
          
          <div className="space-y-4 mb-6">
            <p className="text-gray-700 leading-relaxed">{book.description}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button 
              onClick={handleAddToCart} 
              size="lg" 
              className="flex-1 bg-primary hover:bg-primary-light"
              disabled={book.stockStatus === 'out_of_stock'}
            >
              Add to Cart
            </Button>
            <Button 
              onClick={handleBuyNow} 
              size="lg"
              variant="secondary"
              className="flex-1"
              disabled={book.stockStatus === 'out_of_stock'}
            >
              Buy Now
            </Button>
          </div>
          
          <Separator className="my-6" />
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="text-gray-600">Language:</div>
            <div>{book.language}</div>
            
            <div className="text-gray-600">Publisher:</div>
            <div>{book.publisher}</div>
            
            <div className="text-gray-600">Publication Year:</div>
            <div>{book.publicationYear}</div>
            
            <div className="text-gray-600">Pages:</div>
            <div>{book.pages}</div>
            
            <div className="text-gray-600">ISBN:</div>
            <div>{book.isbn}</div>
          </div>
        </div>
      </div>
      
      {relatedBooks.length > 0 && (
        <div className="my-12">
          <BookGrid books={relatedBooks} title="You May Also Like" />
        </div>
      )}
    </div>
  );
};

export default BookDetail;
