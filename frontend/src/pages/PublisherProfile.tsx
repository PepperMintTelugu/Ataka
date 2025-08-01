import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  BookOpen,
  Calendar,
  MapPin,
  Users,
  Building2,
  Share2,
  ArrowLeft,
  ShoppingCart,
  ExternalLink,
  TrendingUp,
  Award,
  Globe,
  Phone,
  Mail
} from "lucide-react";

interface Publisher {
  id: string;
  name: string;
  nameTelugu: string;
  logo: string;
  description: string;
  descriptionTelugu: string;
  foundedDate: string;
  headquarters: string;
  website: string;
  email: string;
  phone: string;
  totalBooks: number;
  totalAuthors: number;
  totalSales: number;
  avgRating: number;
  totalRatings: number;
  monthlyRevenue: number;
  commission: number;
  categories: string[];
  socialLinks: {
    website?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  achievements: string[];
}

interface Book {
  id: string;
  title: string;
  titleTelugu: string;
  author: string;
  authorTelugu: string;
  coverImage: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  description: string;
  publishedDate: string;
  category: string;
  pages: number;
  isbn: string;
  inStock: boolean;
}

const mockPublishers: Publisher[] = [
  {
    id: "1",
    name: "Vishwakarma Publications",
    nameTelugu: "విశ్వకర్మ పబ్లికేషన్స్",
    logo: "https://via.placeholder.com/200x200/6366f1/white?text=VP",
    description: "Vishwakarma Publications is one of the leading Telugu book publishers, dedicated to preserving and promoting Telugu literature. Established in 1952, we have been publishing quality Telugu books across various genres including literature, poetry, educational content, and devotional books.",
    descriptionTelugu: "విశ్వకర్మ పబ్లికేషన్స్ ప్రముఖ తెలుగు పుస్తక ప్రచురణకర్తలలో ఒకటి, తెలుగు సాహిత్యాన్ని సంరక్షించడానికి మరియు ప్రోత్సహించడానికి అంకితం. 1952లో స్థాపించబడిన మేము సాహిత్యం, కవిత్వం, విద్యా కంటెంట్ మరియు భక్తి పుస్తకాలతో సహా వివిధ శైలుల్లో నాణ్యమైన తెలుగు పుస్తకాలను ప్రచురిస్తున్నాము.",
    foundedDate: "1952-06-15",
    headquarters: "Hyderabad, Telangana",
    website: "https://vishwakarma-publications.com",
    email: "info@vishwakarma-publications.com",
    phone: "+91-40-2345-6789",
    totalBooks: 1250,
    totalAuthors: 285,
    totalSales: 185000,
    avgRating: 4.6,
    totalRatings: 8940,
    monthlyRevenue: 45000,
    commission: 27750,
    categories: ["Literature", "Poetry", "Educational", "Devotional", "History"],
    socialLinks: {
      website: "https://vishwakarma-publications.com",
      facebook: "https://facebook.com/vishwakarma-publications",
      twitter: "https://twitter.com/vishwakarma_pub"
    },
    achievements: [
      "Sahitya Akademi Publisher Award 2018",
      "Best Telugu Publisher 2020",
      "50+ Years of Literary Service",
      "1000+ Successful Publications"
    ]
  },
  {
    id: "2",
    name: "Andhra Saraswata Parishad",
    nameTelugu: "ఆంధ్ర సరస్వత పరిషత్",
    logo: "https://via.placeholder.com/200x200/8b5cf6/white?text=ASP",
    description: "Andhra Saraswata Parishad is a prestigious literary organization and publishing house committed to the advancement of Telugu language and literature. Founded in 1925, it has been instrumental in promoting Telugu cultural heritage.",
    descriptionTelugu: "ఆంధ్ర సరస్వత పరిషత్ తెలుగు భాష మరియు సాహిత్య అభివృద్ధికి కట్టుబడిన ప్రతిష్ఠాత్మక సాహిత్య సంస్థ మరియు ప్రచురణ సంస్థ. 1925లో స్థాపించబడిన ఇది తెలుగు సాంస్కృతిక వారసత్వాన్ని ప్రోత్సహించడంలో కీలక పాత్ర పోషించింది.",
    foundedDate: "1925-12-29",
    headquarters: "Vijayawada, Andhra Pradesh",
    website: "https://saraswataparishad.org",
    email: "contact@saraswataparishad.org",
    phone: "+91-866-123-4567",
    totalBooks: 1100,
    totalAuthors: 220,
    totalSales: 125000,
    avgRating: 4.7,
    totalRatings: 6750,
    monthlyRevenue: 35000,
    commission: 15000,
    categories: ["Literature", "Poetry", "Cultural Studies", "Historical", "Philosophy"],
    socialLinks: {
      website: "https://saraswataparishad.org"
    },
    achievements: [
      "Padma Shri Organization Award",
      "95+ Years of Cultural Service",
      "Pioneer in Telugu Literature",
      "500+ Literary Publications"
    ]
  }
];

const mockBooksByPublisher: { [key: string]: Book[] } = {
  "1": [
    {
      id: "1",
      title: "Veyipadagalu",
      titleTelugu: "వేయిపడగలు",
      author: "Viswanatha Satyanarayana",
      authorTelugu: "విశ్వనాథ సత్యనారాయణ",
      coverImage: "https://via.placeholder.com/400x600/6366f1/white?text=వేయిపడగలు",
      price: 450,
      originalPrice: 500,
      rating: 4.8,
      reviewsCount: 156,
      description: "A masterpiece of Telugu literature by the renowned author Viswanatha Satyanarayana.",
      publishedDate: "1952-03-15",
      category: "Literature",
      pages: 824,
      isbn: "978-81-234-5678-9",
      inStock: true
    },
    {
      id: "6",
      title: "Telugu Vyakaranam",
      titleTelugu: "తెలుగు వ్యాకరణం",
      author: "C.P. Brown",
      authorTelugu: "సి.పి. బ్రౌన్",
      coverImage: "https://via.placeholder.com/400x600/10b981/white?text=తెలుగు+వ్యాకరణం",
      price: 350,
      originalPrice: 400,
      rating: 4.5,
      reviewsCount: 89,
      description: "Comprehensive Telugu grammar book for students and scholars.",
      publishedDate: "2020-01-15",
      category: "Educational",
      pages: 456,
      isbn: "978-81-234-5685-4",
      inStock: true
    }
  ],
  "2": [
    {
      id: "3",
      title: "Mahaprasthanam",
      titleTelugu: "మహాప్రస్థానం",
      author: "Sri Sri",
      authorTelugu: "శ్రీ శ్రీ",
      coverImage: "https://via.placeholder.com/400x600/ec4899/white?text=మహాప్రస్థానం",
      price: 275,
      originalPrice: 300,
      rating: 4.9,
      reviewsCount: 234,
      description: "Revolutionary poetry collection that changed the landscape of Telugu literature.",
      publishedDate: "1950-08-15",
      category: "Poetry",
      pages: 128,
      isbn: "978-81-234-5680-2",
      inStock: true
    }
  ]
};

export default function PublisherProfile() {
  const { id } = useParams<{ id: string }>();
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundPublisher = mockPublishers.find(p => p.id === id);
      setPublisher(foundPublisher || null);
      setBooks(mockBooksByPublisher[id] || []);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!publisher) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Publisher Not Found</h1>
          <Link to="/publishers">
            <Button>Browse All Publishers</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const yearsInBusiness = new Date().getFullYear() - new Date(publisher.foundedDate).getFullYear();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link to="/publishers" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Publishers
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Publisher Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <Avatar className="w-32 h-32 md:w-40 md:h-40">
                  <AvatarImage src={publisher.logo} alt={publisher.name} />
                  <AvatarFallback className="text-2xl">
                    <Building2 className="w-16 h-16" />
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{publisher.name}</h1>
                    <h2 className="text-2xl text-gray-600 telugu-text mb-4">{publisher.nameTelugu}</h2>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Publisher Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    </div>
                    <p className="text-2xl font-bold">{publisher.avgRating}</p>
                    <p className="text-sm text-gray-600">Avg Rating</p>
                    <p className="text-xs text-gray-500">({publisher.totalRatings.toLocaleString()} reviews)</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold">{publisher.totalBooks}</p>
                    <p className="text-sm text-gray-600">Books</p>
                    <p className="text-xs text-gray-500">{publisher.totalSales.toLocaleString()} sold</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold">{publisher.totalAuthors}</p>
                    <p className="text-sm text-gray-600">Authors</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold">₹{publisher.monthlyRevenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Monthly Revenue</p>
                  </div>
                </div>

