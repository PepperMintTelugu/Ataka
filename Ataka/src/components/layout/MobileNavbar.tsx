
import { Home, BookOpen, ShoppingCart, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { Badge } from '@/components/ui/badge';

const MobileNavbar = () => {
  const { itemCount } = useCart();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
      <div className="grid grid-cols-4 h-16">
        <Link to="/" className="mobile-nav-item">
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>
        <Link to="/categories" className="mobile-nav-item">
          <BookOpen className="w-5 h-5" />
          <span>Categories</span>
        </Link>
        <Link to="/cart" className="mobile-nav-item relative">
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-4 min-w-[16px] px-1 flex items-center justify-center bg-primary text-[10px] text-white rounded-full">
                {itemCount}
              </Badge>
            )}
          </div>
          <span>Cart</span>
        </Link>
        <Link to="/account" className="mobile-nav-item">
          <User className="w-5 h-5" />
          <span>Account</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavbar;
