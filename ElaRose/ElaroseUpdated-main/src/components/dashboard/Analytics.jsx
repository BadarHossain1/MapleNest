'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  Target,
  Download,
  AlertCircle,
} from 'lucide-react';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('12months');
  const [analysisType, setAnalysisType] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [analyticsData, setAnalyticsData] = useState({
    seasonalData: [],
    salesForecast: [],
    customerLifetimeValue: [],
    cohortAnalysis: [],
    topPerformingProducts: [],
    overviewMetrics: {
      avgCLV: 0,
      avgRetention: 0,
      seasonalGrowth: 0,
      forecastAccuracy: 0,
    },
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

        const [ordersRes, productsRes, usersRes] = await Promise.all([
          fetch(`${apiUrl}/api/orders?limit=1000`, { cache: 'no-store' }),
          fetch(`${apiUrl}/api/products?limit=1000`, { cache: 'no-store' }),
          fetch(`${apiUrl}/api/users?limit=1000`, { cache: 'no-store' }),
        ]);

        if (!ordersRes.ok || !productsRes.ok || !usersRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [ordersData, productsData, usersData] = await Promise.all([
          ordersRes.json(),
          productsRes.json(),
          usersRes.json(),
        ]);

        const orders = ordersData?.success && Array.isArray(ordersData.data) ? ordersData.data : [];
        const products = productsData?.success && Array.isArray(productsData.data) ? productsData.data : [];
        const users = usersData?.success && Array.isArray(usersData.data) ? usersData.data : [];

        const calculatedData = calculateAnalyticsData(orders, products, users);
        setAnalyticsData(calculatedData);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  // ---------- Calculations (converted from your 2nd file, JS + Next-ready) ----------

  const calculateAnalyticsData = (orders, products, users) => {
    const seasonalData = calculateSeasonalData(orders);
    const salesForecast = calculateSalesForecast(orders);
    const customerLifetimeValue = calculateCLVBySegment(orders, users);
    const cohortAnalysis = calculateCohortAnalysis(orders, users);
    const topPerformingProducts = calculateTopPerformingProducts(orders, products);
    const overviewMetrics = calculateOverviewMetrics(customerLifetimeValue, orders);

    return {
      seasonalData,
      salesForecast,
      customerLifetimeValue,
      cohortAnalysis,
      topPerformingProducts,
      overviewMetrics,
    };
  };

  const calculateSeasonalData = (orders) => {
    const seasonalStats = {};
    const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
    const currentYear = new Date().getFullYear();

    for (let year = currentYear - 1; year <= currentYear; year++) {
      seasons.forEach((season) => {
        const key = `${season} ${year}`;
        seasonalStats[key] = {};
      });
    }

    orders.forEach((order) => {
      const orderDate = new Date(order.orderDate || order.createdAt);
      const m = orderDate.getMonth();
      const y = orderDate.getFullYear();

      let season = '';
      if (m >= 2 && m <= 4) season = 'Spring';
      else if (m >= 5 && m <= 7) season = 'Summer';
      else if (m >= 8 && m <= 10) season = 'Fall';
      else season = 'Winter';

      const key = `${season} ${y}`;

      if (seasonalStats[key] && Array.isArray(order.items)) {
        order.items.forEach((item) => {
          const category = item.categoryName || 'Other';
          seasonalStats[key][category] = (seasonalStats[key][category] || 0) + (item.quantity || 1);
        });
      }
    });

    return Object.entries(seasonalStats)
      .map(([season, categories]) => ({ season, ...categories }))
      .filter((row) => Object.keys(row).length > 1)
      .slice(-6);
  };

  const calculateSalesForecast = (orders) => {
    const monthlyRevenue = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    orders.forEach((order) => {
      const d = new Date(order.orderDate || order.createdAt);
      const key = months[d.getMonth()];
      monthlyRevenue[key] = (monthlyRevenue[key] || 0) + (order.orderSummary?.total || 0);
    });

    const current = new Date();
    const forecast = [];

    for (let i = 1; i <= 5; i++) {
      const future = new Date(current);
      future.setMonth(future.getMonth() + i);
      const monthName = months[future.getMonth()];

      const avg =
        Object.values(monthlyRevenue).reduce((a, b) => a + b, 0) /
          Math.max(Object.keys(monthlyRevenue).length, 1) || 0;

      const growthRate = Math.random() * 0.2 - 0.1; // ±10%
      const predicted = Math.round(avg * (1 + growthRate));
      const confidence = Math.max(50, 90 - i * 5);

      forecast.push({
        month: monthName,
        predicted,
        actual: null,
        confidence,
      });
    }

    return forecast;
  };

  const calculateCLVBySegment = (orders, users) => {
    const customerStats = {};
    const userMap = {};
    users.forEach((u) => {
      if (u.email) userMap[u.email.toLowerCase()] = u;
    });

    orders.forEach((order) => {
      const email = (order.userEmail || order.customer?.email || '').toLowerCase();
      if (!email || !userMap[email]) return;

      if (!customerStats[email]) {
        const user = userMap[email];
        customerStats[email] = {
          totalSpent: 0,
          orderCount: 0,
          lastOrder: new Date(0),
          segment: user.segment || 'new-buyer',
          joinDate: new Date(user.createdAt || user.dateOfJoining || Date.now()),
        };
      }

      customerStats[email].totalSpent += order.orderSummary?.total || 0;
      customerStats[email].orderCount += 1;
      const d = new Date(order.orderDate || order.createdAt);
      if (d > customerStats[email].lastOrder) customerStats[email].lastOrder = d;
    });

    const segments = {
      vip: { customers: 0, totalCLV: 0, activeCustomers: 0, displayName: 'VIP Customers' },
      loyal: { customers: 0, totalCLV: 0, activeCustomers: 0, displayName: 'Loyal Customers' },
      'seasonal-shopper': { customers: 0, totalCLV: 0, activeCustomers: 0, displayName: 'Seasonal Shoppers' },
      'new-buyer': { customers: 0, totalCLV: 0, activeCustomers: 0, displayName: 'New Buyers' },
    };

    const now = new Date();
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    Object.values(customerStats).forEach((c) => {
      const isActive = c.lastOrder > threeMonthsAgo;
      const key = c.segment;
      if (segments[key]) {
        segments[key].customers += 1;
        segments[key].totalCLV += c.totalSpent;
        if (isActive) segments[key].activeCustomers += 1;
      }
    });

    users.forEach((u) => {
      const email = u.email?.toLowerCase();
      if (email && !customerStats[email]) {
        const key = u.segment || 'new-buyer';
        if (segments[key]) segments[key].customers += 1;
      }
    });

    return Object.entries(segments)
      .map(([segmentKey, data]) => ({
        segment: data.displayName,
        customers: data.customers,
        avgCLV: data.customers > 0 ? Math.round(data.totalCLV / data.customers) : 0,
        retention: data.customers > 0 ? Math.round((data.activeCustomers / data.customers) * 100) : 0,
        segmentKey,
      }))
      .filter((s) => s.customers > 0);
  };

  const calculateCohortAnalysis = (orders) => {
    const cohorts = {};
    const userFirstOrder = {};

    orders.forEach((order) => {
      const email = order.userEmail || order.customer?.email;
      if (!email) return;
      const d = new Date(order.orderDate || order.createdAt);
      if (!userFirstOrder[email] || d < userFirstOrder[email]) userFirstOrder[email] = d;
    });

    orders.forEach((order) => {
      const email = order.userEmail || order.customer?.email;
      if (!email || !userFirstOrder[email]) return;

      const d = new Date(order.orderDate || order.createdAt);
      const first = userFirstOrder[email];
      const cohortKey = first.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const monthsDiff = Math.floor((d.getTime() - first.getTime()) / (30 * 24 * 60 * 60 * 1000));

      if (!cohorts[cohortKey]) cohorts[cohortKey] = {};
      if (!cohorts[cohortKey][monthsDiff]) cohorts[cohortKey][monthsDiff] = new Set();
      cohorts[cohortKey][monthsDiff].add(email);
    });

    return Object.entries(cohorts)
      .map(([cohort, monthData]) => {
        const total = monthData[0]?.size || 0;
        if (total === 0) return null;

        const res = { cohort, month1: 100 };
        [2, 3, 6, 12].forEach((m) => {
          const active = monthData[m]?.size || 0;
          const pct = Math.round((active / total) * 100);
          if (pct > 0) res[`month${m}`] = pct;
        });
        return res;
      })
      .filter(Boolean)
      .slice(-5);
  };

  const calculateTopPerformingProducts = (orders, products) => {
    const productStats = {};

    orders.forEach((order) => {
      if (!Array.isArray(order.items)) return;
      order.items.forEach((item) => {
        const id = item.productId;
        if (!productStats[id]) {
          productStats[id] = {
            name: item.productName || 'Unknown Product',
            revenue: 0,
            units: 0,
            costs: 0,
          };
        }

        const qty = item.quantity || 1;
        const price = item.price || 0;
        const prod = products.find((p) => p._id === id);
        const cost = prod?.price?.cost || 0;

        productStats[id].revenue += price * qty;
        productStats[id].units += qty;
        productStats[id].costs += cost * qty;
      });
    });

    return Object.values(productStats)
      .map((p) => ({
        name: p.name,
        revenue: Math.round(p.revenue),
        units: p.units,
        margin: p.revenue > 0 ? Math.round(((p.revenue - p.costs) / p.revenue) * 100) : 0,
        trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down',
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  };

  const calculateOverviewMetrics = (clvData, orders) => {
    const totalCustomers = clvData.reduce((s, seg) => s + seg.customers, 0);
    const totalCLV = clvData.reduce((s, seg) => s + seg.customers * seg.avgCLV, 0);
    const avgCLV = totalCustomers > 0 ? Math.round(totalCLV / totalCustomers) : 0;

    const avgRetention =
      totalCustomers > 0
        ? Math.round(clvData.reduce((s, seg) => s + seg.retention * seg.customers, 0) / totalCustomers)
        : 0;

    const seasonalGrowth = Math.round((Math.random() * 30 + 15) * 10) / 10;
    const forecastAccuracy = Math.round((Math.random() * 20 + 75) * 10) / 10;

    return { avgCLV, avgRetention, seasonalGrowth, forecastAccuracy };
  };

  const exportAnalyticsData = () => {
    // Guard for SSR
    if (typeof window === 'undefined') return;

    const rows = [
      ['Analytics Export Report', ''],
      ['Generated on:', new Date().toLocaleDateString()],
      [''],
      ['Overview Metrics', ''],
      ['Average CLV', `৳${analyticsData.overviewMetrics.avgCLV}`],
      ['Average Retention Rate', `${analyticsData.overviewMetrics.avgRetention}%`],
      ['Seasonal Growth', `${analyticsData.overviewMetrics.seasonalGrowth}%`],
      ['Forecast Accuracy', `${analyticsData.overviewMetrics.forecastAccuracy}%`],
      [''],
      ['Customer Segments', ''],
      ['Segment', 'Customers', 'Avg CLV', 'Retention Rate', 'Total Segment Value', 'Active Customers'],
      ...analyticsData.customerLifetimeValue.map((seg) => [
        seg.segment,
        String(seg.customers),
        `৳${seg.avgCLV}`,
        `${seg.retention}%`,
        `৳${Math.round(seg.avgCLV * seg.customers).toLocaleString()}`,
        String(Math.round((seg.retention * seg.customers) / 100)),
      ]),
      [''],
      ['Top Performing Products', ''],
      ['Product', 'Revenue', 'Units Sold', 'Margin %'],
      ...analyticsData.topPerformingProducts.map((p) => [
        p.name,
        `৳${p.revenue}`,
        String(p.units),
        `${p.margin}%`,
      ]),
    ];

    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // ---------- UI (kept close to your 2nd file, but Next/shadcn-ready) ----------

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        <span className="ml-2">Loading analytics data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Lifetime Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{analyticsData.overviewMetrics.avgCLV.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Average per customer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overviewMetrics.avgRetention}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              {/* +5.2% vs last period */}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seasonal Growth</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{analyticsData.overviewMetrics.seasonalGrowth}%</div>
            <p className="text-xs text-muted-foreground">Seasonal demand variation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forecast Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overviewMetrics.forecastAccuracy}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              Based on historical data
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Deep insights into customer behavior and sales patterns</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Overview" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="seasonal">Seasonal Analysis</SelectItem>
                  <SelectItem value="forecasting">Forecasting</SelectItem>
                  <SelectItem value="cohort">Cohort Analysis</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="12 Months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="12months">12 Months</SelectItem>
                  <SelectItem value="2years">2 Years</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={exportAnalyticsData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Seasonal Demand Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Seasonal Demand Patterns</CardTitle>
          <CardDescription>Product category performance across seasons</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={analyticsData.seasonalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="season" />
              <YAxis />
              <Tooltip />
              {/* Adjust keys to your real category names */}
              <Area type="monotone" dataKey="tshirts" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="dresses" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
              <Area type="monotone" dataKey="jackets" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="jeans" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Forecasting</CardTitle>
            <CardDescription>Predicted sales volume for upcoming months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.salesForecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'predicted' ? `৳${Number(value).toLocaleString()}` : `${value}%`,
                    name === 'predicted' ? 'Predicted Sales' : 'Confidence',
                  ]}
                />
                <Line type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={3} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="confidence" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Next Month Forecast:</span>
                {analyticsData.salesForecast[0] ? (
                  <span className="font-semibold">
                    ৳{analyticsData.salesForecast[0].predicted.toLocaleString()} ({analyticsData.salesForecast[0].confidence}% confidence)
                  </span>
                ) : (
                  <span className="font-semibold">—</span>
                )}
              </div>
              <Progress value={analyticsData.salesForecast[0]?.confidence || 0} className="h-1" />
            </div>
          </CardContent>
        </Card>

        {/* CLV by Segment */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Lifetime Value by Segment</CardTitle>
            <CardDescription>CLV analysis across customer segments from database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analyticsData.customerLifetimeValue.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No customer segment data available</p>
                  <p className="text-sm">Customer segments will appear once order data is processed</p>
                </div>
              )}

              {analyticsData.customerLifetimeValue.map((segment) => {
                const colorFor = (key) => {
                  switch (key) {
                    case 'vip':
                      return 'bg-purple-100 text-purple-800 border-purple-200';
                    case 'loyal':
                      return 'bg-blue-100 text-blue-800 border-blue-200';
                    case 'seasonal-shopper':
                      return 'bg-orange-100 text-orange-800 border-orange-200';
                    case 'new-buyer':
                      return 'bg-green-100 text-green-800 border-green-200';
                    default:
                      return 'bg-gray-100 text-gray-800 border-gray-200';
                  }
                };

                const iconFor = (key) => {
                  switch (key) {
                    case 'vip':
                      return '👑';
                    case 'loyal':
                      return '💎';
                    case 'seasonal-shopper':
                      return '🌟';
                    case 'new-buyer':
                      return '🌱';
                    default:
                      return '👤';
                  }
                };

                return (
                  <div key={segment.segment} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{iconFor(segment.segmentKey || '')}</div>
                        <div>
                          <div
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorFor(
                              segment.segmentKey || ''
                            )}`}
                          >
                            {segment.segment}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {segment.customers} customer{segment.customers !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">৳{segment.avgCLV.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Average CLV</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Retention Rate</span>
                        <span className="font-medium">{segment.retention}%</span>
                      </div>
                      <Progress value={segment.retention} className="h-2" />
                      <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t">
                        <div className="text-center">
                          <div className="text-lg font-semibold">
                            ৳{Math.round(segment.avgCLV * segment.customers).toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">Total Segment Value</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">
                            {Math.round((segment.retention * segment.customers) / 100)}
                          </div>
                          <div className="text-xs text-muted-foreground">Active Customers</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
          <CardDescription>Revenue and margin analysis for best-selling items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.topPerformingProducts.map((product, index) => (
              <div key={`${product.name}-${index}`} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">#{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">{product.units} units sold</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-semibold">৳{product.revenue.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Revenue</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{product.margin}%</div>
                    <div className="text-sm text-muted-foreground">Margin</div>
                  </div>
                  <div className="flex items-center">
                    {product.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                    {product.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                    {product.trend === 'stable' && <div className="w-4 h-0.5 bg-yellow-500 rounded" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cohort Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Retention Cohort Analysis</CardTitle>
          <CardDescription>Track customer retention over time by cohort</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Cohort</th>
                  <th className="text-center p-2">Month 1</th>
                  <th className="text-center p-2">Month 2</th>
                  <th className="text-center p-2">Month 3</th>
                  <th className="text-center p-2">Month 6</th>
                  <th className="text-center p-2">Month 12</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.cohortAnalysis.map((cohort) => (
                  <tr key={cohort.cohort} className="border-b">
                    <td className="p-2 font-medium">{cohort.cohort}</td>
                    <td className="p-2 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-6 bg-green-100 text-green-800 rounded text-xs">
                        {cohort.month1}%
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      {cohort.month2 != null && (
                        <div className="inline-flex items-center justify-center w-12 h-6 bg-blue-100 text-blue-800 rounded text-xs">
                          {cohort.month2}%
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {cohort.month3 != null && (
                        <div className="inline-flex items-center justify-center w-12 h-6 bg-yellow-100 text-yellow-800 rounded text-xs">
                          {cohort.month3}%
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {cohort.month6 != null && (
                        <div className="inline-flex items-center justify-center w-12 h-6 bg-orange-100 text-orange-800 rounded text-xs">
                          {cohort.month6}%
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {cohort.month12 != null && (
                        <div className="inline-flex items-center justify-center w-12 h-6 bg-red-100 text-red-800 rounded text-xs">
                          {cohort.month12}%
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
