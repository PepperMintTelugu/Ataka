// Mock data service for development when Appwrite is not accessible

export const mockBooks = [
  {
    $id: "mock-book-1",
    $createdAt: "2024-01-01T00:00:00.000Z",
    $updatedAt: "2024-01-01T00:00:00.000Z",
    title: "గీతా రహస్యం",
    titleTelugu: "గీతా రహస్యం",
    author: "Bal Gangadhar Tilak",
    authorTelugu: "బాల్ గంగాధర్ తిలక్",
    publisher: "Ataka Publications",
    publisherTelugu: "అటక పబ్లికేషన్స్",
    isbn: "978-81-123456-00-1",
    price: 350,
    originalPrice: 450,
    discount: 22,
    description: "A comprehensive commentary on the Bhagavad Gita",
    descriptionTelugu: "భగవద్గీతపై సమగ్ర వ్యాఖ్యానం",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400"
    ]),
    category: "Spiritual",
    categoryTelugu: "ఆధ్యాత్మిక",
    pages: 280,
    language: "Telugu",
    inStock: true,
    stock: 50,
    isFeatured: true,
    isBestseller: true,
    tags: JSON.stringify(["spiritual", "philosophy", "classical"]),
    publishedYear: 2023,
    weight: 0.4,
    dimensions: JSON.stringify({ length: 22, width: 14, height: 2 }),
    condition: "new",
    binding: "paperback",
    slug: "geeta-rahasyam",
    metaTitle: "గీతా రహస్యం - Spiritual Book",
    metaDescription: "A comprehensive commentary on the Bhagavad Gita in Telugu",
    rating: 4.5,
    reviewCount: 25,
    isActive: true
  },
  {
    $id: "mock-book-2",
    $createdAt: "2024-01-02T00:00:00.000Z",
    $updatedAt: "2024-01-02T00:00:00.000Z",
    title: "తెలుగు వ్యాకరణం",
    titleTelugu: "తెలుగు వ్యాకరణం",
    author: "C. P. Brown",
    authorTelugu: "సి. పి. బ్రౌన్",
    publisher: "Ataka Publications",
    publisherTelugu: "అటక పబ్లికేషన్స్",
    isbn: "978-81-123456-00-2",
    price: 280,
    originalPrice: 350,
    discount: 20,
    description: "Complete Telugu grammar guide",
    descriptionTelugu: "సంపూర్ణ తెలుగు వ్యాకరణ గైడ్",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
    ]),
    category: "Education",
    categoryTelugu: "విద్య",
    pages: 320,
    language: "Telugu",
    inStock: true,
    stock: 30,
    isFeatured: false,
    isBestseller: true,
    tags: JSON.stringify(["education", "grammar", "language"]),
    publishedYear: 2023,
    weight: 0.5,
    dimensions: JSON.stringify({ length: 22, width: 14, height: 2.5 }),
    condition: "new",
    binding: "hardcover",
    slug: "telugu-vyakaranam",
    metaTitle: "తెలుగు వ్యాకరణం - Education Book",
    metaDescription: "Complete Telugu grammar guide for students",
    rating: 4.2,
    reviewCount: 18,
    isActive: true
  },
  {
    $id: "mock-book-3",
    $createdAt: "2024-01-03T00:00:00.000Z",
    $updatedAt: "2024-01-03T00:00:00.000Z",
    title: "ఆంధ్ర మహాభారతం",
    titleTelugu: "ఆంధ్ర మహాభారతం",
    author: "Nannaya, Tikkana, Yerrapragada",
    authorTelugu: "నన్నయ, తిక్కన, ఎర్రప్రగడ",
    publisher: "Classical Publications",
    publisherTelugu: "క్లాసికల్ పబ్లికేషన్స్",
    isbn: "978-81-123456-00-3",
    price: 850,
    originalPrice: 1000,
    discount: 15,
    description: "The complete Telugu Mahabharata",
    descriptionTelugu: "సంపూర్ణ తెలుగు మహాభారతం",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400"
    ]),
    category: "Classical",
    categoryTelugu: "శాస్త్రీయ",
    pages: 1200,
    language: "Telugu",
    inStock: true,
    stock: 15,
    isFeatured: true,
    isBestseller: false,
    tags: JSON.stringify(["classical", "epic", "literature"]),
    publishedYear: 2022,
    weight: 1.2,
    dimensions: JSON.stringify({ length: 25, width: 18, height: 5 }),
    condition: "new",
    binding: "hardcover",
    slug: "andhra-mahabharatam",
    metaTitle: "ఆంధ్ర మహాభారతం - Classical Literature",
    metaDescription: "The complete Telugu Mahabharata epic",
    rating: 4.8,
    reviewCount: 45,
    isActive: true
  }
];

