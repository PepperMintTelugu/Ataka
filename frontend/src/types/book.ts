export interface Book {
  id: string;
  title: string;
  titleTelugu?: string;
  author: string;
  authorTelugu?: string;
  publisher: string;
  publisherTelugu?: string;
  isbn: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  descriptionTelugu?: string;
  image: string;
  images?: string[];
  category: string;
  categoryTelugu?: string;
  pages: number;
  language: "Telugu" | "English" | "Hindi";
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  weight: number;
  publicationYear: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  // Overall Ataka ranking (primary)
  atakaRank?: number;
  atakaRankingBasis?:
    | "sales"
    | "reviews"
    | "pageViews"
    | "wishlist"
    | "cartAdds"
    | "rating"
    | "newness";

  // Category-specific ranking (secondary)
  categoryRank?: number;
  categoryRankingBasis?:
    | "sales"
    | "reviews"
    | "pageViews"
    | "wishlist"
    | "cartAdds"
    | "rating"
    | "newness";

  // Legacy fields for backward compatibility
  rank?: number;
  rankingCategory?: string;
  rankingBasis?:
    | "sales"
    | "reviews"
    | "pageViews"
    | "wishlist"
    | "cartAdds"
    | "rating"
    | "newness";
}

export interface CartItem {
  book: Book;
  quantity: number;
  addedAt: Date;
}

export interface WishlistItem {
  book: Book;
  addedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  addresses?: Address[];
  orders?: Order[];
}

export interface Address {
  id: string;
  type: "home" | "work" | "other";
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  shippingAddress: Address;
  paymentMethod: "razorpay" | "cod";
  paymentStatus: "pending" | "paid" | "failed";
  orderDate: Date;
  deliveryDate?: Date;
  trackingId?: string;
}

export interface FilterOptions {
  category?: string;
  language?: string;
  priceRange?: [number, number];
  rating?: number;
  availability?: boolean;
  sortBy?:
    | "ranking"
    | "price-low"
    | "price-high"
    | "rating-high"
    | "rating-low"
    | "newest"
    | "oldest"
    | "popular"
    | "name-asc"
    | "name-desc";
}