                {/* Publisher Info */}
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Founded {formatDate(publisher.foundedDate)} ({yearsInBusiness} years)</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{publisher.headquarters}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Globe className="w-4 h-4 mr-2" />
                    <a href={publisher.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {publisher.website}
                    </a>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <a href={`mailto:${publisher.email}`} className="text-blue-600 hover:underline">
                      {publisher.email}
                    </a>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{publisher.phone}</span>
                  </div>
                  
                  {/* Categories */}
                  <div className="flex flex-wrap gap-2">
                    {publisher.categories.map((category, index) => (
                      <Badge key={index} variant="secondary">{category}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* About */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>About {publisher.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">{publisher.description}</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="telugu-text text-gray-700 leading-relaxed">{publisher.descriptionTelugu}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Business Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-600">Monthly Revenue:</span>
                      <span className="font-semibold text-green-700">₹{publisher.monthlyRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-gray-600">Commission Earned:</span>
                      <span className="font-semibold text-blue-700">₹{publisher.commission.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-gray-600">Commission Rate:</span>
                      <span className="font-semibold text-purple-700">
                        {Math.round((publisher.commission / publisher.monthlyRevenue) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-gray-600">Total Books Sold:</span>
                      <span className="font-semibold text-orange-700">{publisher.totalSales.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                      <span className="text-gray-600">Books in Catalog:</span>
                      <span className="font-semibold text-indigo-700">{publisher.totalBooks}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                      <span className="text-gray-600">Associated Authors:</span>
                      <span className="font-semibold text-pink-700">{publisher.totalAuthors}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Books */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Published Books</span>
                  <Badge variant="secondary">{books.length} books available</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {books.map((book) => (
                    <div key={book.id} className="flex space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <img 
                        src={book.coverImage}
                        alt={book.title}
                        className="w-20 h-28 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{book.title}</h3>
                        <p className="text-sm text-gray-600 telugu-text mb-1">{book.titleTelugu}</p>
                        <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                        
                        <div className="flex items-center mb-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                          <span className="text-sm font-medium">{book.rating}</span>
                          <span className="text-sm text-gray-500 ml-1">({book.reviewsCount})</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-lg">₹{book.price}</span>
                            {book.originalPrice > book.price && (
                              <span className="text-sm text-gray-500 line-through ml-2">₹{book.originalPrice}</span>
                            )}
                          </div>
                          <Button size="sm" className="flex items-center">
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            {/* Achievements */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {publisher.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center p-3 bg-yellow-50 rounded-lg">
                      <Award className="w-5 h-5 text-yellow-600 mr-3" />
                      <span className="text-sm font-medium">{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Publisher Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Books:</span>
                    <span className="font-semibold">{publisher.totalBooks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Books Sold:</span>
                    <span className="font-semibold">{publisher.totalSales.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Rating:</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="font-semibold">{publisher.avgRating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Reviews:</span>
                    <span className="font-semibold">{publisher.totalRatings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Authors:</span>
                    <span className="font-semibold">{publisher.totalAuthors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Years in Business:</span>
                    <span className="font-semibold">{yearsInBusiness}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Website</p>
                    <a href={publisher.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                      {publisher.website}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <a href={`mailto:${publisher.email}`} className="text-blue-600 hover:underline text-sm">
                      {publisher.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="text-sm">{publisher.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Address</p>
                    <p className="text-sm">{publisher.headquarters}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