export const mockOrders = [
  {
    $id: "mock-order-1",
    $createdAt: "2024-12-01T10:30:00.000Z",
    $updatedAt: "2024-12-05T11:30:00.000Z",
    orderNumber: "ATK-2024-001",
    userId: "user-1",
    status: "delivered",
    totalAmount: 820,
    subtotal: 700,
    shippingCost: 50,
    taxAmount: 70,
    discountAmount: 0,
    items: JSON.stringify([
      {
        bookId: "mock-book-1",
        title: "గీతా రహస్యం",
        price: 350,
        quantity: 2,
        subtotal: 700
      }
    ]),
    shippingAddress: JSON.stringify({
      fullName: "Ramesh Kumar",
      phone: "+91 98765 43210",
      email: "ramesh@example.com",
      street: "123 Main Street, Jubilee Hills",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500033",
      country: "India"
    }),
    billingAddress: JSON.stringify({
      fullName: "Ramesh Kumar",
      phone: "+91 98765 43210",
      email: "ramesh@example.com",
      street: "123 Main Street, Jubilee Hills",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500033",
      country: "India"
    }),
    payment: JSON.stringify({
      method: "razorpay",
      status: "success",
      razorpayOrderId: "order_mock123",
      razorpayPaymentId: "pay_mock456",
      amount: 820
    }),
    delivery: JSON.stringify({
      trackingNumber: "AWB123456789",
      courierPartner: "Delhivery",
      status: "delivered",
      pickupDate: "2024-12-01T15:00:00Z",
      deliveryDate: "2024-12-05T11:30:00Z",
      estimatedDelivery: "2024-12-05T23:59:59Z",
      weight: 0.8,
      dimensions: { length: 22, width: 14, height: 4 },
      shippingCost: 50,
      trackingEvents: [
        {
          status: "Order Placed",
          location: "Hyderabad",
          timestamp: "2024-12-01T10:30:00Z",
          description: "Order confirmed and ready for pickup"
        },
        {
          status: "Picked Up",
          location: "Hyderabad Hub",
          timestamp: "2024-12-01T15:00:00Z",
          description: "Package picked up from seller"
        },
        {
          status: "Delivered",
          location: "Jubilee Hills",
          timestamp: "2024-12-05T11:30:00Z",
          description: "Package delivered successfully"
        }
      ]
    }),
    notes: "",
    adminNotes: "",
    isActive: true
  },
  {
    $id: "mock-order-2",
    $createdAt: "2024-12-03T14:20:00.000Z",
    $updatedAt: "2024-12-10T08:00:00.000Z",
    orderNumber: "ATK-2024-002",
    userId: "user-2",
    status: "in_transit",
    totalAmount: 330,
    subtotal: 280,
    shippingCost: 0,
    taxAmount: 50,
    discountAmount: 0,
    items: JSON.stringify([
      {
        bookId: "mock-book-2",
        title: "తెలుగు వ్యాకరణం",
        price: 280,
        quantity: 1,
        subtotal: 280
      }
    ]),
    shippingAddress: JSON.stringify({
      fullName: "Priya Sharma",
      phone: "+91 87654 32109",
      email: "priya@example.com",
      street: "456 Park Road, Banjara Hills",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500034",
      country: "India"
    }),
    billingAddress: JSON.stringify({
      fullName: "Priya Sharma",
      phone: "+91 87654 32109",
      email: "priya@example.com",
      street: "456 Park Road, Banjara Hills",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500034",
      country: "India"
    }),
    payment: JSON.stringify({
      method: "prepaid",
      status: "success",
      razorpayOrderId: "order_mock789",
      razorpayPaymentId: "pay_mock012",
      amount: 330
    }),
    delivery: JSON.stringify({
      trackingNumber: "AWB987654321",
      courierPartner: "Blue Dart",
      status: "out_for_delivery",
      pickupDate: "2024-12-03T18:00:00Z",
      estimatedDelivery: "2024-12-10T23:59:59Z",
      weight: 0.4,
      dimensions: { length: 20, width: 13, height: 2 },
      shippingCost: 0,
      trackingEvents: [
        {
          status: "Order Placed",
          location: "Hyderabad",
          timestamp: "2024-12-03T14:20:00Z",
          description: "Order confirmed and ready for pickup"
        },
        {
          status: "Out for Delivery",
          location: "Banjara Hills",
          timestamp: "2024-12-10T08:00:00Z",
          description: "Package out for delivery"
        }
      ]
    }),
    notes: "",
    adminNotes: "",
    isActive: true
  }
];

