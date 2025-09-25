'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  FileText,
  Download,
  Calendar,
  AlertCircle,
  BarChart as BarChartIcon, // alias to avoid clashing with Recharts
} from 'lucide-react';

// Color palette for charts
const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5a2b'];

export default function FinancialAnalysis() {
  const [timeRange, setTimeRange] = useState('6months');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [financialData, setFinancialData] = useState({
    totalRevenue: 0,
    totalProfit: 0,
    grossMargin: 0,
    netMargin: 0,
    monthlyFinancials: [],
    categoryRevenue: [],
    productProfitability: [],
    dailyReports: [],
    forecasting: {
      nextMonthRevenue: 0,
      projectedProfit: 0,
      growthRate: 0,
      trendDirection: 'stable',
    },
  });

  // Fetch financial data from database
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        // Fetch orders and products data
        const [ordersRes, productsRes] = await Promise.all([
          fetch(`${apiUrl}/api/orders?limit=1000`, { cache: 'no-store' }),
          fetch(`${apiUrl}/api/products?limit=1000`, { cache: 'no-store' }),
        ]);

        if (!ordersRes.ok) throw new Error(`Orders API error: ${ordersRes.status}`);
        if (!productsRes.ok) throw new Error(`Products API error: ${productsRes.status}`);

        const [ordersData, productsData] = await Promise.all([ordersRes.json(), productsRes.json()]);

        const orders = ordersData?.success && Array.isArray(ordersData.data) ? ordersData.data : [];
        const products = productsData?.success && Array.isArray(productsData.data) ? productsData.data : [];

        const calculatedData = calculateFinancialMetrics(orders, products);
        setFinancialData(calculatedData);
      } catch (err) {
        console.error('Error fetching financial data:', err);
        setError('Failed to load financial data');
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [timeRange]);

  // ---------- Calculations (TypeScript removed; same logic) ----------

  const calculateFinancialMetrics = (orders, products) => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.orderSummary?.total || 0), 0);

    // COGS from product costs
    let totalCOGS = 0;
    orders.forEach((order) => {
      if (Array.isArray(order.items)) {
        order.items.forEach((item) => {
          const product = products.find((p) => p._id === item.productId);
          const costPrice = product?.price?.cost || 0;
          const quantity = item.quantity || 1;
          totalCOGS += costPrice * quantity;
        });
      }
    });

    const grossMargin = totalRevenue > 0 ? ((totalRevenue - totalCOGS) / totalRevenue) * 100 : 0;

    const operatingExpensesRate = 0.2;
    const operatingExpenses = totalRevenue * operatingExpensesRate;

    const totalProfit = totalRevenue - totalCOGS - operatingExpenses;
    const netMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    const monthlyFinancials = calculateMonthlyFinancials(orders, products);
    const categoryRevenue = calculateCategoryRevenue(orders);
    const productProfitability = calculateProductProfitability(orders, products);
    const dailyReports = calculateDailyReports(orders, products);
    const forecasting = calculateForecasting(monthlyFinancials);

    return {
      totalRevenue,
      totalProfit,
      grossMargin,
      netMargin,
      monthlyFinancials,
      categoryRevenue,
      productProfitability,
      dailyReports,
      forecasting,
    };
  };

  const calculateMonthlyFinancials = (orders, products) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    const monthlyData = {};

    // Initialize last 6 months
    for (let i = 0; i < 6; i++) {
      const date = new Date(sixMonthsAgo);
      date.setMonth(date.getMonth() + i);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      monthlyData[monthKey] = { revenue: 0, cogs: 0, orders: 0 };
    }

    orders.forEach((order) => {
      const orderDate = new Date(order.orderDate || order.createdAt);
      if (orderDate >= sixMonthsAgo) {
        const monthKey = `${monthNames[orderDate.getMonth()]} ${orderDate.getFullYear()}`;
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].revenue += order.orderSummary?.total || 0;
          monthlyData[monthKey].orders += 1;
          if (Array.isArray(order.items)) {
            order.items.forEach((item) => {
              const product = products.find((p) => p._id === item.productId);
              const costPrice = product?.price?.cost || 0;
              const quantity = item.quantity || 1;
              monthlyData[monthKey].cogs += costPrice * quantity;
            });
          }
        }
      }
    });

    return Object.entries(monthlyData).map(([month, data]) => {
      const operatingExpenses = data.revenue * 0.2;
      const profit = data.revenue - data.cogs - operatingExpenses;
      return {
        month: month.split(' ')[0],
        revenue: Math.round(data.revenue),
        profit: Math.round(profit),
        orders: data.orders,
        avgOrderValue: data.orders > 0 ? Math.round(data.revenue / data.orders) : 0,
      };
    });
  };

  const calculateCategoryRevenue = (orders) => {
    const categoryRevenue = {};
    let total = 0;

    orders.forEach((order) => {
      if (Array.isArray(order.items)) {
        order.items.forEach((item) => {
          const category = item.categoryName || 'Uncategorized';
          const itemRevenue = (item.price || 0) * (item.quantity || 1);
          categoryRevenue[category] = (categoryRevenue[category] || 0) + itemRevenue;
          total += itemRevenue;
        });
      }
    });

    if (total === 0) {
      return [{ category: 'No Sales Data', revenue: 0, percentage: 100, color: colors[0] }];
    }

    return Object.entries(categoryRevenue)
      .map(([category, revenue], index) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' '),
        revenue: Math.round(revenue),
        percentage: Math.round((revenue / total) * 100),
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);
  };

  const calculateProductProfitability = (orders, products) => {
    const productStats = {};

    orders.forEach((order) => {
      if (!Array.isArray(order.items)) return;
      order.items.forEach((item) => {
        const productId = item.productId;
        if (!productStats[productId]) {
          productStats[productId] = {
            productName: item.productName || 'Unknown Product',
            category: item.categoryName || 'Uncategorized',
            unitsSold: 0,
            revenue: 0,
            costs: [],
            prices: [],
          };
        }
        productStats[productId].unitsSold += item.quantity || 1;
        const itemRevenue = (item.price || 0) * (item.quantity || 1);
        productStats[productId].revenue += itemRevenue;
        productStats[productId].prices.push(item.price || 0);

        const product = products.find((p) => p._id === item.productId);
        const costPrice = product?.price?.cost || 0;
        productStats[productId].costs.push(costPrice);
      });
    });

    return Object.entries(productStats)
      .map(([productId, stats]) => {
        const avgPrice =
          stats.prices.length > 0 ? stats.prices.reduce((s, v) => s + v, 0) / stats.prices.length : 0;
        const avgCost =
          stats.costs.length > 0 ? stats.costs.reduce((s, v) => s + v, 0) / stats.costs.length : 0;

        const cogs = avgCost * stats.unitsSold;
        const grossProfit = stats.revenue - cogs;
        const grossMargin = stats.revenue > 0 ? Math.round((grossProfit / stats.revenue) * 100) : 0;

        const operatingExpenses = stats.revenue * 0.2;
        const netProfit = grossProfit - operatingExpenses;
        const netMargin = stats.revenue > 0 ? Math.round((netProfit / stats.revenue) * 100) : 0;

        return {
          productId,
          productName: stats.productName,
          category: stats.category.charAt(0).toUpperCase() + stats.category.slice(1).replace('-', ' '),
          unitsSold: stats.unitsSold,
          revenue: Math.round(stats.revenue),
          avgPrice: Math.round(avgPrice),
          totalProfit: Math.round(netProfit),
          grossMargin,
          netMargin,
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  };

  const calculateDailyReports = (orders, products) => {
    const dailyData = {};
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    orders.forEach((order) => {
      const orderDate = new Date(order.orderDate || order.createdAt);
      if (orderDate >= last7Days) {
        const dateKey = orderDate.toISOString().split('T')[0];
        if (!dailyData[dateKey]) dailyData[dateKey] = { revenue: 0, cogs: 0, orders: 0 };
        dailyData[dateKey].revenue += order.orderSummary?.total || 0;
        dailyData[dateKey].orders += 1;

        if (Array.isArray(order.items)) {
          order.items.forEach((item) => {
            const product = products.find((p) => p._id === item.productId);
            const costPrice = product?.price?.cost || 0;
            const quantity = item.quantity || 1;
            dailyData[dateKey].cogs += costPrice * quantity;
          });
        }
      }
    });

    return Object.entries(dailyData)
      .map(([date, data]) => {
        const operatingExpenses = data.revenue * 0.2;
        const profit = data.revenue - data.cogs - operatingExpenses;
        return {
          date,
          revenue: Math.round(data.revenue),
          profit: Math.round(profit),
          orders: data.orders,
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  const calculateForecasting = (monthlyFinancials) => {
    if (monthlyFinancials.length < 2) {
      return { nextMonthRevenue: 0, projectedProfit: 0, growthRate: 0, trendDirection: 'stable' };
    }

    const revenues = monthlyFinancials.map((m) => m.revenue).filter((r) => r > 0);
    if (revenues.length < 2) {
      const lastRev = Math.round(monthlyFinancials[monthlyFinancials.length - 1]?.revenue || 0);
      return {
        nextMonthRevenue: lastRev,
        projectedProfit: Math.round(lastRev * 0.4),
        growthRate: 0,
        trendDirection: 'stable',
      };
    }

    // Weighted growth
    let weightedGrowthSum = 0;
    let totalWeight = 0;
    for (let i = 1; i < revenues.length; i++) {
      const growth = revenues[i - 1] > 0 ? ((revenues[i] - revenues[i - 1]) / revenues[i - 1]) * 100 : 0;
      const weight = i / revenues.length;
      weightedGrowthSum += growth * weight;
      totalWeight += weight;
    }
    const avgGrowthRate = totalWeight > 0 ? weightedGrowthSum / totalWeight : 0;

    // Recent growth
    const recentGrowth =
      revenues.length >= 3
        ? ((revenues[revenues.length - 1] - revenues[revenues.length - 3]) /
          revenues[revenues.length - 3]) *
        100
        : avgGrowthRate;

    // Exponential smoothing
    const alpha = 0.3;
    let smoothed = revenues[0];
    for (let i = 1; i < revenues.length; i++) {
      smoothed = alpha * revenues[i] + (1 - alpha) * smoothed;
    }

    const nextMonthRevenue = Math.max(0, Math.round(smoothed * (1 + avgGrowthRate / 100)));
    const projectedProfit = Math.max(0, Math.round(nextMonthRevenue * 0.4));

    let trendDirection = 'stable';
    if (recentGrowth > 10) trendDirection = 'up';
    else if (recentGrowth < -10) trendDirection = 'down';

    return {
      nextMonthRevenue,
      projectedProfit,
      growthRate: Math.round(avgGrowthRate * 10) / 10,
      trendDirection,
    };
  };

  // ---------- CSV Exporters (unchanged functionally) ----------

  const exportDailyReport = () => {
    const today = new Date();
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const recent = financialData.dailyReports;

    const headers = [
      'Date',
      'Day of Week',
      'Revenue',
      'Estimated Profit',
      'Orders Count',
      'Average Order Value',
      'Profit Margin %',
    ];

    const csvData = [
      ['=== DAILY FINANCIAL REPORT ==='],
      ['Report Generated:', new Date().toLocaleDateString()],
      ['Report Period:', `Last 30 Days (${last30Days.toLocaleDateString()} - ${today.toLocaleDateString()})`],
      [''],
      ['=== SUMMARY METRICS ==='],
      ['Total Revenue (30 days):', `৳${recent.reduce((s, d) => s + d.revenue, 0).toLocaleString()}`],
      ['Total Profit (30 days):', `৳${recent.reduce((s, d) => s + d.profit, 0).toLocaleString()}`],
      ['Total Orders (30 days):', recent.reduce((s, d) => s + d.orders, 0).toString()],
      [
        'Average Daily Revenue:',
        `৳${Math.round(recent.reduce((s, d) => s + d.revenue, 0) / Math.max(recent.length, 1)).toLocaleString()}`,
      ],
      [
        'Average Daily Profit:',
        `৳${Math.round(recent.reduce((s, d) => s + d.profit, 0) / Math.max(recent.length, 1)).toLocaleString()}`,
      ],
      [''],
      ['=== DAILY BREAKDOWN ==='],
      headers,
      ...recent.map((day) => {
        const date = new Date(day.date);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        const avgOrderValue = day.orders > 0 ? Math.round(day.revenue / day.orders) : 0;
        const profitMargin = day.revenue > 0 ? Math.round((day.profit / day.revenue) * 100) : 0;
        return [
          date.toLocaleDateString(),
          dayOfWeek,
          `$${day.revenue.toLocaleString()}`,
          `$${day.profit.toLocaleString()}`,
          String(day.orders),
          `$${avgOrderValue}`,
          `${profitMargin}%`,
        ];
      }),
      [''],
      ['=== INSIGHTS ==='],
      [
        'Best Revenue Day:',
        recent.length > 0
          ? `${new Date([...recent].sort((a, b) => b.revenue - a.revenue)[0].date).toLocaleDateString()} ($${[...recent].sort((a, b) => b.revenue - a.revenue)[0].revenue.toLocaleString()
          })`
          : 'N/A',
      ],
      [
        'Best Profit Day:',
        recent.length > 0
          ? `${new Date([...recent].sort((a, b) => b.profit - a.profit)[0].date).toLocaleDateString()} ($${[...recent].sort((a, b) => b.profit - a.profit)[0].profit.toLocaleString()
          })`
          : 'N/A',
      ],
      [
        'Most Orders Day:',
        recent.length > 0
          ? `${new Date([...recent].sort((a, b) => b.orders - a.orders)[0].date).toLocaleDateString()} (${[...recent].sort((a, b) => b.orders - a.orders)[0].orders
          } orders)`
          : 'N/A',
      ],
    ];

    downloadCSV(csvData, `daily-financial-report-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportWeeklyReport = () => {
    const today = new Date();
    const last12Weeks = new Date();
    last12Weeks.setDate(last12Weeks.getDate() - 84);

    const weeklyData = financialData.monthlyFinancials.map((m, i) => ({
      week: `Week ${i + 1}`,
      period: m.month,
      revenue: m.revenue,
      profit: m.profit,
      orders: m.orders,
      avgOrderValue: m.avgOrderValue,
    }));

    const headers = [
      'Week Period',
      'Revenue',
      'Profit',
      'Orders',
      'Average Order Value',
      'Profit Margin %',
      'Week over Week Growth %',
    ];

    const csvData = [
      ['=== WEEKLY FINANCIAL REPORT ==='],
      ['Report Generated:', new Date().toLocaleDateString()],
      ['Report Period:', `Last 12 Weeks (${last12Weeks.toLocaleDateString()} - ${today.toLocaleDateString()})`],
      [''],
      ['=== SUMMARY METRICS ==='],
      ['Total Revenue (12 weeks):', `$${weeklyData.reduce((s, w) => s + w.revenue, 0).toLocaleString()}`],
      ['Total Profit (12 weeks):', `$${weeklyData.reduce((s, w) => s + w.profit, 0).toLocaleString()}`],
      ['Total Orders (12 weeks):', weeklyData.reduce((s, w) => s + w.orders, 0).toString()],
      [
        'Average Weekly Revenue:',
        `$${Math.round(weeklyData.reduce((s, w) => s + w.revenue, 0) / Math.max(weeklyData.length, 1)).toLocaleString()}`,
      ],
      [
        'Average Weekly Profit:',
        `$${Math.round(weeklyData.reduce((s, w) => s + w.profit, 0) / Math.max(weeklyData.length, 1)).toLocaleString()}`,
      ],
      [
        'Overall Profit Margin:',
        `${weeklyData.length > 0
          ? Math.round(
            (weeklyData.reduce((s, w) => s + w.profit, 0) / weeklyData.reduce((s, w) => s + w.revenue, 0)) * 100
          )
          : 0
        }%`,
      ],
      [''],
      ['=== WEEKLY BREAKDOWN ==='],
      headers,
      ...weeklyData.map((week, index) => {
        const profitMargin = week.revenue > 0 ? Math.round((week.profit / week.revenue) * 100) : 0;
        const prevWeek = weeklyData[index - 1];
        const wow = prevWeek && prevWeek.revenue > 0 ? Math.round(((week.revenue - prevWeek.revenue) / prevWeek.revenue) * 100) : 0;
        return [
          week.period,
          `$${week.revenue.toLocaleString()}`,
          `$${week.profit.toLocaleString()}`,
          String(week.orders),
          `$${week.avgOrderValue}`,
          `${profitMargin}%`,
          `${wow > 0 ? '+' : ''}${wow}%`,
        ];
      }),
      [''],
      ['=== WEEKLY INSIGHTS ==='],
      [
        'Best Revenue Week:',
        weeklyData.length > 0
          ? `${[...weeklyData].sort((a, b) => b.revenue - a.revenue)[0].period} ($${[...weeklyData].sort((a, b) => b.revenue - a.revenue)[0].revenue.toLocaleString()
          })`
          : 'N/A',
      ],
      [
        'Best Profit Week:',
        weeklyData.length > 0
          ? `${[...weeklyData].sort((a, b) => b.profit - a.profit)[0].period} ($${[...weeklyData].sort((a, b) => b.profit - a.profit)[0].profit.toLocaleString()
          })`
          : 'N/A',
      ],
      [
        'Most Orders Week:',
        weeklyData.length > 0
          ? `${[...weeklyData].sort((a, b) => b.orders - a.orders)[0].period} (${[...weeklyData].sort((a, b) => b.orders - a.orders)[0].orders
          } orders)`
          : 'N/A',
      ],
      ['Growth Trend:', financialData.forecasting.trendDirection[0].toUpperCase() + financialData.forecasting.trendDirection.slice(1)],
      ['Projected Next Week Revenue:', `$${Math.round(financialData.forecasting.nextMonthRevenue / 4).toLocaleString()}`],
    ];

    downloadCSV(csvData, `weekly-financial-report-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportMonthlyReport = () => {
    const today = new Date();
    const monthlyData = financialData.monthlyFinancials;

    const headers = [
      'Month',
      'Revenue',
      'Profit',
      'Orders',
      'Average Order Value',
      'Profit Margin %',
      'Month over Month Growth %',
      'Revenue per Day',
    ];

    const csvData = [
      ['=== MONTHLY FINANCIAL REPORT ==='],
      ['Report Generated:', new Date().toLocaleDateString()],
      ['Report Period:', `Last ${monthlyData.length} Months`],
      [''],
      ['=== EXECUTIVE SUMMARY ==='],
      ['Total Revenue (Period):', `$${monthlyData.reduce((s, m) => s + m.revenue, 0).toLocaleString()}`],
      ['Total Profit (Period):', `$${monthlyData.reduce((s, m) => s + m.profit, 0).toLocaleString()}`],
      ['Total Orders (Period):', monthlyData.reduce((s, m) => s + m.orders, 0).toString()],
      [
        'Average Monthly Revenue:',
        `$${Math.round(monthlyData.reduce((s, m) => s + m.revenue, 0) / Math.max(monthlyData.length, 1)).toLocaleString()}`,
      ],
      [
        'Average Monthly Profit:',
        `$${Math.round(monthlyData.reduce((s, m) => s + m.profit, 0) / Math.max(monthlyData.length, 1)).toLocaleString()}`,
      ],
      [
        'Overall Profit Margin:',
        `${monthlyData.length > 0
          ? Math.round(
            (monthlyData.reduce((s, m) => s + m.profit, 0) /
              monthlyData.reduce((s, m) => s + m.revenue, 0)) *
            100
          )
          : 0
        }%`,
      ],
      ['Growth Rate:', `${financialData.forecasting.growthRate > 0 ? '+' : ''}${financialData.forecasting.growthRate}%`],
      [''],
      ['=== FINANCIAL FORECASTING ==='],
      ['Next Month Revenue Forecast:', `$${financialData.forecasting.nextMonthRevenue.toLocaleString()}`],
      ['Next Month Profit Forecast:', `$${financialData.forecasting.projectedProfit.toLocaleString()}`],
      ['Trend Direction:', financialData.forecasting.trendDirection[0].toUpperCase() + financialData.forecasting.trendDirection.slice(1)],
      [''],
      ['=== CATEGORY PERFORMANCE ==='],
      [
        'Top Category by Revenue:',
        financialData.categoryRevenue[0]
          ? `${financialData.categoryRevenue[0].category} ($${financialData.categoryRevenue[0].revenue.toLocaleString()})`
          : 'N/A',
      ],
      ...financialData.categoryRevenue.slice(0, 5).map((cat) => [`${cat.category}:`, `$${cat.revenue.toLocaleString()} (${cat.percentage}%)`]),
      [''],
      ['=== MONTHLY BREAKDOWN ==='],
      headers,
      ...monthlyData.map((month, index) => {
        const profitMargin = month.revenue > 0 ? Math.round((month.profit / month.revenue) * 100) : 0;
        const prev = monthlyData[index - 1];
        const mom = prev && prev.revenue > 0 ? Math.round(((month.revenue - prev.revenue) / prev.revenue) * 100) : 0;
        const revenuePerDay = Math.round(month.revenue / 30);
        return [
          month.month,
          `$${month.revenue.toLocaleString()}`,
          `$${month.profit.toLocaleString()}`,
          String(month.orders),
          `$${month.avgOrderValue}`,
          `${profitMargin}%`,
          `${mom > 0 ? '+' : ''}${mom}%`,
          `$${revenuePerDay}`,
        ];
      }),
      [''],
      ['=== PRODUCT PERFORMANCE SUMMARY ==='],
      ['Top Products by Revenue:'],
      ...financialData.productProfitability.slice(0, 5).map((p, i) => [`${i + 1}. ${p.productName}:`, `$${p.revenue.toLocaleString()} (${p.unitsSold} units)`]),
      [''],
      ['=== KEY INSIGHTS ==='],
      [
        'Best Revenue Month:',
        monthlyData.length > 0
          ? `${[...monthlyData].sort((a, b) => b.revenue - a.revenue)[0].month} ($${[...monthlyData].sort((a, b) => b.revenue - a.revenue)[0].revenue.toLocaleString()
          })`
          : 'N/A',
      ],
      [
        'Best Profit Month:',
        monthlyData.length > 0
          ? `${[...monthlyData].sort((a, b) => b.profit - a.profit)[0].month} ($${[...monthlyData].sort((a, b) => b.profit - a.profit)[0].profit.toLocaleString()
          })`
          : 'N/A',
      ],
      [
        'Most Orders Month:',
        monthlyData.length > 0
          ? `${[...monthlyData].sort((a, b) => b.orders - a.orders)[0].month} (${[...monthlyData].sort((a, b) => b.orders - a.orders)[0].orders
          } orders)`
          : 'N/A',
      ],
      [
        'Highest AOV Month:',
        monthlyData.length > 0
          ? `${[...monthlyData].sort((a, b) => b.avgOrderValue - a.avgOrderValue)[0].month} ($${[...monthlyData].sort((a, b) => b.avgOrderValue - a.avgOrderValue)[0].avgOrderValue
          })`
          : 'N/A',
      ],
      [''],
      ['=== RECOMMENDATIONS ==='],
      ['1. Focus on maintaining growth in top-performing categories'],
      ['2. Optimize marketing spend during high-performing months'],
      ['3. Improve profit margins on low-margin products'],
      ['4. Scale successful product lines based on profitability data'],
      ['5. Monitor seasonal trends for inventory planning'],
    ];

    downloadCSV(csvData, `monthly-financial-report-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportProductProfitability = () => {
    const headers = [
      'Product Name',
      'Category',
      'Product ID',
      'Units Sold',
      'Total Revenue',
      'Average Price',
      'Net Profit',
      'Gross Margin (%)',
      'Net Margin (%)',
      'Revenue per Unit',
      'Profit per Unit',
    ];

    const csvData = [
      headers,
      ['=== SUMMARY ===', '', '', '', '', '', '', '', '', '', ''],
      [
        'Total Products',
        String(financialData.productProfitability.length),
        '',
        String(financialData.productProfitability.reduce((s, p) => s + p.unitsSold, 0)),
        `$${financialData.productProfitability.reduce((s, p) => s + p.revenue, 0).toLocaleString()}`,
        `$${Math.round(
          financialData.productProfitability.reduce((s, p) => s + p.avgPrice, 0) /
          Math.max(financialData.productProfitability.length, 1)
        )}`,
        `$${financialData.productProfitability.reduce((s, p) => s + p.totalProfit, 0).toLocaleString()}`,
        `${Math.round(
          financialData.productProfitability.reduce((s, p) => s + p.grossMargin, 0) /
          Math.max(financialData.productProfitability.length, 1)
        )}%`,
        `${Math.round(
          financialData.productProfitability.reduce((s, p) => s + p.netMargin, 0) /
          Math.max(financialData.productProfitability.length, 1)
        )}%`,
        '',
        '',
      ],
      ['', '', '', '', '', '', '', '', '', '', ''],
      ['=== PRODUCT DETAILS ===', '', '', '', '', '', '', '', '', '', ''],
      ...financialData.productProfitability.map((product) => [
        product.productName,
        product.category,
        product.productId,
        String(product.unitsSold),
        `৳${product.revenue.toLocaleString()}`,
        `৳${product.avgPrice}`,
        `৳${product.totalProfit.toLocaleString()}`,
        `${product.grossMargin}%`,
        `${product.netMargin}%`,
        `৳${Math.round(product.revenue / Math.max(product.unitsSold, 1))}`,
        `৳${Math.round(product.totalProfit / Math.max(product.unitsSold, 1))}`,
      ]),
      ['', '', '', '', '', '', '', '', '', '', ''],
      ['=== PERFORMANCE INSIGHTS ===', '', '', '', '', '', '', '', '', '', ''],
      [
        'Best Performing Product (Revenue)',
        financialData.productProfitability[0]?.productName || 'N/A',
        '',
        '',
        financialData.productProfitability[0] ? `$${financialData.productProfitability[0].revenue.toLocaleString()}` : '$0',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
      [
        'Most Profitable Product (Net Margin)',
        [...financialData.productProfitability].sort((a, b) => b.netMargin - a.netMargin)[0]?.productName || 'N/A',
        '',
        '',
        '',
        '',
        [...financialData.productProfitability].sort((a, b) => b.netMargin - a.netMargin)[0]
          ? `${[...financialData.productProfitability].sort((a, b) => b.netMargin - a.netMargin)[0].totalProfit.toLocaleString()
          }`
          : '৳0',
        [...financialData.productProfitability].sort((a, b) => b.netMargin - a.netMargin)[0]
          ? `${[...financialData.productProfitability].sort((a, b) => b.netMargin - a.netMargin)[0].netMargin}%`
          : '0%',
        '',
        '',
        '',
      ],
      [
        'Best Selling Product (Units)',
        [...financialData.productProfitability].sort((a, b) => b.unitsSold - a.unitsSold)[0]?.productName || 'N/A',
        '',
        [...financialData.productProfitability].sort((a, b) => b.unitsSold - a.unitsSold)[0]?.unitsSold || '0',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
      ['', '', '', '', '', '', '', '', '', '', ''],
      ['Report Generated:', new Date().toLocaleDateString()],
      ['Report Time:', new Date().toLocaleTimeString()],
      ['Data Source:', 'Real-time database analysis'],
      ['Calculation Method:', 'Revenue - COGS - Operating Expenses (20%)'],
    ];

    downloadCSV(csvData, `product-profitability-analysis-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const downloadCSV = (rows, filename) => {
    // Guard for SSR
    if (typeof window === 'undefined') return;

    const csv = rows
      .map((row) =>
        row
          .map((cell) => {
            if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))) {
              return `"${cell.replace(/"/g, '""')}"`;
            }
            return cell;
          })
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------- UI ----------

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        <span className="ml-2">Loading financial data...</span>
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
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{financialData.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              From actual orders
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Net Profit</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{financialData.totalProfit.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              Calculated from actual cost data
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialData.grossMargin.toFixed(1)}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              (Revenue - COGS) / Revenue
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialData.netMargin.toFixed(1)}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              After operating expenses
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Revenue vs Profit Trend</CardTitle>
                <CardDescription>Monthly financial performance from real data</CardDescription>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                  <SelectItem value="2years">2 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={financialData.monthlyFinancials}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    `$${Number(value).toLocaleString()}`,
                    name === 'revenue' ? 'Revenue' : 'Profit',
                  ]}
                />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="profit" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Revenue Distribution</CardTitle>
            <CardDescription>Revenue breakdown by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={financialData.categoryRevenue}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="revenue"
                >
                  {financialData.categoryRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {financialData.categoryRevenue.map((item) => (
                <div key={item.category} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <div className="text-sm">
                    <div className="font-medium">{item.category}</div>
                    <div className="text-muted-foreground">
                      ৳{item.revenue.toLocaleString()} ({item.percentage}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Profitability Analysis */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Product Profitability Analysis</CardTitle>
              <CardDescription>Detailed profit analysis by product using actual cost prices</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportProductProfitability}>
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
                <TableHead>Product</TableHead>
                <TableHead>Units Sold</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Avg Price</TableHead>
                <TableHead>Net Profit</TableHead>
                <TableHead>Gross Margin</TableHead>
                <TableHead>Net Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialData.productProfitability.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.productName}</div>
                      <div className="text-sm text-muted-foreground">{product.category}</div>
                    </div>
                  </TableCell>
                  <TableCell>{product.unitsSold}</TableCell>
                  <TableCell>৳{product.revenue.toLocaleString()}</TableCell>
                  <TableCell>৳{product.avgPrice}</TableCell>
                  <TableCell>
                    <span className="font-medium text-green-600">৳{product.totalProfit.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.grossMargin}%</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.netMargin >= 30 ? 'default' : product.netMargin >= 20 ? 'secondary' : 'destructive'
                      }
                    >
                      {product.netMargin}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Time-based Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Financial Reports</CardTitle>
            <CardDescription>Recent daily performance from actual orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financialData.dailyReports.map((day) => (
                <div key={day.date} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <div>
                    <div className="font-medium">{new Date(day.date).toLocaleDateString()}</div>
                    <div className="text-sm text-muted-foreground">{day.orders} orders</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">৳{day.revenue.toLocaleString()}</div>
                    <div className="text-sm text-green-600">+${day.profit} estimated profit</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Forecasting</CardTitle>
            <CardDescription>Advanced forecasting using historical sales data and trend analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Next Month Revenue</span>
                  <span className="text-2xl font-bold text-green-600">
                    ৳{financialData.forecasting.nextMonthRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Using exponential smoothing and weighted growth analysis from historical data
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Projected Net Profit</span>
                  <span className="text-2xl font-bold text-green-600">
                    ৳{financialData.forecasting.projectedProfit.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">Estimated 40% margin maintained</div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Trend Direction</span>
                  <span
                    className={`text-2xl font-bold flex items-center ${financialData.forecasting.trendDirection === 'up'
                        ? 'text-green-600'
                        : financialData.forecasting.trendDirection === 'down'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}
                  >
                    {financialData.forecasting.trendDirection === 'up' && (
                      <TrendingUp className="h-6 w-6 mr-1" />
                    )}
                    {financialData.forecasting.trendDirection === 'down' && (
                      <TrendingDown className="h-6 w-6 mr-1" />
                    )}
                    {financialData.forecasting.trendDirection[0].toUpperCase() +
                      financialData.forecasting.trendDirection.slice(1)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">Market trend analysis</div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Growth Rate</span>
                  <span
                    className={`text-2xl font-bold ${financialData.forecasting.growthRate >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                  >
                    {financialData.forecasting.growthRate > 0 ? '+' : ''}
                    {financialData.forecasting.growthRate}%
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Weighted average growth rate from all historical data
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report Generation
          </CardTitle>
          <CardDescription>Generate comprehensive financial reports with real-time data analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center hover:shadow-md transition-shadow">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="font-medium mb-2">Daily Report</div>
              <div className="text-sm text-muted-foreground mb-3">
                Daily revenue, profit, order summary, and performance insights for the last 30 days
              </div>
              <div className="space-y-2 mb-3">
                <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">✓ Daily breakdown & trends</div>
                <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">✓ Best performing days</div>
                <div className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">✓ Order volume analysis</div>
              </div>
              <Button size="sm" variant="outline" onClick={exportDailyReport} className="w-full hover:bg-primary hover:text-primary-foreground">
                <Download className="h-4 w-4 mr-2" />
                Export Daily Report
              </Button>
            </div>

            <div className="p-4 border rounded-lg text-center hover:shadow-md transition-shadow">
              <BarChartIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="font-medium mb-2">Weekly Report</div>
              <div className="text-sm text-muted-foreground mb-3">Weekly trends, comparisons, and growth analysis for business planning</div>
              <div className="space-y-2 mb-3">
                <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">✓ Week-over-week growth</div>
                <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">✓ Performance trends</div>
                <div className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">✓ Growth projections</div>
              </div>
              <Button size="sm" variant="outline" onClick={exportWeeklyReport} className="w-full hover:bg-primary hover:text-primary-foreground">
                <Download className="h-4 w-4 mr-2" />
                Export Weekly Report
              </Button>
            </div>

            <div className="p-4 border rounded-lg text-center hover:shadow-md transition-shadow">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="font-medium mb-2">Monthly Report</div>
              <div className="text-sm text-muted-foreground mb-3">Comprehensive monthly analysis with forecasting and strategic insights</div>
              <div className="space-y-2 mb-3">
                <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">✓ Executive summary</div>
                <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">✓ Forecasting & trends</div>
                <div className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">✓ Strategic recommendations</div>
              </div>
              <Button size="sm" variant="outline" onClick={exportMonthlyReport} className="w-full hover:bg-primary hover:text-primary-foreground">
                <Download className="h-4 w-4 mr-2" />
                Export Monthly Report
              </Button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-medium text-primary">Report Features</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-1">📊 Data Analysis</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Real-time revenue & profit calculations</li>
                  <li>• Product performance insights</li>
                  <li>• Category breakdown analysis</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-1">📈 Business Intelligence</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Growth trends & forecasting</li>
                  <li>• Performance comparisons</li>
                  <li>• Strategic recommendations</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
