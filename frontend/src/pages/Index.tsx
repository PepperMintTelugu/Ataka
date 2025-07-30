import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Star,
  Truck,
  Shield,
  RefreshCw,
  BookOpen,
  Users,
  Award,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookCard } from "@/components/BookCard";
import {
  mockBooks,
  getFeaturedBooks,
  getBestsellers,
  getNewArrivals,
  categories,
} from "@/data/books";

export default function Index() {
  const featuredBooks = getFeaturedBooks();
  const bestsellers = getBestsellers();
  const newArrivals = getNewArrivals();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-500 via-brand-600 to-telugu-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <BookOpen className="w-16 h-16 text-white/90" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Telugu Books for Every Reader
            </h1>
            <p className="text-lg lg:text-xl mb-4 text-white/90 telugu-text">
              తెలుగు సాహిత్యం మీ చేతుల అ��దుకున్నది
            </p>
            <p className="text-lg lg:text-xl mb-8 text-white/90">
              Discover the rich heritage of Telugu literature with our curated
              collection of books
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Button
                asChild
                size="lg"
                className="bg-white text-brand-600 hover:bg-gray-100 font-semibold h-12 touch-manipulation"
              >
                <Link to="/shop">Explore All Books</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-brand-600 h-12 touch-manipulation"
              >
                <Link to="/shop?category=literature">Classic Literature</Link>
              </Button>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-1">FREE Delivery</h3>
                <p className="text-sm text-white/80">
                  Free shipping on all orders across India
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-1">Aesthetic Packaging</h3>
                <p className="text-sm text-white/80">
                  Beautiful packaging for your precious books
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-1">NGO Pricing</h3>
                <p className="text-sm text-white/80">
                  Cut-throat prices with no profit margins
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold">Shop by Category</h2>
            <Button variant="outline" asChild>
              <Link to="/shop">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.id}`}
                className="group touch-manipulation"
              >
                <Card className="book-card-hover text-center h-full active:scale-95 transition-transform">
                  <CardContent className="p-4 sm:p-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-brand-100 to-telugu-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:from-brand-200 group-hover:to-telugu-200 transition-colors">
                      <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-brand-600" />
                    </div>
                    <h3 className="font-semibold text-xs sm:text-sm mb-1">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-600 telugu-text hidden sm:block">
                      {category.nameTelugu}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      {featuredBooks.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                  Featured Books
                </h2>
                <p className="text-gray-600">
                  Hand-picked selections from our collection
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/shop?featured=true">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBooks.slice(0, 3).map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  variant="featured"
                  className="h-full"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                  Bestsellers
                </h2>
                <p className="text-gray-600">Most loved books by our readers</p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/shop?bestseller=true">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {bestsellers.slice(0, 5).map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                  New Arrivals
                </h2>
                <p className="text-gray-600">
                  Fresh additions to our collection
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/shop?new=true">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {newArrivals.slice(0, 5).map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Why Choose TeluguBooks?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're passionate about preserving and promoting Telugu literature.
              Our mission is to make quality books accessible to everyone.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">FREE Delivery</h3>
              <p className="text-gray-600 text-sm">
                Free shipping across India with no minimum order value
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Secure Payments</h3>
              <p className="text-gray-600 text-sm">
                Safe and secure payments powered by Razorpay
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Easy Returns</h3>
              <p className="text-gray-600 text-sm">
                Hassle-free returns within 7 days of delivery
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">NGO Initiative</h3>
              <p className="text-gray-600 text-sm">
                Supporting Telugu literature at cut-throat prices
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-brand-500 to-telugu-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">10,000+</div>
              <div className="text-white/80">Books Available</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">5,000+</div>
              <div className="text-white/80">Happy Readers</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">500+</div>
              <div className="text-white/80">Authors</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">100%</div>
              <div className="text-white/80">Free Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Stay Updated with New Releases
            </h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter and be the first to know about new
              Telugu books and special offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
              <Button
                size="lg"
                className="whitespace-nowrap bg-brand-500 hover:bg-brand-600"
              >
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
