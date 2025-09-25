"use client"

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
  Ticket,
  Sparkles,
  Zap,
  Star,
  Crown,
  Heart,
  TrendingUp,
  Eye
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

export default function SexyDashboardPortal() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();

  // Check if screen is mobile size
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

  // Show sexy loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#f2c9c7]/10 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f2c9c7]/5 to-transparent animate-shimmer opacity-30"></div>
        <div className="absolute top-20 right-10 w-64 h-64 bg-[#f2c9c7]/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#f2c9c7]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="card-sexy p-12 text-center max-w-md animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Crown className="w-12 h-12 text-[#f2c9c7] animate-pulse" />
            <Sparkles className="w-8 h-8 text-[#f2c9c7] animate-pulse" style={{ animationDelay: '0.5s' }} />
            <Zap className="w-10 h-10 text-[#f2c9c7] animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <h2 className="text-2xl font-bold text-[#c66074] mb-4">Loading Admin Portal</h2>
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#f2c9c7]/20 border-t-[#f2c9c7] rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-[#e8b4b1] rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
          </div>
          <p className="text-gray-600">Preparing your dashboard...</p>
        </div>
      </div>
    );
  }

  // Sexy unauthorized access page
  if (!isLoggedIn || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#f2c9c7]/10 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-100/20 to-transparent animate-shimmer opacity-30"></div>
        <div className="absolute top-20 right-10 w-64 h-64 bg-red-100/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-red-100/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="card-sexy p-12 text-center max-w-md animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-8">
            <AlertTriangle className="w-16 h-16 text-red-500 animate-pulse" />
            <Sparkles className="w-8 h-8 text-red-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Oops! You need admin superpowers to access this sexy dashboard.
          </p>
          <Button
            onClick={() => router.push('/')}
            className="btn-sexy hover-glow group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: '#f2c9c7' },
    { id: 'customers', label: 'Customer Management', icon: Users, color: '#e8b4b1' },
    { id: 'orders', label: 'Order Management', icon: ClipboardList, color: '#d4a4a1' },
    { id: 'sales', label: 'Sales Tracking', icon: ShoppingCart, color: '#f2c9c7' },
    { id: 'inventory', label: 'Inventory Management', icon: Package, color: '#e8b4b1' },
    { id: 'allProducts', label: 'All Products', icon: Grid3X3, color: '#d4a4a1' },
    { id: 'allCategories', label: 'All Categories', icon: FolderOpen, color: '#f2c9c7' },
    { id: 'addProducts', label: 'Add Products', icon: Plus, color: '#e8b4b1' },
    { id: 'addCategories', label: 'Add Categories', icon: Plus, color: '#d4a4a1' },
    { id: 'discounts', label: 'Discount Management', icon: Ticket, color: '#f2c9c7' },
    { id: 'contacts', label: 'Contact Management', icon: MessageSquare, color: '#e8b4b1' },
    { id: 'financial', label: 'Financial Analysis', icon: DollarSign, color: '#d4a4a1' },
    { id: 'marketing', label: 'Marketing Campaigns', icon: Megaphone, color: '#f2c9c7' },
    { id: 'support', label: 'Customer Support', icon: Heart, color: '#e8b4b1' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: '#d4a4a1' },
  ];

  const renderContent = () => {
    const contentComponents = {
      dashboard: <Dashboard />,
      customers: <CustomerManagement />,
      orders: <OrderManagement />,
      sales: <SalesTracking />,
      inventory: <InventoryManagement />,
      allProducts: <AllProducts />,
      allCategories: <AllCategories />,
      addProducts: <AddProducts />,
      addCategories: <AddCategories />,
      discounts: <DiscountManagement />,
      contacts: <ContactManagement />,
      financial: <FinancialAnalysis />,
      marketing: <MarketingCampaigns />,
      support: <CustomerSupport />,
      analytics: <Analytics />
    };

    const Component = contentComponents[activeView];

    return (
      <div className="p-6 animate-fade-in-up relative">
        {/* Content Background Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#f2c9c7]/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          {Component}
        </div>
      </div>
    );
  };

  const currentNavItem = navigationItems.find(item => item.id === activeView);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f2c9c7]/3 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f2c9c7]/5 to-transparent animate-shimmer opacity-20 pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#f2c9c7]/5 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-[#e8b4b1]/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '3s' }}></div>

      <div className="flex h-screen relative">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed lg:relative lg:translate-x-0 inset-y-0 left-0 z-50 w-80 bg-white/90 backdrop-blur-lg border-r border-[#f2c9c7]/30 shadow-2xl transition-transform duration-500 ease-out flex flex-col`}>

          {/* Sidebar Header */}
          <div className="p-6 border-b border-[#f2c9c7]/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f2c9c7]/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#f2c9c7] to-[#e8b4b1] rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-[#c66074]">Admin Portal</h1>
                    <p className="text-sm text-gray-600">Management Dashboard</p>
                  </div>
                </div>

                <Button
                  onClick={() => setSidebarOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="lg:hidden glass-morphism hover-glow rounded-full p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Welcome Message */}
              <div className="glass-morphism rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-[#f2c9c7]" />
                  <span className="text-sm font-semibold text-gray-700">Welcome back!</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{user?.name || user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-[#f2c9c7]/30 scrollbar-track-transparent">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              const isHovered = hoveredItem === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    if (isMobile) setSidebarOpen(false);
                  }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`w-full text-left p-4 rounded-2xl transition-all duration-300 group animate-fade-in-up hover-lift ${isActive
                      ? 'bg-gradient-to-r from-[#f2c9c7] to-[#e8b4b1] text-white shadow-lg animate-pulse-glow'
                      : 'glass-morphism hover-glow hover:scale-105'
                    }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`relative ${isActive ? 'animate-pulse' : ''}`}>
                      <Icon className={`h-6 w-6 transition-all duration-300 ${isActive
                          ? 'text-white scale-110'
                          : `group-hover:scale-110`
                        }`} style={{ color: !isActive && isHovered ? item.color : undefined }} />

                      {/* Animated ring effect */}
                      {(isActive || isHovered) && (
                        <div className="absolute -inset-2 border-2 border-current rounded-full animate-ping opacity-30"></div>
                      )}
                    </div>

                    <div className="flex-1">
                      <span className={`font-semibold text-sm transition-colors duration-300 ${isActive
                          ? 'text-white'
                          : 'text-gray-700 group-hover:text-gray-900'
                        }`}>
                        {item.label}
                      </span>
                      {isActive && (
                        <div className="flex items-center gap-1 mt-1">
                          <Sparkles className="w-3 h-3 text-white/80 animate-pulse" />
                          <span className="text-xs text-white/80">Active</span>
                        </div>
                      )}
                    </div>

                    {/* Arrow indicator */}
                    {isActive && (
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    )}
                  </div>

                  {/* Animated underline */}
                  <div className={`h-0.5 bg-gradient-to-r from-white to-transparent transition-all duration-300 rounded-full mt-2 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></div>
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-[#f2c9c7]/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#f2c9c7]/5 to-transparent"></div>
            <div className="relative z-10">
              <Button
                onClick={() => router.push('/')}
                variant="ghost"
                className="w-full justify-start glass-morphism hover-glow group rounded-2xl p-4"
              >
                <ArrowLeft className="h-5 w-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Website</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top Header */}
          <header className="card-sexy m-4 mb-0 rounded-3xl p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#f2c9c7]/5 to-[#e8b4b1]/5"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setSidebarOpen(true)}
                  variant="ghost"
                  size="sm"
                  className="lg:hidden glass-morphism hover-glow rounded-full p-2"
                >
                  <Menu className="h-6 w-6" />
                </Button>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#f2c9c7] to-[#e8b4b1] rounded-xl flex items-center justify-center animate-pulse-glow">
                    {currentNavItem && <currentNavItem.icon className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#c66074]">
                      {currentNavItem?.label || 'Dashboard'}
                    </h2>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">Live Data</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 glass-morphism rounded-full px-4 py-2">
                  <TrendingUp className="w-4 h-4 text-[#f2c9c7]" />
                  <span className="text-sm font-semibold text-gray-700">Performance: Excellent</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-[#f2c9c7] fill-current" />
                    ))}
                  </div>
                </div>

                <div className="w-10 h-10 bg-gradient-to-br from-[#f2c9c7] to-[#e8b4b1] rounded-full flex items-center justify-center text-white font-bold hover-lift cursor-pointer">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
                </div>
              </div>
            </div>
          </header>

          {/* Content Container */}
          <div className="flex-1 card-sexy m-4 mt-4 rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-[#f2c9c7]/2 to-white"></div>
            <div className="relative z-10 h-full overflow-y-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}