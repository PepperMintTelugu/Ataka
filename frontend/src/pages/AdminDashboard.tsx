import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  BookOpen,
  DollarSign,
  Package,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building2,
  PenTool,
  Download,
  Calendar
} from "lucide-react";

interface DashboardData {
  overview: {
    totalRevenue: number;
    monthlyRevenue: number;
    totalOrders: number;
    monthlyOrders: number;
    avgOrderValue: number;
    totalCustomers: number;
    newCustomers: number;
    returnCustomers: number;
    totalBooks: number;
    totalAuthors: number;
    totalPublishers: number;
    conversionRate: number;
    cartAbandonmentRate: number;
  };
  revenueChart: Array<{
    month: string;
    revenue: number;
    orders: number;
    customers: number;
    avgOrderValue: number;
  }>;
  topCategories: Array<{
    name: string;
    sales: number;
    orders: number;
    growth: number;
  }>;
  topAuthors: Array<{
    name: string;
    revenue: number;
    books: number;
    orders: number;
  }>;
  topPublishers: Array<{
    name: string;
    revenue: number;
    commission: number;
    books: number;
  }>;
  recentActivity: Array<{
    date: string;
    revenue: number;
    orders: number;
    visitors: number;
    conversions: number;
  }>;
  alerts: Array<{
    type: string;
    message: string;
    priority: string;
  }>;
}

// Simple animated counter component
const AnimatedCounter: React.FC<{ end: number; duration?: number; prefix?: string; suffix?: string; decimals?: number }> = ({ 
  end, 
  duration = 2000, 
  prefix = "", 
  suffix = "", 
  decimals = 0 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <span>
      {prefix}{decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}{suffix}
    </span>
  );
};

