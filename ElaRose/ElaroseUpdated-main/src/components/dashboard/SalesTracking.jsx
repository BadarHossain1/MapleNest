import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, ShoppingCart, DollarSign, Package, Filter, Download, Loader } from 'lucide-react';

const SalesTracking = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const [orders, setOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [categoryPerformance, setCategoryPerformance] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    todayRevenue: 0,
    todayOrders: 0,
    todayItemsSold: 0,
    avgOrderValue: 0,
    yesterdayRevenue: 0,
    yesterdayOrders: 0,
    yesterdayItemsSold: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/orders?limit=1000`);
      const result = await response.json();

      if (result.success) {
        const ordersData = result.data;
        setOrders(ordersData);

        // Calculate dashboard stats
        const stats = calculateDashboardStats(ordersData);
        setDashboardStats(stats);

        // Generate sales trend data
        const salesTrend = generateSalesTrendData(ordersData);
        setSalesData(salesTrend);

        // Calculate category performance
        const categoryStats = calculateCategoryPerformance(ordersData);
        setCategoryPerformance(categoryStats);
      } else {
        setError('Failed to load sales data');
      }
    } catch (error) {
      console.error('Error fetching sales data:', error);
      setError('Failed to load sales data');
    } finally {
      setLoading(false);
    }
  };

  const calculateDashboardStats = (orders) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    const yesterdayEnd = new Date(yesterdayStart);
    yesterdayEnd.setDate(yesterdayEnd.getDate() + 1);

    const todayOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= todayStart && orderDate < todayEnd;
    });

    const yesterdayOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= yesterdayStart && orderDate < yesterdayEnd;
    });

    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.orderSummary.total, 0);
    const yesterdayRevenue = yesterdayOrders.reduce((sum, order) => sum + order.orderSummary.total, 0);

    const todayItemsSold = todayOrders.reduce((sum, order) =>
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

    const yesterdayItemsSold = yesterdayOrders.reduce((sum, order) =>
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

    const avgOrderValue = todayOrders.length > 0 ? todayRevenue / todayOrders.length : 0;

    return {
      todayRevenue,
      todayOrders: todayOrders.length,
      todayItemsSold,
      avgOrderValue,
      yesterdayRevenue,
      yesterdayOrders: yesterdayOrders.length,
      yesterdayItemsSold
    };
  };

  const generateSalesTrendData = (orders) => {
    const days = 7;
    const trendData = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= dayStart && orderDate < dayEnd;
      });

      const dayRevenue = dayOrders.reduce((sum, order) => sum + order.orderSummary.total, 0);
      const dayProducts = dayOrders.reduce((sum, order) =>
        sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

      trendData.push({
        date: dayStart.toISOString().split('T')[0],
        revenue: dayRevenue,
        orders: dayOrders.length,
        products: dayProducts
      });
    }

    return trendData;
  };

  const calculateCategoryPerformance = (orders) => {
    const categoryMap = new Map();

    // Get last 30 days for current period
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get 30-60 days ago for comparison
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const currentPeriodOrders = orders.filter(order => new Date(order.orderDate) >= thirtyDaysAgo);
    const previousPeriodOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo;
    });

    // Calculate current period stats
    currentPeriodOrders.forEach(order => {
      order.items.forEach(item => {
        const category = item.categoryName;
        const existing = categoryMap.get(category) || { sales: 0, revenue: 0 };
        categoryMap.set(category, {
          sales: existing.sales + item.quantity,
          revenue: existing.revenue + (item.price * item.quantity)
        });
      });
    });

    // Calculate previous period stats for growth comparison
    const previousCategoryMap = new Map();
    previousPeriodOrders.forEach(order => {
      order.items.forEach(item => {
        const category = item.categoryName;
        const existing = previousCategoryMap.get(category) || { sales: 0, revenue: 0 };
        previousCategoryMap.set(category, {
          sales: existing.sales + item.quantity,
          revenue: existing.revenue + (item.price * item.quantity)
        });
      });
    });

    const categoryStats = [];
    categoryMap.forEach((current, category) => {
      const previous = previousCategoryMap.get(category) || { sales: 0, revenue: 0 };
      const growth = previous.revenue > 0
        ? ((current.revenue - previous.revenue) / previous.revenue) * 100
        : current.revenue > 0 ? 100 : 0;

      categoryStats.push({
        category,
        sales: current.sales,
        revenue: current.revenue,
        growth: parseFloat(growth.toFixed(1))
      });
    });

    return categoryStats.sort((a, b) => b.revenue - a.revenue);
  };

  const getGrowthPercentage = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'shipped': return 'outline';
      case 'canceled': return 'destructive';
      default: return 'outline';
    }
  };

  const getChannelBadgeVariant = (channel) => {
    switch (channel) {
      case 'online': return 'default';
      case 'store': return 'secondary';
      default: return 'outline';
    }
  };

  const recentOrders = orders
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin mr-2" />
        <span>Loading sales data...</span>
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
      {/* Sales Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{dashboardStats.todayRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`${getGrowthPercentage(dashboardStats.todayRevenue, dashboardStats.yesterdayRevenue) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {getGrowthPercentage(dashboardStats.todayRevenue, dashboardStats.yesterdayRevenue) >= 0 ? '+' : ''}
                {getGrowthPercentage(dashboardStats.todayRevenue, dashboardStats.yesterdayRevenue).toFixed(1)}%
              </span> vs yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.todayOrders}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`${getGrowthPercentage(dashboardStats.todayOrders, dashboardStats.yesterdayOrders) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {getGrowthPercentage(dashboardStats.todayOrders, dashboardStats.yesterdayOrders) >= 0 ? '+' : ''}
                {getGrowthPercentage(dashboardStats.todayOrders, dashboardStats.yesterdayOrders).toFixed(1)}%
              </span> vs yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.todayItemsSold}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`${getGrowthPercentage(dashboardStats.todayItemsSold, dashboardStats.yesterdayItemsSold) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {getGrowthPercentage(dashboardStats.todayItemsSold, dashboardStats.yesterdayItemsSold) >= 0 ? '+' : ''}
                {getGrowthPercentage(dashboardStats.todayItemsSold, dashboardStats.yesterdayItemsSold).toFixed(1)}%
              </span> vs yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{dashboardStats.avgOrderValue.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-muted-foreground">Average per order</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Sales Trend</CardTitle>
                <CardDescription>Daily revenue over time</CardDescription>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">7 Days</SelectItem>
                  <SelectItem value="30days">30 Days</SelectItem>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  formatter={(value, name) => [
                    name === 'revenue' ? `৳${value}` : value,
                    name === 'revenue' ? 'Revenue' : 'Orders'
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>Revenue by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => [`৳${value}`, 'Revenue']} />
                <Bar
                  dataKey="revenue"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Category Analysis</CardTitle>
          <CardDescription>Detailed performance metrics by product category</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Units Sold</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Avg Price</TableHead>
                <TableHead>Growth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryPerformance.map((category) => (
                <TableRow key={category.category}>
                  <TableCell className="font-medium">{category.category}</TableCell>
                  <TableCell>{category.sales}</TableCell>
                  <TableCell>৳{category.revenue.toLocaleString()}</TableCell>
                  <TableCell>৳{Math.round(category.revenue / category.sales)}</TableCell>
                  <TableCell>
                    <span className={`flex items-center ${category.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <TrendingUp className={`h-3 w-3 mr-1 ${category.growth < 0 ? 'rotate-180' : ''}`} />
                      {Math.abs(category.growth)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders and their status</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No recent orders found
                  </TableCell>
                </TableRow>
              ) : (
                recentOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-mono">{order.orderId}</TableCell>
                    <TableCell className="font-medium">{order.shippingAddress.fullName}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.items.slice(0, 2).map(item => item.productName).join(', ')}
                        {order.items.length > 2 && ` +${order.items.length - 2} more`}
                      </div>
                    </TableCell>
                    <TableCell>৳{order.orderSummary.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getChannelBadgeVariant(order.channel)}>
                        {order.channel.charAt(0).toUpperCase() + order.channel.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesTracking;
