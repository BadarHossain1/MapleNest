import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  Megaphone,
  MessageSquare,
  BarChart3,
  Menu,
  X,
  ArrowLeft,
  Plus,
  AlertTriangle,
  Grid3X3,
  FolderOpen,
  ClipboardList,
  Ticket
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

// Import CRM components
import Dashboard from './Dashboard';
import CustomerManagement from './CustomerManagement';
import OrderManagement from './OrderManagement';
import SalesTracking from './SalesTracking';
import InventoryManagement from './InventoryManagement';
import FinancialAnalysis from './FinancialAnalysis';
import MarketingCampaigns from './MarketingCampaigns';
import CustomerSupport from './CustomerSupport';
import Analytics from './Analytics';
import AddProducts from './AddProducts';
import AddCategories from './AddCategories';
import AllProducts from './AllProducts';
import AllCategories from './AllCategories';
import DiscountManagement from './DiscountManagement';
import ContactManagement from './ContactManagement';

export default function DashboardPortal() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();

  // Check if screen is mobile size - moved to top to avoid conditional hooks
  React.useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      // Auto-open sidebar on desktop, keep closed on mobile
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p>Loading dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Double-check admin access (security layer)
  if (!isLoggedIn || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-xl">Unauthorized Access</CardTitle>
            <CardDescription>
              Access denied. Admin privileges required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customer Management', icon: Users },
    { id: 'orders', label: 'Order Management', icon: ClipboardList },
    { id: 'sales', label: 'Sales Tracking', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory Management', icon: Package },
    { id: 'allProducts', label: 'All Products', icon: Grid3X3 },
    { id: 'allCategories', label: 'All Categories', icon: FolderOpen },
    { id: 'addProducts', label: 'Add Products', icon: Plus },
    { id: 'addCategories', label: 'Add Categories', icon: Plus },
    { id: 'discounts', label: 'Discount Management', icon: Ticket },
    { id: 'contacts', label: 'Contact Management', icon: MessageSquare },
    { id: 'financial', label: 'Financial Analysis', icon: DollarSign },
    { id: 'marketing', label: 'Marketing Campaigns', icon: Megaphone },
    { id: 'support', label: 'Customer Support', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="p-6">
            <Dashboard />
          </div>
        );
      case 'customers':
        return (
          <div className="p-6">
            <CustomerManagement />
          </div>
        );
      case 'orders':
        return (
          <div className="p-6">
            <OrderManagement />
          </div>
        );
      case 'sales':
        return (
          <div className="p-6">
            <SalesTracking />
          </div>
        );
      case 'inventory':
        return (
          <div className="p-6">
            <InventoryManagement />
          </div>
        );
      case 'allProducts':
        return <AllProducts />;
      case 'allCategories':
        return <AllCategories />;
      case 'addProducts':
        return <AddProducts />;
      case 'addCategories':
        return <AddCategories />;
      case 'discounts':
        return (
          <div className="p-6">
            <DiscountManagement />
          </div>
        );
      case 'contacts':
        return <ContactManagement />;
      case 'financial':
        return (
          <div className="p-6">
            <FinancialAnalysis />
          </div>
        );
      case 'marketing':
        return (
          <div className="p-6">
            <MarketingCampaigns />
          </div>
        );
      case 'support':
        return (
          <div className="p-6">
            <CustomerSupport />
          </div>
        );
      case 'analytics':
        return (
          <div className="p-6">
            <Analytics />
          </div>
        );
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">Welcome to Admin Dashboard</h1>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Store</span>
            </Button>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">ELAROSE Admin Dashboard</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="z-10 relative"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Mobile Overlay */}
        {sidebarOpen && isMobile && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          ${isMobile
            ? 'fixed inset-y-0 left-0 z-50'
            : 'relative flex-shrink-0'
          }
          bg-white border-r border-gray-200 shadow-lg
          transition-all duration-300 ease-in-out
          ${sidebarOpen
            ? 'w-64'
            : isMobile
              ? 'w-64 -translate-x-full'
              : 'w-0 overflow-hidden'
          }
        `}>
          <div className={`h-full flex flex-col ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 min-w-64">
              <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto min-w-64">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    // Close sidebar only on mobile after selection
                    if (isMobile) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-lg
                    text-left transition-colors duration-200
                    ${activeView === item.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 min-h-screen ${isMobile ? 'w-full' : 'transition-all duration-300'}`}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
