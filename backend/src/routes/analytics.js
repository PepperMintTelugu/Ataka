import express from "express";

const router = express.Router();

// Mock data for analytics (in production, this would come from database)
const generateMockData = () => {
  const currentYear = new Date().getFullYear();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return {
    // Overview Stats
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
    
    // Monthly Revenue Data
    monthlyRevenue: months.map((month, index) => ({
      month,
      revenue: Math.floor(Math.random() * 100000) + 150000,
      orders: Math.floor(Math.random() * 500) + 800,
      customers: Math.floor(Math.random() * 300) + 400,
      avgOrderValue: Math.floor(Math.random() * 50) + 150
    })),
    
    // Daily Data (Last 30 days)
    dailyData: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 15000) + 5000,
        orders: Math.floor(Math.random() * 50) + 20,
        visitors: Math.floor(Math.random() * 500) + 200,
        conversions: Math.floor(Math.random() * 20) + 5
      };
    }),
    
    // Top Performing Categories
    topCategories: [
      { name: "Literature", sales: 450000, orders: 2100, growth: 15.2 },
      { name: "Poetry", sales: 320000, orders: 1850, growth: 8.7 },
      { name: "Fiction", sales: 285000, orders: 1650, growth: 22.1 },
      { name: "Educational", sales: 210000, orders: 980, growth: -3.2 },
      { name: "Children", sales: 180000, orders: 1200, growth: 18.5 }
    ],
    
    // Top Authors by Revenue
    topAuthors: [
      { name: "Viswanatha Satyanarayana", revenue: 125000, books: 45, orders: 580 },
      { name: "Yandamuri Veerendranath", revenue: 89000, books: 52, orders: 420 },
      { name: "Sri Sri", revenue: 67000, books: 30, orders: 350 },
      { name: "Volga", revenue: 54000, books: 20, orders: 280 },
      { name: "Annamayya", revenue: 43000, books: 12, orders: 190 }
    ],
    
    // Top Publishers by Revenue
    topPublishers: [
      { name: "Vishwakarma Publications", revenue: 185000, commission: 27750, books: 1250 },
      { name: "Andhra Saraswata Parishad", revenue: 125000, commission: 15000, books: 1100 },
      { name: "Saraswati Pustakalayam", revenue: 98000, commission: 14700, books: 890 },
      { name: "Emesco Books", revenue: 76000, commission: 11400, books: 650 },
      { name: "Telugu University Press", revenue: 65000, commission: 9750, books: 580 }
    ],
    
    // Customer Analytics
    customerAnalytics: {
      ageGroups: [
        { group: "18-25", count: 1250, percentage: 14.3 },
        { group: "26-35", count: 2100, percentage: 24.0 },
        { group: "36-45", count: 2450, percentage: 28.0 },
        { group: "46-55", count: 1850, percentage: 21.1 },
        { group: "55+", count: 1100, percentage: 12.6 }
      ],
      locations: [
        { state: "Telangana", customers: 2800, revenue: 520000 },
        { state: "Andhra Pradesh", customers: 2200, revenue: 410000 },
        { state: "Karnataka", customers: 1100, revenue: 195000 },
        { state: "Tamil Nadu", customers: 850, revenue: 145000 },
        { state: "Maharashtra", customers: 750, revenue: 125000 }
      ]
    },
    
    // Inventory Analytics
    inventory: {
      totalBooks: 12500,
      inStock: 11200,
      lowStock: 950,
      outOfStock: 350,
      fastMoving: [
        { title: "Veyipadagalu", author: "Viswanatha Satyanarayana", stock: 45, dailySales: 12 },
        { title: "Tulasi Dalam", author: "Yandamuri", stock: 23, dailySales: 8 },
        { title: "Maha Prasthanam", author: "Sri Sri", stock: 67, dailySales: 6 }
      ],
      slowMoving: [
        { title: "Classical Poetry", author: "Various", stock: 120, dailySales: 0.5 },
        { title: "Ancient Literature", author: "Historical", stock: 85, dailySales: 0.3 }
      ]
    },
    
    // Financial Analytics
    financial: {
      grossRevenue: 2850000,
      netRevenue: 2565000,
      totalCosts: 1710000,
      grossProfit: 855000,
      grossProfitMargin: 30.0,
      publisherCommissions: 427500,
      operatingExpenses: 285000,
      marketingSpend: 125000,
      shippingCosts: 89000,
      paymentProcessingFees: 57000
    }
  };
};

