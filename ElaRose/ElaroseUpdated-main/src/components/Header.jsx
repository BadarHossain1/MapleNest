"use client"

import { useState, useEffect } from 'react';
import { Heart, ShoppingBag, User, Menu, LogOut, UserCircle, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import { useUser, useClerk } from '@clerk/nextjs';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useDiscounts } from '@/hooks/useDiscounts';
import DiscountBanner from './DiscountBanner';
import Link from 'next/link';

export default function Header() {
  const router = useRouter();
  const { user } = useUser();
  const { user: authUser, isLoggedIn, isLoading } = useAuth();
  const { signOut } = useClerk();
  const { clearUserData: clearCartData } = useCart();
  const { clearUserData: clearWishlistData } = useWishlist();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  // Use the custom discount hook
  const { activeDiscounts, currentDiscountIndex, loading: discountLoading, getCurrentDiscountMessage } = useDiscounts();

  // Check if user is admin using MongoDB role data
  const isAdmin = authUser?.role === 'admin';

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debug logging for user object
  useEffect(() => {
    if (authUser) {
      console.log('Current authUser:', authUser);
      console.log('User role:', authUser.role);
      console.log('Is admin:', isAdmin);
    }
  }, [authUser, isAdmin]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://elarose-server.onrender.com';
        console.log('Fetching categories from:', `${apiUrl}/api/categories`);
        const response = await fetch(`${apiUrl}/api/categories`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Categories API response:', result);

        if (result.success) {
          console.log('All categories from API:', result.data);
          // Try different filtering approaches
          const activeCategories = result.data.filter(cat => cat.status === 'active');
          const allCategories = result.data;
          console.log('Active categories (status=active):', activeCategories);
          console.log('All categories regardless of status:', allCategories);

          // Use all categories if no active ones found
          const categoriesToUse = activeCategories.length > 0 ? activeCategories : allCategories;
          setCategories(categoriesToUse);
        } else {
          console.error('Failed to fetch categories:', result.message);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);



  const handleUserIconClick = () => {
    if (user) {
      router.push('/account');
    } else {
      router.push('/login');
    }
  };

  const handleLogout = async () => {
    // Clear user-specific cart and wishlist data
    clearCartData();
    clearWishlistData();

    await signOut();
    router.push('/');
  };

  return (
    <header className={`w-full sticky top-0 z-50 transition-all duration-500 ${isScrolled
        ? 'backdrop-blur-md bg-white/80 shadow-xl border-b border-[#f2c9c7]/20'
        : 'bg-white/95 border-b border-[#f2c9c7]/10'
      }`}>
      {/* Top banner with gradient animation */}
      <div className="bg-[#c66276] text-white py-2 text-center  relative overflow-hidden">
        {/* <div className="absolute inset-0 animate-shimmer opacity-30"></div> */}
        <p className="text-sm font-medium relative z-10 animate-fade-in-up flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 animate-pulse" />
          {discountLoading ? (
            <span className="animate-pulse">Loading offers...</span>
          ) : (
            <DiscountBanner
              discounts={activeDiscounts}
              currentIndex={currentDiscountIndex}
              message={getCurrentDiscountMessage()}
            />
          )}
          <Sparkles className="w-4 h-4 animate-pulse" />
        </p>
      </div>

      {/* Main header with glassmorphism */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo with animation */}
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="md:hidden mr-2 hover-glow">
              <Menu className="h-6 w-6 text-[#8B5446]" />
            </Button>
            <Link
              href="/"
              className="flex items-center hover:scale-105 transition-all duration-300 tracking-wider animate-float"
              style={{ animationDelay: '1s' }}
            >
              <img
                src="/elaroseLogo.png"
                alt="ELAROSE"
                className="h-8 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Navigation with enhanced hover effects */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/new-arrivals"
              className="text-sm font-medium text-[#8B5446] hover:text-[#f2c9c7] transition-all duration-300 relative group uppercase tracking-wide hover-lift"
            >
              New Arrivals
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#f2c9c7] to-[#e8b4b1] transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
            {!loading && categories.map((category, index) => {
              console.log('Rendering category:', category); // Debug log
              return (
                <Link
                  key={category._id}
                  href={`/category/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm font-medium text-[#8B5446] hover:text-[#f2c9c7] transition-all duration-300 relative group uppercase tracking-wide hover-lift"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {category.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#f2c9c7] to-[#e8b4b1] transition-all duration-300 group-hover:w-full rounded-full"></span>
                </Link>
              );
            })}
            <Link
              href="/about"
              className="text-sm font-medium text-[#8B5446] hover:text-[#f2c9c7] transition-all duration-300 relative group uppercase tracking-wide hover-lift"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#f2c9c7] to-[#e8b4b1] transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-[#8B5446] hover:text-[#f2c9c7] transition-all duration-300 relative group uppercase tracking-wide hover-lift"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#f2c9c7] to-[#e8b4b1] transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
            {authUser && isAdmin && (
              <Link
                href="/admin"
                className="text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 uppercase tracking-wide hover-glow bg-[#c66074] text-white"
              >
                DASHBOARD
              </Link>
            )}
          </nav>

          {/* Icons with enhanced animations */}
          <div className="flex items-center space-x-2">

            {/* User Account Dropdown with glow */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden md:flex glass-morphism hover-glow transition-all duration-300 rounded-full">
                    <UserCircle className="h-6 w-6 text-[#c66074] hover:scale-110 transition-transform duration-300 animate-pulse" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-morphism-white border border-[#f2c9c7]/30 rounded-xl shadow-2xl">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-[#c66074]">{user.firstName || user.username || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.emailAddresses?.[0]?.emailAddress}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#f2c9c7]/20" />
                  <DropdownMenuItem onClick={() => router.push('/account')} className="hover:bg-[#f2c9c7]/10 rounded-lg m-1 transition-all duration-200">
                    <User className="mr-2 h-4 w-4 text-[#f2c9c7]" />
                    <span className="text-[#8B5446]">My Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="hover:bg-[#f2c9c7]/10 rounded-lg m-1 transition-all duration-200">
                    <LogOut className="mr-2 h-4 w-4 text-[#c66074]" />
                    <span className="text-[#c66074]">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" onClick={handleUserIconClick} className="hidden md:flex glass-morphism hover-glow transition-all duration-300 rounded-full">
                <User className="h-6 w-6 text-[#c66074] hover:scale-110 transition-transform duration-300" />
              </Button>
            )}

            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="glass-morphism hover-glow transition-all duration-300 rounded-full group">
                <Heart className="h-6 w-6 text-[#c66074] group-hover:scale-110 group-hover:text-red-500 transition-all duration-300" />
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative glass-morphism hover-glow transition-all duration-300 rounded-full group">
                <ShoppingBag className="h-6 w-6 text-[#c66074] group-hover:scale-110 transition-transform duration-300" />
                
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}