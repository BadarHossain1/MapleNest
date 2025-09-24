'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Search, Heart, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/SearchBar';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isGuidesOpen, setIsGuidesOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/buy', label: 'Buy' },
    { href: '/rent', label: 'Rent' },
    { href: '/new-projects', label: 'New Projects' },
    { href: '/commercial', label: 'Commercial' },
    { href: '/areas', label: 'Areas' },
    { href: '/agents', label: 'Agents' },
    { href: '/agent-portal', label: 'Agent Portal' },
    { href: '/mortgage', label: 'Mortgage' },
  ];

  const guidesItems = [
    { href: '/area-guides', label: 'Area Guides' },
    { href: '/building-guides', label: 'Building Guides' },
    { href: '/school-guides', label: 'School Guides' },
  ];

  return (
    <motion.header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100'
          : 'bg-white'
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-10 h-10 bg-emerald-500 rounded-lg group-hover:bg-emerald-600 transition-colors">
              <Home className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">MapleNest</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors relative',
                  pathname === item.href
                    ? 'text-emerald-600'
                    : 'text-gray-700 hover:text-emerald-600'
                )}
              >
                {item.label}
                {pathname === item.href && (
                  <motion.div
                    className="absolute -bottom-8 left-0 right-0 h-0.5 bg-emerald-600"
                    layoutId="activeNav"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            {/* Guides Dropdown */}
            <div className="relative">
              <button
                className={cn(
                  'flex items-center gap-1 text-sm font-medium transition-colors relative',
                  pathname.startsWith('/area-guides') || pathname.startsWith('/building-guides') || pathname.startsWith('/school-guides')
                    ? 'text-emerald-600'
                    : 'text-gray-700 hover:text-emerald-600'
                )}
                onMouseEnter={() => setIsGuidesOpen(true)}
                onMouseLeave={() => setIsGuidesOpen(false)}
              >
                Guides
                <ChevronDown className="h-4 w-4" />
                {(pathname.startsWith('/area-guides') || pathname.startsWith('/building-guides') || pathname.startsWith('/school-guides')) && (
                  <motion.div
                    className="absolute -bottom-8 left-0 right-0 h-0.5 bg-emerald-600"
                    layoutId="activeNav"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>

              {isGuidesOpen && (
                <motion.div
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onMouseEnter={() => setIsGuidesOpen(true)}
                  onMouseLeave={() => setIsGuidesOpen(false)}
                >
                  {guidesItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'block px-4 py-2 text-sm transition-colors',
                        pathname === item.href
                          ? 'text-emerald-600 bg-emerald-50'
                          : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/saved" className="p-2 text-gray-600 hover:text-emerald-600 transition-colors">
              <Heart className="h-5 w-5" />
            </Link>
            <Button variant="outline">Contact</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          className="lg:hidden bg-white border-t border-gray-100"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 py-6">
            <nav className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'block py-2 text-base font-medium transition-colors',
                    pathname === item.href
                      ? 'text-emerald-600'
                      : 'text-gray-700 hover:text-emerald-600'
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Guides Section */}
              <div className="pt-4 border-t border-gray-100">
                <div className="text-sm font-semibold text-gray-900 mb-2">Guides</div>
                {guidesItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'block py-2 pl-4 text-base font-medium transition-colors',
                      pathname === item.href
                        ? 'text-emerald-600'
                        : 'text-gray-700 hover:text-emerald-600'
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
              <Link
                href="/saved"
                className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="h-5 w-5" />
                <span>Saved Properties</span>
              </Link>
              <Button className="w-full">Contact Us</Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}