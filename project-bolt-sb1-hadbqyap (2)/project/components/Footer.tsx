'use client';

import Link from 'next/link';
import { Home, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-emerald-500 rounded-lg">
                <Home className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">MapleNest</span>
            </div>
            <p className="text-gray-400 mb-6">
              Find your perfect home across Canada. Discover exceptional properties 
              in Toronto, Vancouver, Montreal, Calgary, and Ottawa.
            </p>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="h-4 w-4" />
              <span>Serving Canada Coast to Coast</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/buy" className="text-gray-400 hover:text-white transition-colors">Buy</Link></li>
              <li><Link href="/rent" className="text-gray-400 hover:text-white transition-colors">Rent</Link></li>
              <li><Link href="/commercial" className="text-gray-400 hover:text-white transition-colors">Commercial</Link></li>
              <li><Link href="/mortgage" className="text-gray-400 hover:text-white transition-colors">Mortgage Calculator</Link></li>
              <li><Link href="/areas" className="text-gray-400 hover:text-white transition-colors">Neighborhood Guides</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/agents" className="text-gray-400 hover:text-white transition-colors">Find an Agent</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Market Insights</Link></li>
              <li><Link href="/saved" className="text-gray-400 hover:text-white transition-colors">Saved Properties</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="h-4 w-4" />
                <span>1-800-MAPLE-NEST</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="h-4 w-4" />
                <span>hello@maplenest.ca</span>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-gray-400 text-sm mb-4">
                Subscribe to our newsletter for market updates and new listings.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} MapleNest. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/accessibility" className="text-gray-400 hover:text-white transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}