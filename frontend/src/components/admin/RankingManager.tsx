import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Award,
  TrendingUp,
  Eye,
  Heart,
  ShoppingCart,
  Star,
  Calendar,
  Download,
  Save,
  BarChart3,
} from "lucide-react";
import { mockBooks, categories } from "@/data/books";
import { Book } from "@/types/book";

interface RankingSettings {
  primaryBasis: string;
  secondaryBasis: string;
  updateFrequency: string;
  autoUpdate: boolean;
  displayFormat: string;
  maxRankDisplay: number;
  atakaRankingCount: number;
  showOnHomepage: boolean;
}

const rankingBasisOptions = [
  {
    id: "sales",
    name: "Sales",
    icon: TrendingUp,
    description: "Based on total book sales",
  },
  {
    id: "reviews",
    name: "Reviews",
    icon: Star,
    description: "Based on average review rating",
  },
  {
    id: "pageViews",
    name: "Page Views",
    icon: Eye,
    description: "Based on product page visits",
  },
  {
    id: "wishlist",
    name: "Wishlist Adds",
    icon: Heart,
    description: "Based on wishlist additions",
  },
  {
    id: "cartAdds",
    name: "Cart Additions",
    icon: ShoppingCart,
    description: "Based on add to cart actions",
  },
  {
    id: "rating",
    name: "Rating",
    icon: Star,
    description: "Based on average rating score",
  },
  {
    id: "newness",
    name: "Newness",
    icon: Calendar,
    description: "Based on publication/arrival date",
  },
];

