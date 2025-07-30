
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 pt-12 pb-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-serif font-bold text-xl mb-4">ATAKA</h3>
            <p className="text-gray-600 mb-4">
              Your destination for Telugu literature, stories, and novels across India.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-primary">Home</Link></li>
              <li><Link to="/categories" className="text-gray-600 hover:text-primary">Browse Categories</Link></li>
              <li><Link to="/bestsellers" className="text-gray-600 hover:text-primary">Bestsellers</Link></li>
              <li><Link to="/new-arrivals" className="text-gray-600 hover:text-primary">New Arrivals</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif font-bold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link to="/account" className="text-gray-600 hover:text-primary">My Account</Link></li>
              <li><Link to="/orders" className="text-gray-600 hover:text-primary">Order Tracking</Link></li>
              <li><Link to="/help" className="text-gray-600 hover:text-primary">Help Center</Link></li>
              <li><Link to="/returns" className="text-gray-600 hover:text-primary">Returns & Exchanges</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Email: info@ataka.in</li>
              <li>Phone: +91 98765 43210</li>
              <li>Hours: Mon-Sat, 10:00 AM - 6:00 PM</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-300 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>© {currentYear} ATAKA Books. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
