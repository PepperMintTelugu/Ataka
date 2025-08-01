import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  BookOpen,
  Award,
  Calendar,
  MapPin,
  Users,
  Heart,
  Share2,
  ArrowLeft,
  ShoppingCart,
  ExternalLink
} from "lucide-react";

interface Author {
  id: string;
  name: string;
  nameTelugu: string;
  image: string;
  bio: string;
  bioTelugu: string;
  birthDate: string;
  birthPlace: string;
  awards: string[];
  totalBooks: number;
  totalSales: number;
  avgRating: number;
  totalRatings: number;
  followers: number;
  genres: string[];
  socialLinks: {
    website?: string;
    twitter?: string;
    instagram?: string;
  };
}

interface Book {
  id: string;
  title: string;
  titleTelugu: string;
  coverImage: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  description: string;
  publishedDate: string;
  publisher: string;
  category: string;
  pages: number;
  isbn: string;
  inStock: boolean;
}

const mockAuthors: Author[] = [
  {
    id: "1",
    name: "Viswanatha Satyanarayana",
    nameTelugu: "విశ్వనాథ సత్యనారాయణ",
    image: "https://via.placeholder.com/400x400/6366f1/white?text=విశ్వనాథ+సత్యనారాయణ",
    bio: "Viswanatha Satyanarayana was one of the most celebrated writers in Telugu literature. He was a poet, novelist, critic, and playwright who made significant contributions to modern Telugu literature. He was awarded the Jnanpith Award in 1970 for his literary works.",
    bioTelugu: "విశ్వనాథ సత్యనారాయణ తెలుగు సాహిత్యంలో అత్యంత ప్రసిద్ధ రచయితలలో ఒకరు. అతను కవి, నవలా రచయిత, విమర్శకుడు మరియు నాటకకర్తగా ఆధునిక తెలుగు సాహిత్యానికి గణనీయమైన కృషిగా పనిచేశాడు. అతని సాహిత్య కృషికి 1970లో జ్ఞానపీఠ పురస్కారం లభించింది.",
    birthDate: "1895-05-13",
    birthPlace: "Vijayawada, Andhra Pradesh",
    awards: ["Jnanpith Award (1970)", "Sahitya Akademi Award", "Padma Bhushan"],
    totalBooks: 45,
    totalSales: 125000,
    avgRating: 4.8,
    totalRatings: 2340,
    followers: 15420,
    genres: ["Literature", "Poetry", "Devotional", "Historical Fiction"],
    socialLinks: {
      website: "https://viswanatha-satyanarayana.com",
    }
  },
  {
    id: "2", 
    name: "Sri Sri",
    nameTelugu: "శ్రీ శ్రీ",
    image: "https://via.placeholder.com/400x400/8b5cf6/white?text=శ్రీ+శ్రీ",
    bio: "Sri Sri (Srirangam Srinivasa Rao) was a revolutionary Telugu poet and lyricist who brought a new wave of progressive poetry to Telugu literature. His work 'Mahaprasthanam' is considered a landmark in modern Telugu poetry.",
    bioTelugu: "శ్రీ శ్రీ (శ్��ీరంగం శ్రీనివాస రావు) ఒక విప్లవాత్మక తెలుగు కవి మరియు గేయకర్త, అతను తెలుగు సాహిత్యానికి ప్రగతిశీల కవిత్వపు కొత్త అలను తెచ్చాడు. అతని 'మహాప్రస్థానం' ఆధునిక తెలుగు కవిత్వంలో ఒక మైలురాయిగా పరిగణించబడుతుంది.",
    birthDate: "1910-04-30",
    birthPlace: "Visakhapatnam, Andhra Pradesh",
    awards: ["Sahitya Akademi Award", "Soviet Land Nehru Award", "Kendra Sahitya Akademi Fellowship"],
    totalBooks: 30,
    totalSales: 89000,
    avgRating: 4.9,
    totalRatings: 1890,
    followers: 12350,
    genres: ["Poetry", "Progressive Literature", "Social Commentary"],
    socialLinks: {}
  }
];

