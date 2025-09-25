"use client"

import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Heart, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-gradient-to-br from-[#8B5446] via-[#9a5f52] to-[#8B5446] text-white relative overflow-hidden mt-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f2c9c7]/5 to-transparent animate-shimmer opacity-30 pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#f2c9c7]/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#f2c9c7]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

      {/* Newsletter Section with glassmorphism */}
      <div className="border-b border-[#f2c9c7]/20 relative backdrop-blur-sm">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in-up">
              <Sparkles className="w-8 h-8 text-[#f2c9c7] animate-pulse" />
              <h3 className="text-4xl md:text-5xl font-bold text-[#c66074]-white tracking-tight">Stay in Style</h3>
              <Sparkles className="w-8 h-8 text-[#f2c9c7] animate-pulse" />
            </div>
            <p className="text-[#f2c9c7]/90 mb-10 text-lg leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Input
                placeholder="Enter your email address"
                className="glass-morphism-white border-[#f2c9c7]/30 text-white placeholder-[#f2c9c7]/70 py-4 px-6 text-base focus:border-[#f2c9c7] transition-all duration-300 rounded-full flex-1"
              />
              <Button className="btn-sexy hover-glow font-medium tracking-wide py-4 px-8 text-lg">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-3xl font-bold tracking-wider text-[#c66074]-white">ELAROSE</h3>
              <Heart className="w-6 h-6 text-[#f2c9c7] animate-pulse" />
            </div>
            <p className="text-[#f2c9c7]/90 mb-8 leading-relaxed text-lg">
              Defining modern femininity through timeless elegance and contemporary style that empowers every woman.
            </p>
            <div className="flex space-x-4">
              <Button size="icon" variant="ghost" className="glass-morphism hover-glow rounded-full w-12 h-12 transition-all duration-300 hover:scale-110">
                <Facebook className="h-6 w-6 text-[#f2c9c7]" />
              </Button>
              <Button size="icon" variant="ghost" className="glass-morphism hover-glow rounded-full w-12 h-12 transition-all duration-300 hover:scale-110">
                <Instagram className="h-6 w-6 text-[#f2c9c7]" />
              </Button>
              <Button size="icon" variant="ghost" className="glass-morphism hover-glow rounded-full w-12 h-12 transition-all duration-300 hover:scale-110">
                <Twitter className="h-6 w-6 text-[#f2c9c7]" />
              </Button>
              <Button size="icon" variant="ghost" className="glass-morphism hover-glow rounded-full w-12 h-12 transition-all duration-300 hover:scale-110">
                <Youtube className="h-6 w-6 text-[#f2c9c7]" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h4 className="font-semibold mb-6 text-xl tracking-wide text-[#f2c9c7]">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/new-arrivals" className="text-[#f2c9c7]/80 hover:text-white transition-all duration-300 hover:translate-x-1 block hover-lift">New Arrivals</Link></li>
              <li><Link href="/products" className="text-[#f2c9c7]/80 hover:text-white transition-all duration-300 hover:translate-x-1 block hover-lift">Best Sellers</Link></li>
              <li><Link href="/products" className="text-[#f2c9c7]/80 hover:text-white transition-all duration-300 hover:translate-x-1 block hover-lift">Sale</Link></li>
              <li><Link href="/about" className="text-[#f2c9c7]/80 hover:text-white transition-all duration-300 hover:translate-x-1 block hover-lift">About Us</Link></li>
              <li><Link href="/contact" className="text-[#f2c9c7]/80 hover:text-white transition-all duration-300 hover:translate-x-1 block hover-lift">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h4 className="font-semibold mb-6 text-xl tracking-wide text-[#f2c9c7]">Customer Service</h4>
            <ul className="space-y-4">
              <li><Link href="/contact" className="text-[#f2c9c7]/80 hover:text-white transition-all duration-300 hover:translate-x-1 block hover-lift">Contact Us</Link></li>
              <li><Link href="/contact" className="text-[#f2c9c7]/80 hover:text-white transition-all duration-300 hover:translate-x-1 block hover-lift">Size Guide</Link></li>
              <li><Link href="/contact" className="text-[#f2c9c7]/80 hover:text-white transition-all duration-300 hover:translate-x-1 block hover-lift">Shipping Info</Link></li>
              <li><Link href="/contact" className="text-[#f2c9c7]/80 hover:text-white transition-all duration-300 hover:translate-x-1 block hover-lift">Returns & Exchanges</Link></li>
              <li><Link href="/contact" className="text-[#f2c9c7]/80 hover:text-white transition-all duration-300 hover:translate-x-1 block hover-lift">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h4 className="font-semibold mb-6 text-xl tracking-wide text-[#f2c9c7]">Get in Touch</h4>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 group cursor-pointer">
                <div className="glass-morphism p-3 rounded-full group-hover:bg-[#f2c9c7]/30 transition-all duration-300 hover-glow">
                  <Phone className="h-5 w-5 text-[#f2c9c7]" />
                </div>
                <span className="text-[#f2c9c7]/80 group-hover:text-white transition-colors duration-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-4 group cursor-pointer">
                <div className="glass-morphism p-3 rounded-full group-hover:bg-[#f2c9c7]/30 transition-all duration-300 hover-glow">
                  <Mail className="h-5 w-5 text-[#f2c9c7]" />
                </div>
                <span className="text-[#f2c9c7]/80 group-hover:text-white transition-colors duration-300">hello@elarose.com</span>
              </div>
              <div className="flex items-start space-x-4 group cursor-pointer">
                <div className="glass-morphism p-3 rounded-full group-hover:bg-[#f2c9c7]/30 transition-all duration-300 hover-glow">
                  <MapPin className="h-5 w-5 text-[#f2c9c7]" />
                </div>
                <span className="text-[#f2c9c7]/80 group-hover:text-white transition-colors duration-300 leading-relaxed">
                  123 Fashion Avenue<br />
                  New York, NY 10001<br />
                  United States
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer with enhanced styling */}
      <div className="border-t border-[#f2c9c7]/20 relative backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-[#f2c9c7]/90 text-base flex items-center gap-2">
              © 2025 ELAROSE. All rights reserved. Made with 
              <Heart className="w-4 h-4 text-[#f2c9c7] animate-pulse" /> 
              for fashion lovers.
            </p>
            <div className="flex space-x-8">
              <a href="#" className="text-[#f2c9c7]/80 hover:text-white text-base transition-all duration-300 hover-lift">
                Privacy Policy
              </a>
              <a href="#" className="text-[#f2c9c7]/80 hover:text-white text-base transition-all duration-300 hover-lift">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}