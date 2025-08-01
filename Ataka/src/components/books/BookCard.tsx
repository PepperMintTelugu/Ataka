
import { Link } from 'react-router-dom';
import { Book } from '@/data/books';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const { addItem } = useCart();
  
  const discountPercentage = Math.round(
    ((book.originalPrice - book.price) / book.originalPrice) * 100
  );

  return (
    <div className="book-card">
      {discountPercentage > 0 && (
        <span className="book-discount-tag">-{discountPercentage}%</span>
      )}
      
      <Link to={`/books/${book.slug}`} className="book-card-image">
        <img 
          src={book.coverImage} 
          alt={book.title} 
          loading="lazy"
        />
      </Link>
      
      <div className="book-card-content">
        <Link to={`/books/${book.slug}`} className="block">
          <h3 className="font-medium text-gray-800 line-clamp-2 h-12 mb-1">{book.title}</h3>
        </Link>
        
        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
        
        <div className="price-tag mt-auto mb-2">
          <span className="current">₹{book.price}</span>
          {book.originalPrice > book.price && (
            <span className="original">₹{book.originalPrice}</span>
          )}
        </div>
        
        <Button 
          onClick={() => addItem(book)} 
          className="w-full bg-primary hover:bg-primary-light text-white"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default BookCard;
