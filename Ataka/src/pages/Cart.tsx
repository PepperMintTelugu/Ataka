
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, totalAmount, itemCount } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (itemCount === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-serif font-bold mb-6">Your Cart</h1>
        <div className="max-w-md mx-auto py-12">
          <p className="text-xl text-gray-600 mb-8">Your cart is empty</p>
          <Button onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-serif font-bold mb-6">Your Cart</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-4 py-6 border-b border-gray-200">
                <div className="w-24 h-32 flex-shrink-0 mx-auto sm:mx-0">
                  <img 
                    src={item.coverImage} 
                    alt={item.title} 
                    className="w-full h-full object-cover rounded shadow-sm"
                  />
                </div>
                
                <div className="flex-grow">
                  <Link to={`/books/${item.slug}`} className="font-medium text-lg text-gray-800 hover:text-primary">
                    {item.title}
                  </Link>
                  <p className="text-gray-600 text-sm mb-2">{item.author}</p>
                  
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-3">
                    <div className="flex items-center border rounded overflow-hidden">
                      <button 
                        className="px-3 py-1 border-r"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-1">{item.quantity}</span>
                      <button 
                        className="px-3 py-1 border-l"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-primary">₹{item.price}</div>
                      <div className="text-sm text-gray-600">₹{(item.price * item.quantity).toFixed(2)} total</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeItem(item.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="font-medium text-lg mb-4">Order Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>Free</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            
            <Button 
              onClick={() => navigate('/checkout')} 
              className="w-full bg-primary hover:bg-primary-light"
            >
              Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              variant="link" 
              onClick={() => navigate('/')} 
              className="w-full mt-4"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
