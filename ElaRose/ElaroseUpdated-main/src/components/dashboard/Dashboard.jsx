"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, ShoppingCart, Package, DollarSign, AlertTriangle, Star, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalCustomers: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    monthlyRevenue: [],
    categoryDistribution: [],
    lowStockProducts: [],
    topCustomers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Color palette for charts with brand colors
  const colors = ['#f2c9c7', '#8B5446', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        console.log('Using API URL:', apiUrl);

        // Fetch all required data in parallel with proper query parameters
        const [ordersRes, usersRes, productsRes] = await Promise.all([
          fetch(`${apiUrl}/api/orders?limit=1000`), // Fetch more orders for accurate statistics
          fetch(`${apiUrl}/api/users?limit=1000`),  // Fetch more users for accurate counts
          fetch(`${apiUrl}/api/products?limit=1000`) // Fetch more products for stock analysis
        ]);

        // Check if all requests were successful
        if (!ordersRes.ok) {
          throw new Error(`Orders API error: ${ordersRes.status} ${ordersRes.statusText}`);
        }
        if (!usersRes.ok) {
          throw new Error(`Users API error: ${usersRes.status} ${usersRes.statusText}`);
        }
        if (!productsRes.ok) {
          throw new Error(`Products API error: ${productsRes.status} ${productsRes.statusText}`);
        }

        const [ordersData, usersData, productsData] = await Promise.all([
          ordersRes.json(),
          usersRes.json(),
          productsRes.json()
        ]);

        // Process orders data with proper error handling
        const orders = (ordersData?.success && Array.isArray(ordersData.data)) ? ordersData.data : [];
        const users = (usersData?.success && Array.isArray(usersData.data)) ? usersData.data : [];
        const products = (productsData?.success && Array.isArray(productsData.data)) ? productsData.data : [];

        console.log('Dashboard data fetched:', {
          ordersCount: orders.length,
          usersCount: users.length,
          productsCount: products.length,
          sampleOrder: orders[0],
          apiUrl
        });

        // Calculate total revenue from orderSummary.total
        const totalRevenue = orders.reduce((sum, order) => {
          return sum + (order.orderSummary?.total || 0);
        }, 0);

        // Calculate total customers (all users - could be filtered by role if needed)
        const totalCustomers = users.length;

        // Calculate total orders
        const totalOrders = orders.length;

        // Calculate average order value
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Calculate monthly revenue (last 6 months)
        const monthlyStats = calculateMonthlyStats(orders);

        // Calculate category distribution based on order items
        const categoryStats = calculateCategoryDistribution(orders);

        // Find low stock products - check if products have stock property or sizes with stock
        const lowStockProducts = products
          .filter((product) => {
            // Check if product has direct stock property
            if (product.stock !== undefined) {
              return product.stock < 15;
            }
            // Check if any size has low stock
            if (product.sizes && Array.isArray(product.sizes)) {
              return product.sizes.some((size) => size.stock < 15);
            }
            return false;
          })
          .sort((a, b) => {
            const stockA = a.stock !== undefined ? a.stock : Math.min(...a.sizes.map((s) => s.stock || 0));
            const stockB = b.stock !== undefined ? b.stock : Math.min(...b.sizes.map((s) => s.stock || 0));
            return stockA - stockB;
          })
          .slice(0, 10)
          .map((product) => {
            const minStock = product.stock !== undefined ?
              product.stock :
              Math.min(...product.sizes.map((s) => s.stock || 0));
            const lowStockSize = product.sizes?.find((s) => s.stock < 15);

            return {
              name: product.name,
              stock: minStock,
              variant: lowStockSize?.size || product.sizes?.[0]?.size || 'N/A'
            };
          });

        // Calculate top customers based on order data
        const topCustomers = calculateTopCustomers(orders, users);

        setDashboardData({
          totalRevenue,
          totalCustomers,
          totalOrders,
          avgOrderValue,
          monthlyRevenue: monthlyStats,
          categoryDistribution: categoryStats,
          lowStockProducts,
          topCustomers
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper function to calculate monthly stats
  const calculateMonthlyStats = (orders) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    const monthlyData = {};

    // Initialize last 6 months
    for (let i = 0; i < 6; i++) {
      const date = new Date(sixMonthsAgo);
      date.setMonth(date.getMonth() + i);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      monthlyData[monthKey] = { revenue: 0, orders: 0 };
    }

    // Process orders using correct field names from Order schema
    orders.forEach((order) => {
      const orderDate = new Date(order.orderDate || order.createdAt);
      if (orderDate >= sixMonthsAgo) {
        const monthKey = `${monthNames[orderDate.getMonth()]} ${orderDate.getFullYear()}`;
        if (monthlyData[monthKey]) {
          // Use orderSummary.total instead of totalAmount
          monthlyData[monthKey].revenue += order.orderSummary?.total || 0;
          monthlyData[monthKey].orders += 1;
        }
      }
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month: month.split(' ')[0], // Just month name
      revenue: Math.round(data.revenue),
      orders: data.orders
    }));
  };

  // Helper function to calculate category distribution based on actual sales
  const calculateCategoryDistribution = (orders) => {
    const categoryRevenue = {};
    let totalRevenue = 0;

    // Calculate revenue by category from actual order items
    orders.forEach((order) => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item) => {
          const categoryName = item.categoryName || 'Uncategorized';
          const itemRevenue = (item.price || 0) * (item.quantity || 1);
          categoryRevenue[categoryName] = (categoryRevenue[categoryName] || 0) + itemRevenue;
          totalRevenue += itemRevenue;
        });
      }
    });

    if (totalRevenue === 0) {
      return [{ name: 'No Sales Data', value: 100, color: colors[0] }];
    }

    // Convert to percentage and add colors
    return Object.entries(categoryRevenue)
      .map(([name, revenue], index) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' '),
        value: Math.round((revenue / totalRevenue) * 100),
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Top 6 categories by sales
  };

  // Helper function to calculate top customers
  const calculateTopCustomers = (orders, users) => {
    const customerStats = {};

    // Process orders to calculate customer stats using correct field names
    orders.forEach((order) => {
      const customerEmail = order.userEmail || order.email;
      if (customerEmail) {
        if (!customerStats[customerEmail]) {
          const user = users.find((u) => u.email === customerEmail);
          customerStats[customerEmail] = {
            totalSpent: 0,
            orderCount: 0,
            email: customerEmail,
            name: user?.fullName || order.shippingAddress?.fullName || 'Unknown Customer'
          };
        }
        // Use orderSummary.total instead of totalAmount
        customerStats[customerEmail].totalSpent += order.orderSummary?.total || 0;
        customerStats[customerEmail].orderCount += 1;
      }
    });

    // Sort by total spent and return top 5
    return Object.values(customerStats)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f2c9c7]"></div>
        <span className="ml-2">Loading dashboard data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-[#f2c9c7]/20 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-[#8B5446]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#8B5446]">
              ৳{dashboardData.totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              Revenue from {dashboardData.totalOrders} orders
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#f2c9c7]/20 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-[#8B5446]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#8B5446]">
              {dashboardData.totalCustomers.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Users className="h-3 w-3 text-[#f2c9c7] mr-1" />
              Active registered users
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#f2c9c7]/20 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-[#8B5446]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#8B5446]">
              {dashboardData.totalOrders.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ShoppingCart className="h-3 w-3 text-[#f2c9c7] mr-1" />
              Total orders placed
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#f2c9c7]/20 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-[#8B5446]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#8B5446]">
              ৳{Math.round(dashboardData.avgOrderValue).toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3 text-green-500 mr-1" />
              Average per order
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="border-[#f2c9c7]/20">
          <CardHeader>
            <CardTitle className="text-[#8B5446]">Monthly Revenue</CardTitle>
            <CardDescription>Revenue trend over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`৳${value}`, 'Revenue']} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f2c9c7"
                  strokeWidth={3}
                  dot={{ fill: '#8B5446', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="border-[#f2c9c7]/20">
          <CardHeader>
            <CardTitle className="text-[#8B5446]">Sales by Category</CardTitle>
            <CardDescription>Product category performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dashboardData.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {dashboardData.categoryDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <Card className="border-[#f2c9c7]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#8B5446]">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>Items requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.lowStockProducts.length > 0 ? (
                dashboardData.lowStockProducts.map((product, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${product.stock <= 5 ? 'bg-red-50' : product.stock <= 10 ? 'bg-orange-50' : 'bg-yellow-50'
                    }`}>
                    <div>
                      <div className="font-medium">{product.name} ({product.variant})</div>
                      <div className="text-sm text-muted-foreground">
                        {product.stock === 0 ? 'Out of stock' : `Only ${product.stock} left in stock`}
                      </div>
                    </div>
                    <Badge variant={
                      product.stock <= 5 ? "destructive" :
                        product.stock <= 10 ? "secondary" : "outline"
                    }>
                      {product.stock <= 5 ? 'Critical' : product.stock <= 10 ? 'Low' : 'Monitor'}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  All products are well stocked
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card className="border-[#f2c9c7]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#8B5446]">
              <Star className="h-5 w-5 text-[#f2c9c7]" />
              Top Customers
            </CardTitle>
            <CardDescription>Highest value customers this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.topCustomers.length > 0 ? (
                dashboardData.topCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {customer.orderCount} order{customer.orderCount !== 1 ? 's' : ''} • {customer.email}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-[#8B5446]">৳{customer.totalSpent.toLocaleString()}</div>
                      <div className="text-sm text-green-600">
                        ৳{Math.round(customer.totalSpent / customer.orderCount)} avg per order
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  No customer data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-[#f2c9c7]/20">
        <CardHeader>
          <CardTitle className="text-[#8B5446]">Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border border-[#f2c9c7]/30 rounded-lg text-center hover:bg-[#f2c9c7]/10 cursor-pointer transition-colors">
              <Package className="h-8 w-8 mx-auto mb-2 text-[#8B5446]" />
              <div className="font-medium text-[#8B5446]">Add Product</div>
            </div>
            <div className="p-4 border border-[#f2c9c7]/30 rounded-lg text-center hover:bg-[#f2c9c7]/10 cursor-pointer transition-colors">
              <Users className="h-8 w-8 mx-auto mb-2 text-[#8B5446]" />
              <div className="font-medium text-[#8B5446]">New Customer</div>
            </div>
            <div className="p-4 border border-[#f2c9c7]/30 rounded-lg text-center hover:bg-[#f2c9c7]/10 cursor-pointer transition-colors">
              <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-[#8B5446]" />
              <div className="font-medium text-[#8B5446]">Process Order</div>
            </div>
            <div className="p-4 border border-[#f2c9c7]/30 rounded-lg text-center hover:bg-[#f2c9c7]/10 cursor-pointer transition-colors">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-[#8B5446]" />
              <div className="font-medium text-[#8B5446]">Generate Report</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
