"use client"

import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Link from 'next/link';

export function TopCollections() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch top collection products
  useEffect(() => {
    const fetchTopCollectionProducts = async () => {
      try {
        setLoading(true);
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://elarose-server.onrender.com';
        const response = await fetch(`${apiUrl}/api/products?topCollection=true&limit=8&sortBy=createdAt&sortOrder=desc`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError('Failed to fetch top collection products');
        }
      } catch (error) {
        console.error('Error fetching top collection products:', error);
        setError('Network error while fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchTopCollectionProducts();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="py-20 px-4 bg-white mb-10">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-light mb-4 text-[#8B5446] tracking-tight">Top Collections</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Loading our curated collection of top products...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl border border-[#f2c9c7]/10">
                  <div className="bg-gradient-to-br from-[#f2c9c7]/20 to-[#f2c9c7]/10 h-80 rounded-t-2xl"></div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="h-6 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/10 rounded"></div>
                      <div className="h-4 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/10 rounded w-3/4"></div>
                    </div>
                    <div className="h-12 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/10 rounded"></div>
                    <div className="h-12 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/10 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-20 px-4 bg-white mb-10">
        <div className="container mx-auto text-center animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-light mb-4 text-[#8B5446] tracking-tight">Top Collections</h2>
          <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-2xl p-8">
            <div className="text-red-600 text-lg mb-4">⚠️ {error}</div>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-white mb-10">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-[#8B5446] tracking-tight">
            Top Collections
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            Discover our most coveted pieces, handpicked by our style experts and loved by fashion enthusiasts worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={product._id}
              className="group animate-slide-up hover:shadow-2xl transition-all duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg border border-[#f2c9c7]/10 hover:-translate-y-3 transition-all duration-500">
                <div className="relative h-80 overflow-hidden">
                  <ImageWithFallback
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="absolute top-4 right-4 transform translate-x-10 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Button
                      size="icon"
                      className="bg-[#f2c9c7] hover:bg-[#8B5446] text-[#8B5446] hover:text-white rounded-full shadow-lg"
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <Link href={`/product/${product._id}`}>
                      <Button className="w-full bg-[#8B5446] hover:bg-[#f2c9c7] hover:text-[#8B5446] text-white transition-all duration-300">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-[#8B5446] mb-1 group-hover:text-[#f2c9c7] transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground capitalize font-medium">
                      {product.categoryName}
                    </p>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-[#8B5446]">
                          ${product.price?.current}
                        </span>
                        {product.price?.original && product.price.original > product.price.current && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.price.original}
                          </span>
                        )}
                      </div>
                      {product.price?.original && product.price.original > product.price.current && (
                        <div className="text-xs text-[#f2c9c7] font-medium">
                          Save ${(product.price.original - product.price.current).toFixed(2)}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">
                        Added {new Date(product.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && !loading && !error && (
          <div className="text-center py-16 animate-fade-in">
            <div className="max-w-md mx-auto">
              <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-[#f2c9c7]" />
              <h3 className="text-xl font-semibold text-[#8B5446] mb-3">No Collections Yet</h3>
              <p className="text-muted-foreground mb-6">
                Our top collections will appear here soon. Stay tuned for amazing products!
              </p>
              <Link href="/products">
                <Button className="bg-[#8B5446] hover:bg-[#f2c9c7] hover:text-[#8B5446] text-white">
                  Browse All Products
                </Button>
              </Link>
            </div>
          </div>
        )}

        {products.length > 0 && (
          <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '800ms' }}>
            <Link href="/products">
              <Button 
                size="lg" 
                variant="outline"
                className="border-[#8B5446] text-[#8B5446] hover:bg-[#8B5446] hover:text-white px-8 py-3 text-base transition-all duration-300 hover:scale-105"
              >
                Explore All Collections
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}