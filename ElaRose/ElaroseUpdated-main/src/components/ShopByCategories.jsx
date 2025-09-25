"use client"

import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function ShopByCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://elarose-server.onrender.com';
        const response = await fetch(`${apiUrl}/api/categories`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setCategories(result.data);
        } else {
          setError('Failed to load categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Network error loading categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-white via-[#f2c9c7]/10 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-[#c66074] animate-pulse" />
              <p className="text-4xl md:text-5xl font-bold text-[#c66074]">Shop by Categories</p>
              <Sparkles className="w-8 h-8 text-[#c66074] animate-pulse" />
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Discover your perfect style across our curated collections
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square bg-gradient-to-br from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-2xl mb-3 loading-shimmer"></div>
                <div className="h-4 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full mb-2 loading-shimmer"></div>
                <div className="h-3 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full w-3/4 loading-shimmer"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-white via-[#f2c9c7]/10 to-white">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-[#c66074]" />
              <h2 className="text-4xl md:text-5xl font-bold text-[#c66074]">Shop by Categories</h2>
              <Sparkles className="w-8 h-8 text-[#c66074]" />
            </div>
            <p className="text-red-600 mb-6 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-sexy hover-glow"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-white via-[#f2c9c7]/5 to-white overflow-hidden">
      <div className="container mx-auto mb-20">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in-up">
            <Sparkles className="w-8 h-8 text-[#c66074] animate-pulse" />
            <h2 className="text-4xl md:text-6xl font-bold text-[#c66074]">
              Shop by Categories
            </h2>
            <Sparkles className="w-8 h-8 text-[#c66074] animate-pulse" />
          </div>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Discover your perfect style across our curated collections
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {categories.map((category, index) => (
            <Link key={category._id} href={`/category/${category.slug}`}>
              <div
                className="group cursor-pointer card-sexy hover-lift transform-gpu will-change-transform animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-[#f2c9c7]/10 to-[#f2c9c7]/5 mb-4 group-hover:shadow-2xl transition-all duration-500">
                  <ImageWithFallback
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 group-hover:rotate-1"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#f2c9c7]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#f2c9c7]/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                  {/* Hover overlay with arrow */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg animate-pulse">
                      <ArrowRight className="w-6 h-6 text-[#c66074]" />
                    </div>
                  </div>

                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 animate-shimmer"></div>
                </div>

                <div className="text-center">
                  <h3 className="font-semibold mb-2 text-[#8B5446] group-hover:text-[#c66074] transition-colors duration-300 text-lg">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground group-hover:text-[#c66074]/80 transition-colors duration-300">
                    {category.itemCount || 'Many'} items
                  </p>

                  {/* Animated underline */}
                  <div className="w-0 h-0.5 bg-gradient-to-r from-[#f2c9c7] to-[#e8b4b1] mx-auto mt-2 group-hover:w-full transition-all duration-300 rounded-full"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}