// Simple bar chart component
const SimpleBarChart: React.FC<{ data: Array<{label: string; value: number; color?: string}> }> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="w-20 text-sm font-medium">{item.label}</div>
          <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
            <div 
              className={`h-4 rounded-full ${item.color || 'bg-blue-500'} transition-all duration-1000 ease-out`}
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
          <div className="w-16 text-sm text-gray-600 text-right">
            {item.value.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

// Simple line chart component
const SimpleLineChart: React.FC<{ data: Array<{label: string; value: number}> }> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  
  return (
    <div className="h-40 flex items-end space-x-2 border-b border-l border-gray-200 p-4">
      {data.map((item, index) => {
        const height = ((item.value - minValue) / range) * 120 + 20;
        return (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t transition-all duration-1000 ease-out"
              style={{ height: `${height}px` }}
            />
            <div className="text-xs text-gray-600 mt-2">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // Mock data for charts and analytics
      const mockData: DashboardData = {
        overview: {
          totalRevenue: 2850000,
          monthlyRevenue: 235000,
          totalOrders: 15420,
          monthlyOrders: 1285,
          avgOrderValue: 185,
          totalCustomers: 8750,
          newCustomers: 450,
          returnCustomers: 835,
          totalBooks: 12500,
          totalAuthors: 450,
          totalPublishers: 125,
          conversionRate: 3.2,
          cartAbandonmentRate: 68.5
        },
        revenueChart: [
          { month: 'Jul', revenue: 180000, orders: 980, customers: 520, avgOrderValue: 184 },
          { month: 'Aug', revenue: 195000, orders: 1050, customers: 580, avgOrderValue: 186 },
          { month: 'Sep', revenue: 210000, orders: 1150, customers: 620, avgOrderValue: 183 },
          { month: 'Oct', revenue: 225000, orders: 1200, customers: 680, avgOrderValue: 188 },
          { month: 'Nov', revenue: 240000, orders: 1300, customers: 720, avgOrderValue: 185 },
          { month: 'Dec', revenue: 235000, orders: 1285, customers: 750, avgOrderValue: 183 }
        ],
        topCategories: [
          { name: "Literature", sales: 450000, orders: 2100, growth: 15.2 },
          { name: "Poetry", sales: 320000, orders: 1850, growth: 8.7 },
          { name: "Fiction", sales: 285000, orders: 1650, growth: 22.1 },
          { name: "Educational", sales: 210000, orders: 980, growth: -3.2 },
          { name: "Children", sales: 180000, orders: 1200, growth: 18.5 }
        ],
        topAuthors: [
          { name: "Viswanatha Satyanarayana", revenue: 125000, books: 45, orders: 580 },
          { name: "Yandamuri Veerendranath", revenue: 89000, books: 52, orders: 420 },
          { name: "Sri Sri", revenue: 67000, books: 30, orders: 350 },
          { name: "Volga", revenue: 54000, books: 20, orders: 280 },
          { name: "Annamayya", revenue: 43000, books: 12, orders: 190 }
        ],
        topPublishers: [
          { name: "Vishwakarma Publications", revenue: 185000, commission: 27750, books: 1250 },
          { name: "Andhra Saraswata Parishad", revenue: 125000, commission: 15000, books: 1100 },
          { name: "Saraswati Pustakalayam", revenue: 98000, commission: 14700, books: 890 },
          { name: "Emesco Books", revenue: 76000, commission: 11400, books: 650 },
          { name: "Telugu University Press", revenue: 65000, commission: 9750, books: 580 }
        ],
        recentActivity: [
          { date: '2024-12-03', revenue: 8500, orders: 45, visitors: 320, conversions: 14 },
          { date: '2024-12-04', revenue: 9200, orders: 52, visitors: 380, conversions: 16 },
          { date: '2024-12-05', revenue: 7800, orders: 38, visitors: 290, conversions: 12 },
          { date: '2024-12-06', revenue: 10500, orders: 58, visitors: 420, conversions: 18 },
          { date: '2024-12-07', revenue: 11200, orders: 62, visitors: 450, conversions: 20 },
          { date: '2024-12-08', revenue: 9800, orders: 48, visitors: 380, conversions: 15 },
          { date: '2024-12-09', revenue: 12500, orders: 68, visitors: 520, conversions: 22 }
        ],
        alerts: [
          { type: "warning", message: "5 books are running low on stock", priority: "medium" },
          { type: "info", message: "New publisher application pending review", priority: "low" },
          { type: "success", message: "Monthly revenue target achieved", priority: "high" }
        ]
      };

      setDashboardData(mockData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const { overview, revenueChart, topCategories, topAuthors, topPublishers, recentActivity, alerts } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ataka Business Dashboard</h1>
              <p className="text-gray-600 mt-2">The Ultimate Bookstore Analytics & Management</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </Button>
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        {alerts.length > 0 && (
          <div className="mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-yellow-800">System Alerts</h3>
                  <div className="mt-1 text-sm text-yellow-700">
                    {alerts.map((alert, index) => (
                      <div key={index} className="flex items-center">
                        <span className="mr-2">•</span>
                        {alert.message}
                        <Badge variant={alert.priority === 'high' ? 'destructive' : alert.priority === 'medium' ? 'default' : 'secondary'} className="ml-2">
                          {alert.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overview Stats with Animated Counters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter end={overview.totalRevenue} prefix="₹" />
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+18.2% from last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter end={overview.totalOrders} />
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+12.5% from last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter end={overview.avgOrderValue} prefix="₹" />
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-sm text-red-600">-2.1% from last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter end={overview.totalCustomers} />
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+8.7% from last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <p className="text-2xl font-bold"><AnimatedCounter end={overview.totalBooks} /></p>
              <p className="text-sm text-gray-600">Total Books</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <PenTool className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold"><AnimatedCounter end={overview.totalAuthors} /></p>
              <p className="text-sm text-gray-600">Authors</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold"><AnimatedCounter end={overview.totalPublishers} /></p>
              <p className="text-sm text-gray-600">Publishers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <UserCheck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold"><AnimatedCounter end={overview.newCustomers} /></p>
              <p className="text-sm text-gray-600">New Customers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold"><AnimatedCounter end={overview.conversionRate} decimals={1} suffix="%" /></p>
              <p className="text-sm text-gray-600">Conversion Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold"><AnimatedCounter end={overview.cartAbandonmentRate} decimals={1} suffix="%" /></p>
              <p className="text-sm text-gray-600">Cart Abandonment</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="authors">Authors</TabsTrigger>
            <TabsTrigger value="publishers">Publishers</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <SimpleLineChart 
                    data={revenueChart.map(item => ({ label: item.month, value: item.revenue }))}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Average Order Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <SimpleBarChart 
                    data={revenueChart.map(item => ({ 
                      label: item.month, 
                      value: item.avgOrderValue,
                      color: 'bg-purple-500'
                    }))}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <SimpleBarChart 
                    data={revenueChart.map(item => ({ 
                      label: item.month, 
                      value: item.orders,
                      color: 'bg-green-500'
                    }))}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.slice(-4).map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">{activity.date}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span>Revenue: {formatCurrency(activity.revenue)}</span>
                          <span>Orders: {activity.orders}</span>
                          <span>Conversions: {activity.conversions}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Sales Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <SimpleBarChart 
                    data={topCategories.map((cat, index) => ({ 
                      label: cat.name, 
                      value: cat.sales,
                      color: `bg-${['blue', 'green', 'purple', 'orange', 'red'][index]}-500`
                    }))}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Growth Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topCategories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">{formatCurrency(category.sales)}</span>
                          <div className={`flex items-center ${category.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {category.growth >= 0 ? (
                              <TrendingUp className="w-4 h-4 mr-1" />
                            ) : (
                              <TrendingDown className="w-4 h-4 mr-1" />
                            )}
                            <span className="text-sm font-medium">{Math.abs(category.growth)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="authors">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Authors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Author</th>
                        <th className="text-left p-4">Revenue</th>
                        <th className="text-left p-4">Books</th>
                        <th className="text-left p-4">Orders</th>
                        <th className="text-left p-4">Avg per Book</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topAuthors.map((author, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                {author.name.charAt(0)}
                              </div>
                              <span className="font-medium">{author.name}</span>
                            </div>
                          </td>
                          <td className="p-4 font-semibold">{formatCurrency(author.revenue)}</td>
                          <td className="p-4">{author.books}</td>
                          <td className="p-4">{author.orders}</td>
                          <td className="p-4">{formatCurrency(Math.round(author.revenue / author.books))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="publishers">
            <Card>
              <CardHeader>
                <CardTitle>Publisher Revenue & Commission</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Publisher</th>
                        <th className="text-left p-4">Revenue</th>
                        <th className="text-left p-4">Commission</th>
                        <th className="text-left p-4">Books</th>
                        <th className="text-left p-4">Commission %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topPublishers.map((publisher, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <Building2 className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="font-medium">{publisher.name}</span>
                            </div>
                          </td>
                          <td className="p-4 font-semibold">{formatCurrency(publisher.revenue)}</td>
                          <td className="p-4 text-green-600 font-semibold">{formatCurrency(publisher.commission)}</td>
                          <td className="p-4">{publisher.books}</td>
                          <td className="p-4">
                            <Badge variant="secondary">
                              {Math.round((publisher.commission / publisher.revenue) * 100)}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">{activity.date}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span>Revenue: {formatCurrency(activity.revenue)}</span>
                          <span>Orders: {activity.orders}</span>
                          <span>Conversions: {activity.conversions}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Server Status</span>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-green-600">Online</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Database Status</span>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-green-600">Connected</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Payment Gateway</span>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-green-600">Active</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last Backup</span>
                      <span className="text-gray-600">2 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