export function RankingManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBasis, setSelectedBasis] = useState("all");
  const [isEditMode, setIsEditMode] = useState(false);
  const [books, setBooks] = useState(mockBooks);
  const [rankingSettings, setRankingSettings] = useState<RankingSettings>({
    primaryBasis: "sales",
    secondaryBasis: "reviews",
    updateFrequency: "daily",
    autoUpdate: true,
    displayFormat: "category",
    maxRankDisplay: 10,
    atakaRankingCount: 10,
    showOnHomepage: true,
  });

  // Filter books based on search and category
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      book.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesBasis =
      selectedBasis === "all" || book.rankingBasis === selectedBasis;
    return matchesSearch && matchesCategory && matchesBasis && book.atakaRank;
  });

  // Sort books by Ataka rank
  const sortedBooks = filteredBooks.sort(
    (a, b) => (a.atakaRank || 999) - (b.atakaRank || 999),
  );

  // Group books by category for category view
  const booksByCategory = books.reduce(
    (acc, book) => {
      if (book.atakaRank && book.category) {
        if (!acc[book.category]) {
          acc[book.category] = [];
        }
        acc[book.category].push(book);
      }
      return acc;
    },
    {} as Record<string, Book[]>,
  );

  // Sort each category by rank
  Object.keys(booksByCategory).forEach((category) => {
    booksByCategory[category].sort(
      (a, b) => (a.atakaRank || 999) - (b.atakaRank || 999),
    );
  });

  // Get top ranked books for overview
  const topRankedBooks = books
    .filter((book) => book.atakaRank)
    .sort((a, b) => (a.atakaRank || 999) - (b.atakaRank || 999))
    .slice(0, 10);

  const handleRankUpdate = (bookId: string, newRank: number) => {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === bookId ? { ...book, atakaRank: newRank } : book,
      ),
    );
  };

  const handleCategoryUpdate = (bookId: string, newCategory: string) => {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === bookId ? { ...book, category: newCategory } : book,
      ),
    );
  };

  const saveRankings = () => {
    console.log("Saving rankings...", books);
    // In real implementation, this would save to backend
  };

  const exportRankings = () => {
    const rankingData = filteredBooks.map((book) => ({
      title: book.title,
      author: book.author,
      category: book.category,
      rank: book.atakaRank,
      basis: book.atakaRankingBasis,
      sales: Math.floor(Math.random() * 1000),
      views: Math.floor(Math.random() * 5000),
      rating: book.rating,
    }));

    console.log("Exporting ranking data:", rankingData);
    // In real implementation, this would create and download a CSV/Excel file
  };

  const getRankingIcon = (basis: string) => {
    const option = rankingBasisOptions.find((opt) => opt.id === basis);
    return option ? option.icon : Award;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <BarChart3 className="w-6 h-6 mr-2" />
            Ataka Rankings Management
          </h2>
          <p className="text-gray-600 mt-1">
            Manage and configure book rankings for your store
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={exportRankings} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={saveRankings}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Ranked Books</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-600">
                  {books.filter((book) => book.atakaRank).length}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Out of {books.length} total books
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Avg. Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {(
                    topRankedBooks.reduce((sum, book) => sum + book.rating, 0) /
                    topRankedBooks.length
                  ).toFixed(1)}
                </div>
                <p className="text-sm text-gray-600 mt-1">Top 10 books</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {Object.keys(booksByCategory).length}
                </div>
                <p className="text-sm text-gray-600 mt-1">With ranked books</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Ranked Books */}
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Ataka Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topRankedBooks.map((book) => {
                  const Icon = getRankingIcon(
                    book.atakaRankingBasis || "sales",
                  );
                  return (
                    <div
                      key={book.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-orange-600">
                            #{book.atakaRank}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium">{book.title}</h4>
                          <p className="text-sm text-gray-600">
                            {book.author} • {book.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">
                          #{book.atakaRank} in Ataka
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rankings" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedBasis} onValueChange={setSelectedBasis}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Ranking Basis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Basis</SelectItem>
                {rankingBasisOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rankings Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Book</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Ranking Basis</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedBooks.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-orange-600">
                            #{book.atakaRank}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{book.title}</div>
                          <div className="text-sm text-gray-600">
                            {book.author}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{book.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {React.createElement(
                            getRankingIcon(book.atakaRankingBasis || "sales"),
                            { className: "w-4 h-4" },
                          )}
                          <span className="text-sm">
                            {rankingBasisOptions.find(
                              (opt) => opt.id === book.atakaRankingBasis,
                            )?.name || "Sales"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{book.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(booksByCategory).map(
              ([category, categoryBooks]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{category} Rankings</span>
                      <Badge variant="outline">
                        {categoryBooks.length} books
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {categoryBooks.slice(0, 5).map((book) => {
                        const Icon = getRankingIcon(
                          book.atakaRankingBasis || "sales",
                        );
                        return (
                          <div
                            key={book.id}
                            className="flex items-center space-x-3 p-2 border rounded"
                          >
                            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-orange-600">
                                #{book.atakaRank}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">
                                {book.title}
                              </div>
                              <div className="text-xs text-gray-600">
                                {book.author}
                              </div>
                            </div>
                            <Icon className="w-4 h-4 text-gray-400" />
                          </div>
                        );
                      })}
                      {categoryBooks.length > 5 && (
                        <p className="text-xs text-gray-500 text-center">
                          +{categoryBooks.length - 5} more books
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ),
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ranking Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-update">Auto Update Rankings</Label>
                  <Switch
                    id="auto-update"
                    checked={rankingSettings.autoUpdate}
                    onCheckedChange={(checked) =>
                      setRankingSettings({
                        ...rankingSettings,
                        autoUpdate: checked,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primary-basis">Primary Ranking Basis</Label>
                  <Select
                    value={rankingSettings.primaryBasis}
                    onValueChange={(value) =>
                      setRankingSettings({
                        ...rankingSettings,
                        primaryBasis: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {rankingBasisOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-rank">Maximum Rank to Display</Label>
                  <Input
                    id="max-rank"
                    type="number"
                    min="1"
                    max="100"
                    value={rankingSettings.maxRankDisplay}
                    onChange={(e) =>
                      setRankingSettings({
                        ...rankingSettings,
                        maxRankDisplay: parseInt(e.target.value) || 10,
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Homepage Ataka Rankings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-homepage">Show on Homepage</Label>
                  <Switch
                    id="show-homepage"
                    checked={rankingSettings.showOnHomepage}
                    onCheckedChange={(checked) =>
                      setRankingSettings({
                        ...rankingSettings,
                        showOnHomepage: checked,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ataka-count">
                    Number of Ataka Rankings to Display
                  </Label>
                  <Input
                    id="ataka-count"
                    type="number"
                    min="5"
                    max="20"
                    value={rankingSettings.atakaRankingCount}
                    onChange={(e) =>
                      setRankingSettings({
                        ...rankingSettings,
                        atakaRankingCount: parseInt(e.target.value) || 10,
                      })
                    }
                  />
                  <p className="text-xs text-gray-600">
                    Controls how many top Ataka ranked books appear in the
                    homepage rankings section
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-800 mb-2">
                    Current Settings:
                  </h4>
                  <p className="text-sm text-orange-700">
                    Homepage will show top {rankingSettings.atakaRankingCount}{" "}
                    Ataka ranked books
                  </p>
                  <p className="text-sm text-orange-700">
                    Status:{" "}
                    {rankingSettings.showOnHomepage ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