// Get dashboard overview
router.get("/overview", (req, res) => {
  try {
    const data = generateMockData();
    
    res.json({
      success: true,
      data: data.overview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch overview analytics",
      error: error.message
    });
  }
});

// Get revenue analytics
router.get("/revenue", (req, res) => {
  try {
    const { period = "monthly" } = req.query;
    const data = generateMockData();
    
    let responseData;
    
    if (period === "daily") {
      responseData = {
        chartData: data.dailyData,
        summary: {
          totalRevenue: data.overview.totalRevenue,
          avgDailyRevenue: Math.round(data.overview.monthlyRevenue / 30),
          growth: 12.5
        }
      };
    } else {
      responseData = {
        chartData: data.monthlyRevenue,
        summary: {
          totalRevenue: data.overview.totalRevenue,
          avgMonthlyRevenue: data.overview.monthlyRevenue,
          growth: 18.3
        }
      };
    }
    
    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch revenue analytics",
      error: error.message
    });
  }
});

// Get orders analytics
router.get("/orders", (req, res) => {
  try {
    const data = generateMockData();
    
    res.json({
      success: true,
      data: {
        totalOrders: data.overview.totalOrders,
        monthlyOrders: data.overview.monthlyOrders,
        avgOrderValue: data.overview.avgOrderValue,
        chartData: data.monthlyRevenue.map(item => ({
          month: item.month,
          orders: item.orders,
          avgOrderValue: item.avgOrderValue
        })),
        orderStatus: {
          pending: 125,
          processing: 85,
          shipped: 45,
          delivered: 1030,
          cancelled: 15,
          returned: 8
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders analytics",
      error: error.message
    });
  }
});

// Get top performers
router.get("/top-performers", (req, res) => {
  try {
    const data = generateMockData();
    
    res.json({
      success: true,
      data: {
        categories: data.topCategories,
        authors: data.topAuthors,
        publishers: data.topPublishers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch top performers",
      error: error.message
    });
  }
});

// Get customer analytics
router.get("/customers", (req, res) => {
  try {
    const data = generateMockData();
    
    res.json({
      success: true,
      data: {
        totalCustomers: data.overview.totalCustomers,
        newCustomers: data.overview.newCustomers,
        returnCustomers: data.overview.returnCustomers,
        ageGroups: data.customerAnalytics.ageGroups,
        locations: data.customerAnalytics.locations,
        acquisitionChannels: [
          { channel: "Organic Search", customers: 3200, percentage: 36.6 },
          { channel: "Social Media", customers: 1850, percentage: 21.1 },
          { channel: "Direct", customers: 1650, percentage: 18.9 },
          { channel: "Email Marketing", customers: 980, percentage: 11.2 },
          { channel: "Paid Ads", customers: 1070, percentage: 12.2 }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer analytics",
      error: error.message
    });
  }
});

// Get inventory analytics
router.get("/inventory", (req, res) => {
  try {
    const data = generateMockData();
    
    res.json({
      success: true,
      data: data.inventory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory analytics",
      error: error.message
    });
  }
});

// Get financial analytics
router.get("/financial", (req, res) => {
  try {
    const data = generateMockData();
    
    res.json({
      success: true,
      data: data.financial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch financial analytics",
      error: error.message
    });
  }
});

// Get comprehensive dashboard data
router.get("/dashboard", (req, res) => {
  try {
    const data = generateMockData();
    
    res.json({
      success: true,
      data: {
        overview: data.overview,
        revenueChart: data.monthlyRevenue.slice(-6), // Last 6 months
        topCategories: data.topCategories.slice(0, 5),
        topAuthors: data.topAuthors.slice(0, 5),
        topPublishers: data.topPublishers.slice(0, 5),
        recentActivity: data.dailyData.slice(-7), // Last 7 days
        alerts: [
          { type: "warning", message: "5 books are running low on stock", priority: "medium" },
          { type: "info", message: "New publisher application pending review", priority: "low" },
          { type: "success", message: "Monthly revenue target achieved", priority: "high" }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard analytics",
      error: error.message
    });
  }
});

export default router;
