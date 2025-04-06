"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function StatsPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    summaryCards: {},
    revenueData: [],
    topProducts: [],
    categoryBreakdown: [],
    recentOrders: []
  });
  const [timeRange, setTimeRange] = useState("week");

  useEffect(() => {
    const checkAdminAndFetchStats = async () => {
      try {
        const response = await fetch('/api/admins/check');
        const data = await response.json();
        
        if (data.isAdmin) {
          setIsAdmin(true);
          fetchStats(timeRange);
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setLoading(false);
      }
    };

    if (currentUser) {
      checkAdminAndFetchStats();
    } else {
      router.push('/login');
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchStats(timeRange);
    }
  }, [timeRange, isAdmin]);

  const fetchStats = async (range) => {
    try {
      // In a production app, you'd fetch from an API endpoint with the range as a parameter
      // For now, we'll use mock data
      setLoading(true);
      setTimeout(() => {
        // Generate mock data based on the time range
        const mockData = generateMockData(range);
        setStats(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setLoading(false);
    }
  };

  const generateMockData = (range) => {
    // This function would generate different mock data based on the time range
    // For simplicity, we'll return the same structure with different values

    // Generate revenue data points based on the range
    const revenueData = [];
    let days = 7;
    let multiplier = 1;
    
    switch(range) {
      case "week":
        days = 7;
        multiplier = 1;
        break;
      case "month":
        days = 30;
        multiplier = 0.8;
        break;
      case "year":
        days = 12; // Months in this case
        multiplier = 5;
        break;
    }
    
    for (let i = 0; i < days; i++) {
      const value = Math.floor(Math.random() * 5000 * multiplier) + 1000;
      
      if (range === "year") {
        // For yearly data, use month names
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        revenueData.push({
          label: monthNames[i],
          value
        });
      } else {
        // For weekly or monthly data, use day numbers
        revenueData.push({
          label: `Day ${i + 1}`,
          value
        });
      }
    }
    
    // Calculate some summary metrics
    const totalRevenue = revenueData.reduce((sum, item) => sum + item.value, 0);
    const orderCount = Math.floor(totalRevenue / 120); // Average order value of $120
    const averageOrderValue = (totalRevenue / orderCount).toFixed(2);
    const conversionRate = (Math.random() * 5 + 2).toFixed(2); // Random between 2% and 7%
    
    return {
      summaryCards: {
        totalRevenue,
        orderCount,
        averageOrderValue,
        conversionRate
      },
      revenueData,
      topProducts: [
        { 
          id: "prod1", 
          name: "Wireless Earbuds", 
          sales: Math.floor(Math.random() * 200) + 50, 
          revenue: Math.floor(Math.random() * 10000) + 5000,
          image: "https://placehold.co/100x100?text=Earbuds"
        },
        { 
          id: "prod2", 
          name: "Smart Watch", 
          sales: Math.floor(Math.random() * 150) + 40, 
          revenue: Math.floor(Math.random() * 12000) + 8000,
          image: "https://placehold.co/100x100?text=Watch"
        },
        { 
          id: "prod3", 
          name: "Bluetooth Speaker", 
          sales: Math.floor(Math.random() * 100) + 30, 
          revenue: Math.floor(Math.random() * 8000) + 4000,
          image: "https://placehold.co/100x100?text=Speaker"
        },
        { 
          id: "prod4", 
          name: "Smartphone", 
          sales: Math.floor(Math.random() * 80) + 20, 
          revenue: Math.floor(Math.random() * 70000) + 30000,
          image: "https://placehold.co/100x100?text=Phone"
        },
        { 
          id: "prod5", 
          name: "Laptop", 
          sales: Math.floor(Math.random() * 50) + 10, 
          revenue: Math.floor(Math.random() * 50000) + 20000,
          image: "https://placehold.co/100x100?text=Laptop"
        }
      ],
      categoryBreakdown: [
        { category: "Audio", percentage: Math.floor(Math.random() * 30) + 20 },
        { category: "Wearables", percentage: Math.floor(Math.random() * 20) + 15 },
        { category: "Phones", percentage: Math.floor(Math.random() * 25) + 10 },
        { category: "Computers", percentage: Math.floor(Math.random() * 20) + 5 },
        { category: "Accessories", percentage: Math.floor(Math.random() * 15) + 5 }
      ],
      recentOrders: [
        { 
          id: "ORD123456", 
          customer: "John Smith", 
          email: "john@example.com",
          amount: 329.98, 
          status: "Delivered", 
          date: "2023-11-15" 
        },
        { 
          id: "ORD789012", 
          customer: "Emily Johnson", 
          email: "emily@example.com",
          amount: 79.99, 
          status: "Delivered", 
          date: "2023-11-14" 
        },
        { 
          id: "ORD345678", 
          customer: "Michael Brown", 
          email: "michael@example.com",
          amount: 1299.99, 
          status: "Processing", 
          date: "2023-11-13" 
        },
        { 
          id: "ORD901234", 
          customer: "Sarah Wilson", 
          email: "sarah@example.com",
          amount: 149.99, 
          status: "Shipped", 
          date: "2023-11-12" 
        },
        { 
          id: "ORD567890", 
          customer: "David Miller", 
          email: "david@example.com",
          amount: 599.99, 
          status: "Processing", 
          date: "2023-11-11" 
        }
      ]
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Find the maximum value in revenue data for scaling the chart
  const maxRevenueValue = stats.revenueData.length > 0 
    ? Math.max(...stats.revenueData.map(item => item.value)) 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
            <p className="mb-6 text-gray-600">You don't have permission to access this page. Please contact an administrator.</p>
            <Link href="/dashboard" className="btn btn-primary">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="text-gray-600">Comprehensive analytics and sales statistics.</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 text-sm">Time Range:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-indigo-100 p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
              <h3 className="text-xl font-bold text-gray-900">{formatCurrency(stats.summaryCards.totalRevenue)}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Orders</p>
              <h3 className="text-xl font-bold text-gray-900">{stats.summaryCards.orderCount}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Average Order Value</p>
              <h3 className="text-xl font-bold text-gray-900">{formatCurrency(stats.summaryCards.averageOrderValue)}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Conversion Rate</p>
              <h3 className="text-xl font-bold text-gray-900">{stats.summaryCards.conversionRate}%</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h2>
          <div className="h-80">
            <div className="flex h-64 items-end space-x-2">
              {stats.revenueData.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-indigo-500 hover:bg-indigo-600 transition-all rounded-t-sm" 
                    style={{ 
                      height: `${(item.value / maxRevenueValue) * 100}%`,
                      minHeight: '1%'
                    }}
                  >
                    <div className="invisible group-hover:visible absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                      {formatCurrency(item.value)}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h2>
          <div className="space-y-4">
            {stats.categoryBreakdown.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  <span className="text-sm font-medium text-gray-700">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Units Sold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.topProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={product.image}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sales}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(product.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 