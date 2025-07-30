
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Truck, MapPin } from 'lucide-react';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const orderNumber = `ATAKA${Math.floor(Math.random() * 10000)}`;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        
        <h1 className="text-3xl font-serif font-bold mb-2">Thank You for Your Order!</h1>
        <p className="text-xl text-gray-600 mb-6">Your order has been received</p>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 pb-4 border-b">
            <div>
              <p className="text-gray-600">Order Number:</p>
              <p className="font-bold text-lg">{orderNumber}</p>
            </div>
            <Button 
              variant="outline" 
              className="mt-3 sm:mt-0"
              onClick={() => {
                // This would normally track the order
                navigate('/account/orders');
              }}
            >
              Track Order
            </Button>
          </div>
          
          <div className="space-y-6">
            <div className="flex">
              <Package className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Order Processing</h3>
                <p className="text-sm text-gray-600">Your order is being processed and will be shipped soon.</p>
              </div>
            </div>
            
            <div className="flex">
              <Truck className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Delivery Information</h3>
                <p className="text-sm text-gray-600">Estimated delivery: 3-7 business days</p>
              </div>
            </div>
            
            <div className="flex">
              <MapPin className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Shipping Updates</h3>
                <p className="text-sm text-gray-600">You'll receive shipping updates via email and SMS.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-x-4">
          <Button asChild>
            <Link to="/">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/account/orders">View My Orders</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