export const mockSettings = [
  {
    $id: "setting-1",
    $createdAt: "2024-01-01T00:00:00.000Z",
    $updatedAt: "2024-01-01T00:00:00.000Z",
    key: "shipping",
    value: JSON.stringify({
      defaultCourier: "Delhivery",
      freeShippingThreshold: 500,
      codCharges: 50,
      shiprocketApiKey: "",
      delhiveryApiKey: "",
      autoSync: true,
      enableTracking: true
    }),
    type: "json"
  }
];

// Mock service to simulate database operations
export const MockDataService = {
  books: mockBooks,
  orders: mockOrders,
  settings: mockSettings,

  // Simulate network delay
  async delay(ms: number = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  async getBooks(filters: any = {}) {
    await this.delay();
    let result = [...this.books];
    
    if (filters.category) {
      result = result.filter(book => book.category === filters.category);
    }
    
    if (filters.search) {
      result = result.filter(book => 
        book.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        book.author.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.featured) {
      result = result.filter(book => book.isFeatured);
    }
    
    if (filters.bestseller) {
      result = result.filter(book => book.isBestseller);
    }
    
    if (filters.limit) {
      result = result.slice(0, filters.limit);
    }
    
    return result;
  },

  async getBook(id: string) {
    await this.delay();
    return this.books.find(book => book.$id === id) || null;
  },

  async createBook(bookData: any) {
    await this.delay();
    const newBook = {
      $id: `mock-book-${Date.now()}`,
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      ...bookData
    };
    this.books.push(newBook);
    return newBook;
  },

  async updateBook(id: string, bookData: any) {
    await this.delay();
    const index = this.books.findIndex(book => book.$id === id);
    if (index !== -1) {
      this.books[index] = {
        ...this.books[index],
        ...bookData,
        $updatedAt: new Date().toISOString()
      };
      return this.books[index];
    }
    throw new Error("Book not found");
  },

  async deleteBook(id: string) {
    await this.delay();
    const index = this.books.findIndex(book => book.$id === id);
    if (index !== -1) {
      this.books.splice(index, 1);
    }
  },

  async getAllOrders(filters: any = {}) {
    await this.delay();
    let result = [...this.orders];
    
    if (filters.status) {
      result = result.filter(order => order.status === filters.status);
    }
    
    if (filters.limit) {
      result = result.slice(0, filters.limit);
    }
    
    return result;
  },

  async getSettings() {
    await this.delay();
    return this.settings;
  },

  async getSetting(key: string) {
    await this.delay();
    return this.settings.find(setting => setting.key === key) || null;
  },

  async updateSetting(key: string, value: string, type: string = "string") {
    await this.delay();
    const index = this.settings.findIndex(setting => setting.key === key);
    if (index !== -1) {
      this.settings[index] = {
        ...this.settings[index],
        value,
        type,
        $updatedAt: new Date().toISOString()
      };
      return this.settings[index];
    } else {
      const newSetting = {
        $id: `setting-${Date.now()}`,
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
        key,
        value,
        type
      };
      this.settings.push(newSetting);
      return newSetting;
    }
  }
};
