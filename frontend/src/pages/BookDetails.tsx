import React, { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import {
  Star,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RefreshCw,
  Share2,
  ChevronLeft,
  ChevronRight,
  Package,
  Calendar,
  Globe,
  Book,
  Ruler,
  Weight,
  Award,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookCard } from "@/components/BookCard";
import { useCart, useWishlist } from "@/contexts/AppContext";
import { getBookById, mockBooks } from "@/data/books";
import { BookSeries } from "@/components/BookSeries";
import { ReadingLevel } from "@/components/ReadingLevel";
import { BookCondition } from "@/components/BookCondition";
import { BundleDeals } from "@/components/BundleDeals";
import { StockAlert } from "@/components/StockAlert";
import { BookPreview } from "@/components/BookPreview";
import { DeliveryEstimation } from "@/components/DeliveryEstimation";
import { getAuthorPath, getPublisherPath } from "@/utils/slugify";
import { cn } from "@/lib/utils";
import { useScrollDirection } from "@/hooks/useScrollDirection";

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const book = id ? getBookById(id) : null;
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { scrollDirection, isScrolled } = useScrollDirection(100);

  if (!book) {
    return <Navigate to="/404" replace />;
  }

  const inWishlist = isInWishlist(book.id);
  const images = book.images || [book.image];
  const relatedBooks = mockBooks
    .filter(
      (b) => b.id !== book.id && b.category === book.category && b.inStock,
    )
    .slice(0, 5);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(book);
    }
  };

  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book);
    }
  };

  const discountAmount = book.originalPrice
    ? book.originalPrice - book.price
    : 0;
  const discountPercentage = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-brand-600">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/shop" className="hover:text-brand-600">
              Books
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              to={`/shop?category=${book.category.toLowerCase()}`}
              className="hover:text-brand-600"
            >
              {book.category}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 truncate">{book.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Image Gallery */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              {/* Main Image */}
              <div className="relative mb-4">
                <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden border">
                  <img
                    src={images[selectedImageIndex]}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm"
                      onClick={() =>
                        setSelectedImageIndex(
                          selectedImageIndex === 0
                            ? images.length - 1
                            : selectedImageIndex - 1,
                        )
                      }
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm"
                      onClick={() =>
                        setSelectedImageIndex(
                          (selectedImageIndex + 1) % images.length,
                        )
                      }
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  {book.atakaRank && (
                    <Badge
                      className="bg-orange-500 text-white hover:bg-orange-600 cursor-pointer transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/rankings/ataka`;
                      }}
                    >
                      <Award className="w-3 h-3 mr-1" />#{book.atakaRank} in
                      Ataka
                    </Badge>
                  )}
                  {book.categoryRank && (
                    <Badge
                      variant="outline"
                      className="border-orange-500 text-orange-600 hover:bg-orange-50 cursor-pointer transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/rankings/${encodeURIComponent(book.category)}`;
                      }}
                    >
                      <Award className="w-3 h-3 mr-1" />#{book.categoryRank} in{" "}
                      {book.category}
                    </Badge>
                  )}
                  {book.bestseller && (
                    <Badge className="bg-yellow-500 text-black">
                      Bestseller
                    </Badge>
                  )}
                  {book.newArrival && (
                    <Badge className="bg-green-500 text-white">New</Badge>
                  )}
                  {discountPercentage > 0 && (
                    <Badge className="bg-red-500 text-white">
                      {discountPercentage}% OFF
                    </Badge>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={cn(
                        "flex-shrink-0 w-16 h-20 bg-white border rounded overflow-hidden",
                        selectedImageIndex === index
                          ? "border-brand-500 ring-2 ring-brand-500"
                          : "border-gray-200",
                      )}
                    >
                      <img
                        src={image}
                        alt={`${book.title} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Book Information */}
          <div className="lg:col-span-4">
            <div className="space-y-6">
              {/* Title and Author */}
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  {book.title}
                </h1>
                {book.titleTelugu && (
                  <h2 className="text-lg text-gray-700 telugu-text mb-2">
                    {book.titleTelugu}
                  </h2>
                )}
                <p className="text-lg text-gray-600">
                  by{" "}
                  <Link
                    to={getAuthorPath(book.author)}
                    className="text-brand-600 font-medium hover:text-brand-700 hover:underline transition-colors"
                  >
                    {book.author}
                  </Link>
                  {book.authorTelugu && (
                    <span className="text-gray-500 telugu-text ml-2">
                      ({book.authorTelugu})
                    </span>
                  )}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-5 h-5",
                        i < Math.floor(book.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300",
                      )}
                    />
                  ))}
                  <span className="ml-2 text-lg font-medium">
                    {book.rating}
                  </span>
                </div>
                <span className="text-gray-500">
                  ({book.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-bold text-brand-600">
                    ₹{book.price}
                  </span>
                  {book.originalPrice && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ₹{book.originalPrice}
                      </span>
                      <span className="text-lg font-medium text-green-600">
                        Save ₹{discountAmount} ({discountPercentage}% off)
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Inclusive of all taxes • FREE Delivery
                </p>
              </div>

              {/* Stock Status */}
              <StockAlert book={book} variant="inline" />

              {/* Quantity and Actions - Hidden on mobile, shown on desktop */}
              {book.inStock && (
                <div className="space-y-4 hidden lg:block">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">Quantity:</span>
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="h-10 w-10 p-0"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                        className="h-10 w-10 p-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      size="lg"
                      onClick={handleAddToCart}
                      className="flex-1 h-12 touch-manipulation"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleToggleWishlist}
                      className={cn(
                        "flex-1 sm:flex-none h-12 touch-manipulation",
                        inWishlist && "border-red-500 text-red-500",
                      )}
                    >
                      <Heart
                        className={cn(
                          "w-5 h-5 mr-2",
                          inWishlist && "fill-current",
                        )}
                      />
                      {inWishlist ? "Saved" : "Save"}
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full h-12 touch-manipulation"
                  >
                    <Package className="w-5 h-5 mr-2" />
                    Buy Now
                  </Button>
                </div>
              )}

              {/* Mobile-only wishlist button */}
              {book.inStock && (
                <div className="lg:hidden">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleToggleWishlist}
                    className={cn(
                      "w-full h-12 touch-manipulation",
                      inWishlist && "border-red-500 text-red-500",
                    )}
                  >
                    <Heart
                      className={cn(
                        "w-5 h-5 mr-2",
                        inWishlist && "fill-current",
                      )}
                    />
                    {inWishlist ? "Saved" : "Save"}
                  </Button>
                </div>
              )}

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <Truck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">FREE Delivery</p>
                  <p className="text-xs text-gray-600">All over India</p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Secure Payment</p>
                  <p className="text-xs text-gray-600">Razorpay powered</p>
                </div>
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Easy Returns</p>
                  <p className="text-xs text-gray-600">7 days return</p>
                </div>
              </div>

              {/* Delivery Estimation */}
              <DeliveryEstimation
                bookPrice={book.price}
                bookWeight={book.pages ? book.pages * 3 : 200} // Estimate 3g per page
                className="bg-blue-50 border-blue-200"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Reading Level */}
              <ReadingLevel book={book} variant="card" />

              {/* Book Condition */}
              <BookCondition book={book} variant="card" />

              {/* Bundle Deals */}
              <BundleDeals book={book} variant="sidebar" />

              {/* Book Series */}
              <BookSeries book={book} />

              {/* Book Preview */}
              <BookPreview book={book} variant="card" />

              {/* Book Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Book className="w-5 h-5 mr-2" />
                    Book Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {book.atakaRank && (
                      <>
                        <div className="text-gray-600">Ataka Ranking:</div>
                        <div
                          className="font-medium text-orange-600 cursor-pointer hover:text-orange-700 transition-colors"
                          onClick={() => {
                            window.location.href = `/rankings/ataka`;
                          }}
                        >
                          #{book.atakaRank} in Ataka
                        </div>
                      </>
                    )}

                    {book.categoryRank && (
                      <>
                        <div className="text-gray-600">Category Ranking:</div>
                        <div
                          className="font-medium text-orange-600 cursor-pointer hover:text-orange-700 transition-colors"
                          onClick={() => {
                            window.location.href = `/rankings/${encodeURIComponent(book.category)}`;
                          }}
                        >
                          #{book.categoryRank} in {book.category}
                        </div>
                      </>
                    )}

                    <div className="text-gray-600">Publisher:</div>
                    <div className="font-medium">
                      <Link
                        to={getPublisherPath(book.publisher)}
                        className="text-brand-600 hover:text-brand-700 hover:underline transition-colors"
                      >
                        {book.publisher}
                      </Link>
                    </div>

                    <div className="text-gray-600">Language:</div>
                    <div className="font-medium">{book.language}</div>

                    <div className="text-gray-600">Pages:</div>
                    <div className="font-medium">{book.pages}</div>

                    <div className="text-gray-600">ISBN:</div>
                    <div className="font-medium font-mono text-xs">
                      {book.isbn}
                    </div>

                    <div className="text-gray-600">Published:</div>
                    <div className="font-medium">{book.publicationYear}</div>

                    <div className="text-gray-600">Dimensions:</div>
                    <div className="font-medium text-xs">
                      {book.dimensions.length} �� {book.dimensions.width} ×{" "}
                      {book.dimensions.height} cm
                    </div>

                    <div className="text-gray-600">Weight:</div>
                    <div className="font-medium">{book.weight}g</div>
                  </div>
                </CardContent>
              </Card>

              {/* Share */}
              <Card>
                <CardContent className="pt-6">
                  <Button variant="outline" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share this Book
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Description and Reviews */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="delivery">Delivery</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {book.description}
                    </p>
                    {book.descriptionTelugu && (
                      <p className="text-gray-700 leading-relaxed telugu-text">
                        {book.descriptionTelugu}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">
                        Publication Details
                      </h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Publisher:</dt>
                          <dd>
                            <Link
                              to={getPublisherPath(book.publisher)}
                              className="text-brand-600 hover:text-brand-700 hover:underline transition-colors"
                            >
                              {book.publisher}
                            </Link>
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Publication Year:</dt>
                          <dd>{book.publicationYear}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Language:</dt>
                          <dd>{book.language}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">ISBN:</dt>
                          <dd className="font-mono">{book.isbn}</dd>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Physical Details</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Pages:</dt>
                          <dd>{book.pages}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Dimensions:</dt>
                          <dd>
                            {book.dimensions.length} × {book.dimensions.width} ×{" "}
                            {book.dimensions.height} cm
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Weight:</dt>
                          <dd>{book.weight}g</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="delivery" className="mt-6">
              <div className="space-y-6">
                {/* Enhanced Delivery Estimation */}
                <DeliveryEstimation
                  bookPrice={book.price}
                  bookWeight={
                    book.weight || (book.pages ? book.pages * 3 : 200)
                  }
                />

                {/* Shipping Policy Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-green-600">
                          ✓ Free Shipping
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Orders above ₹299 across India</li>
                          <li>• No minimum order for metro cities</li>
                          <li>• Covers all pin codes</li>
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-blue-600">
                          ✓ Fast Delivery
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• 2-4 days in metro cities</li>
                          <li>• 4-7 days in other cities</li>
                          <li>• Express options available</li>
                        </ul>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <Package className="w-6 h-6 text-green-600 mx-auto mb-2" />
                        <h5 className="font-medium text-green-800">
                          Safe Packaging
                        </h5>
                        <p className="text-xs text-green-600">
                          Bubble wrap & waterproof
                        </p>
                      </div>

                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <h5 className="font-medium text-blue-800">
                          Damage Protection
                        </h5>
                        <p className="text-xs text-blue-600">
                          100% replacement guarantee
                        </p>
                      </div>

                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <RefreshCw className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                        <h5 className="font-medium text-purple-800">
                          Easy Returns
                        </h5>
                        <p className="text-xs text-purple-600">
                          7-day return policy
                        </p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-2">
                        📦 What's Included:
                      </h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Original book in pristine condition</li>
                        <li>• Protective packaging materials</li>
                        <li>• Purchase invoice for warranty</li>
                        <li>• Free bookmark (Telugu Books special)</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Reviews Coming Soon
                    </h3>
                    <p className="text-gray-600">
                      Customer reviews will be available once we launch our
                      review system.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">More from {book.category}</h2>
              <Button variant="outline" asChild>
                <Link to={`/shop?category=${book.category.toLowerCase()}`}>
                  View All
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {relatedBooks.map((relatedBook) => (
                <BookCard key={relatedBook.id} book={relatedBook} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      {book.inStock && (
        <div className={cn(
          "lg:hidden fixed left-0 right-0 z-40 bg-white border-t shadow-lg transition-all duration-300 ease-in-out",
          scrollDirection === 'down' && isScrolled ? "bottom-0" : "bottom-16"
        )}>
          <div className="container mx-auto px-4 py-3">
            <div className="grid grid-cols-2 gap-3">
              <Button
                size="lg"
                variant="outline"
                onClick={handleAddToCart}
                className="flex-1 h-12 touch-manipulation border-brand-500 text-brand-500 hover:bg-brand-50"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="flex-1 h-12 touch-manipulation bg-brand-500 hover:bg-brand-600"
              >
                <Package className="w-5 h-5 mr-2" />
                Buy Now
              </Button>
            </div>

            {/* Price Display */}
            <div className="flex items-center justify-center mt-2 space-x-2">
              <span className="text-lg font-bold text-brand-600">
                ₹{book.price}
              </span>
              {book.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{book.originalPrice}
                </span>
              )}
              {discountPercentage > 0 && (
                <span className="text-sm font-medium text-green-600">
                  {discountPercentage}% off
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
