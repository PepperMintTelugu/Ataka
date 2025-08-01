import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mb-16 lg:mb-0">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-brand-600 to-telugu-600 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              Stay Updated with New Releases
            </h3>
            <p className="text-white/90 mb-6 telugu-text">
              కొత్త పుస���తకాలు మరియు ప్రత్యేక ఆఫర్లకు సబ్స్క్రైబ్ చేసుకోండి
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
              />
              <Button
                variant="secondary"
                className="bg-white text-brand-600 hover:bg-gray-100 whitespace-nowrap"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* Social Media Icons Row */}
          <div className="flex justify-center space-x-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full"
            >
              <Facebook className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full"
            >
              <Twitter className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full"
            >
              <Instagram className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full"
            >
              <Youtube className="w-5 h-5" />
            </Button>
          </div>

          {/* Main Content Grid - 2 columns on mobile */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-base lg:text-lg mb-3 lg:mb-4">Quick Links</h4>
              <nav className="space-y-1.5 lg:space-y-2">
                <Link
                  to="/shop"
                  className="block text-gray-300 hover:text-white transition-colors text-xs lg:text-sm"
                >
                  All Books
                </Link>
                <Link
                  to="/shop?category=literature"
                  className="block text-gray-300 hover:text-white transition-colors text-xs lg:text-sm"
                >
                  Literature
                </Link>
                <Link
                  to="/shop?category=poetry"
                  className="block text-gray-300 hover:text-white transition-colors text-xs lg:text-sm"
                >
                  Poetry
                </Link>
                <Link
                  to="/shop?category=devotional"
                  className="block text-gray-300 hover:text-white transition-colors text-xs lg:text-sm"
                >
                  Devotional
                </Link>
                <Link
                  to="/shop?category=children"
                  className="block text-gray-300 hover:text-white transition-colors text-xs lg:text-sm"
                >
                  Children's Books
                </Link>
                <Link
                  to="/shop?bestseller=true"
                  className="block text-gray-300 hover:text-white transition-colors text-xs lg:text-sm"
                >
                  Bestsellers
                </Link>
              </nav>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-base lg:text-lg mb-3 lg:mb-4">Contact Info</h4>
              <div className="space-y-2 lg:space-y-3">
                <div className="flex items-start space-x-2">
                  <Mail className="w-3 h-3 lg:w-4 lg:h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <a
                      href="mailto:support@telugubooks.org"
                      className="text-xs lg:text-sm text-white hover:text-brand-400 transition-colors"
                    >
                      support@telugubooks.org
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Phone className="w-3 h-3 lg:w-4 lg:h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <a
                      href="tel:+919876543210"
                      className="text-xs lg:text-sm text-white hover:text-brand-400 transition-colors"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-3 h-3 lg:w-4 lg:h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs lg:text-sm text-white">
                      Hyderabad, Telangana
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Service - Hidden on mobile, shown on larger screens */}
            <div className="hidden lg:block">
              <h4 className="font-semibold text-lg mb-4">Customer Service</h4>
              <nav className="space-y-2">
                <Link
                  to="/about"
                  className="block text-gray-300 hover:text-white transition-colors text-sm"
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className="block text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Contact Us
                </Link>
                <Link
                  to="/shipping-policy"
                  className="block text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Shipping Policy
                </Link>
                <Link
                  to="/refund-policy"
                  className="block text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Return & Refund Policy
                </Link>
                <Link
                  to="/faq"
                  className="block text-gray-300 hover:text-white transition-colors text-sm"
                >
                  FAQ
                </Link>
                <Link
                  to="/track-order"
                  className="block text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Track Your Order
                </Link>
              </nav>
            </div>

            {/* Brand Section - Hidden on mobile, shown on larger screens */}
            <div className="hidden lg:block">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Feb6a9d54076e488bac688c857f8339b7%2Ffb10c84215264db69542d6861e716ef1?format=webp&width=200"
                  alt="Ataka - The Ultimate Bookstore"
                  className="h-8 w-auto brightness-0 invert"
                />
              </Link>
              <p className="text-gray-300 text-sm">
                Preserving and promoting Telugu literature with free delivery on orders above ₹299,
                aesthetic packaging, and cut-throat prices.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Bottom Footer */}
      <div className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-sm text-gray-400">
                © 2024 Ataka - The Ultimate Bookstore. All rights reserved.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <Link
                  to="/privacy"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
                <Link
                  to="/refund-policy"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Refund Policy
                </Link>
                <Link
                  to="/shipping-policy"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Shipping Policy
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <span>Powered by</span>
                <span className="text-brand-400 font-medium">Razorpay</span>
                <span>&</span>
                <span className="text-telugu-400 font-medium">ShipRocket</span>
              </div>
              <div className="text-xs text-gray-500">
                Website by <span className="text-orange-400 font-medium">Southern Sensors</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