const mockBooksByAuthor: { [key: string]: Book[] } = {
  "1": [
    {
      id: "1",
      title: "Veyipadagalu",
      titleTelugu: "వేయిపడగలు",
      coverImage: "https://via.placeholder.com/400x600/6366f1/white?text=వేయిపడగలు",
      price: 450,
      originalPrice: 500,
      rating: 4.8,
      reviewsCount: 156,
      description: "A masterpiece of Telugu literature by the renowned author Viswanatha Satyanarayana.",
      publishedDate: "1952-03-15",
      publisher: "Vishwakarma Publications",
      category: "Literature",
      pages: 824,
      isbn: "978-81-234-5678-9",
      inStock: true
    },
    {
      id: "5",
      title: "Ramayana Kalpavruksham",
      titleTelugu: "రామాయణ కల్పవృక్షం",
      coverImage: "https://via.placeholder.com/400x600/10b981/white?text=రామాయణ+కల్పవృక్షం",
      price: 650,
      originalPrice: 750,
      rating: 4.9,
      reviewsCount: 298,
      description: "An elaborate retelling of the Ramayana in beautiful Telugu verse.",
      publishedDate: "1957-10-02",
      publisher: "Telugu University Press",
      category: "Devotional",
      pages: 1248,
      isbn: "978-81-234-5682-6",
      inStock: true
    }
  ],
  "2": [
    {
      id: "3",
      title: "Mahaprasthanam",
      titleTelugu: "మహాప్రస్థానం",
      coverImage: "https://via.placeholder.com/400x600/ec4899/white?text=మహాప్రస్థానం",
      price: 275,
      originalPrice: 300,
      rating: 4.9,
      reviewsCount: 234,
      description: "Revolutionary poetry collection that changed the landscape of Telugu literature.",
      publishedDate: "1950-08-15",
      publisher: "Andhra Saraswata Parishad",
      category: "Poetry",
      pages: 128,
      isbn: "978-81-234-5680-2",
      inStock: true
    }
  ]
};

export default function AuthorProfile() {
  const { id } = useParams<{ id: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundAuthor = mockAuthors.find(a => a.id === id);
      setAuthor(foundAuthor || null);
      setBooks(mockBooksByAuthor[id] || []);
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

  if (!author) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Author Not Found</h1>
          <Link to="/authors">
            <Button>Browse All Authors</Button>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link to="/authors" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Authors
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Author Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <Avatar className="w-32 h-32 md:w-40 md:h-40">
                  <AvatarImage src={author.image} alt={author.name} />
                  <AvatarFallback className="text-2xl">{author.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{author.name}</h1>
                    <h2 className="text-2xl text-gray-600 telugu-text mb-4">{author.nameTelugu}</h2>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button
                      variant={isFollowing ? "outline" : "default"}
                      onClick={() => setIsFollowing(!isFollowing)}
                      className="flex items-center"
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-current text-red-500' : ''}`} />
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Author Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    </div>
                    <p className="text-2xl font-bold">{author.avgRating}</p>
                    <p className="text-sm text-gray-600">Avg Rating</p>
                    <p className="text-xs text-gray-500">({author.totalRatings.toLocaleString()} reviews)</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold">{author.totalBooks}</p>
                    <p className="text-sm text-gray-600">Books</p>
                    <p className="text-xs text-gray-500">{author.totalSales.toLocaleString()} sold</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold">{author.followers.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Followers</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Award className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold">{author.awards.length}</p>
                    <p className="text-sm text-gray-600">Awards</p>
                  </div>
                </div>

                {/* Author Info */}
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Born {formatDate(author.birthDate)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{author.birthPlace}</span>
                  </div>
                  
                  {/* Genres */}
                  <div className="flex flex-wrap gap-2">
                    {author.genres.map((genre, index) => (
                      <Badge key={index} variant="secondary">{genre}</Badge>
                    ))}
                  </div>
                  
                  {/* Social Links */}
                  {Object.keys(author.socialLinks).length > 0 && (
                    <div className="flex items-center space-x-3">
                      {author.socialLinks.website && (
                        <a 
                          href={author.socialLinks.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Biography */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Biography</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">{author.bio}</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="telugu-text text-gray-700 leading-relaxed">{author.bioTelugu}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Books */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Books by {author.name}</span>
                  <Badge variant="secondary">{books.length} books</Badge>
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
                        <p className="text-sm text-gray-600 telugu-text mb-2">{book.titleTelugu}</p>
                        
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
            {/* Awards */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Awards & Recognition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {author.awards.map((award, index) => (
                    <div key={index} className="flex items-center p-3 bg-yellow-50 rounded-lg">
                      <Award className="w-5 h-5 text-yellow-600 mr-3" />
                      <span className="text-sm font-medium">{award}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Author Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Books:</span>
                    <span className="font-semibold">{author.totalBooks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Books Sold:</span>
                    <span className="font-semibold">{author.totalSales.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Rating:</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="font-semibold">{author.avgRating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Reviews:</span>
                    <span className="font-semibold">{author.totalRatings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Followers:</span>
                    <span className="font-semibold">{author.followers.toLocaleString()}</span>
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
