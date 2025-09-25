"use client"

import { useState, useEffect } from 'react';
import { Heart, Star, Sparkles, ShoppingBag, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useWishlist } from '@/hooks/useWishlist';
import Link from 'next/link';

export function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [wishlistStatus, setWishlistStatus] = useState(new Map());

  const { toggleWishlist, isInWishlist: checkIsInWishlist } = useWishlist();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://elarose-server.onrender.com';
        const response = await fetch(`${apiUrl}/api/products?isNewArrival=true&limit=4`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setProducts(result.data);
        } else {
          console.error('Failed to fetch new arrivals:', result.message);
          setError('Failed to load new arrivals');
        }
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
        setError('Network error loading products');
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  // Check wishlist status for all products
  useEffect(() => {
    const checkWishlistStatuses = async () => {
      if (products.length > 0 && checkIsInWishlist) {
        const newWishlistStatus = new Map();

        for (const product of products) {
          try {
            const isInWishlist = await checkIsInWishlist(product._id);
            newWishlistStatus.set(product._id, isInWishlist);
          } catch (error) {
            console.error('Error checking wishlist status for product:', product._id, error);
            newWishlistStatus.set(product._id, false);
          }
        }

        setWishlistStatus(newWishlistStatus);
      }
    };

    checkWishlistStatuses();
  }, [products, checkIsInWishlist]);

  // Calculate average rating for a product
  const getAverageRating = (product) => {
    if (!product.reviews || product.reviews.length === 0) return 0;
    const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / product.reviews.length).toFixed(1);
  };

  // Handle wishlist toggle for a specific product
  const handleWishlistToggle = async (product, event) => {
    event.preventDefault(); // Prevent navigation when clicking wishlist button
    event.stopPropagation(); // Stop event bubbling

    if (toggleWishlist && product) {
      try {
        await toggleWishlist(product);
        // Update local state
        setWishlistStatus(prev => {
          const newStatus = new Map(prev);
          newStatus.set(product._id, !newStatus.get(product._id));
          return newStatus;
        });
      } catch (error) {
        console.error('Error toggling wishlist:', error);
      }
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-white via-[#f2c9c7]/10 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f2c9c7]/5 to-transparent animate-shimmer"></div>
        <div className="container mx-auto relative">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center text-[#c66074] gap-3 mb-6 animate-fade-in-up">
              <Sparkles className="w-8 h-8 text-[#c66074] animate-pulse" />
              <h2 className="text-4xl md:text-6xl font-bold text-[#c66074]">New Arrivals</h2>
              <Sparkles className="w-8 h-8 text-[#c66074] animate-pulse" />
            </div>
            <p className="text-muted-foreground animate-fade-in-up max-w-2xl mx-auto text-lg leading-relaxed" style={{ animationDelay: '0.2s' }}>
              Fresh styles just landed - be the first to shop our newest collection
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="card-sexy animate-pulse animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="aspect-[3/4] bg-gradient-to-br from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-t-3xl loading-shimmer"></div>
                <div className="p-6 space-y-4">
                  <div className="h-5 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full w-3/4 loading-shimmer"></div>
                  <div className="h-4 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full w-1/2 loading-shimmer"></div>
                  <div className="h-6 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full w-1/3 loading-shimmer"></div>
                </div>
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
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-[#f2c9c7]" />
            <h2 className="text-4xl md:text-6xl font-bold text-[#c66074]">New Arrivals</h2>
            <Sparkles className="w-8 h-8 text-[#f2c9c7]" />
          </div>
          <p className="text-red-600 mb-6 text-lg">{error}</p>
          <Button onClick={() => window.location.reload()} className="btn-sexy hover-glow">
            Try Again
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-white via-[#f2c9c7]/5 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f2c9c7]/3 to-transparent animate-shimmer"></div>
      <div className="container mx-auto relative">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in-up">
            <Sparkles className="w-8 h-8 text-[#f2c9c7] animate-pulse" />
            <h2 className="text-4xl md:text-6xl font-bold text-[#c66074]">
              New Arrivals
            </h2>
            <Sparkles className="w-8 h-8 text-[#f2c9c7] animate-pulse" />
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Fresh styles just landed - be the first to shop our newest collection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <Link key={product._id} href={`/product/${product._id}`} className="group">
              <div
                className="card-sexy hover-lift transform-gpu will-change-transform animate-fade-in-up cursor-pointer"
                style={{ animationDelay: `${index * 0.15}s` }}
                onMouseEnter={() => setHoveredProduct(product._id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-t-3xl bg-gradient-to-br from-[#f2c9c7]/5 to-[#f2c9c7]/10">
                  <ImageWithFallback
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700"
                  />

                  {/* Floating badges */}
                  <div className="absolute top-4 left-4">
                    {product.isNewArrival && (
                      <Badge className="bg-[#c66074] text-white px-3 py-1 rounded-full shadow-lg animate-pulse-glow">
                        ✨ New
                      </Badge>
                    )}
                  </div>

                  {/* Wishlist button */}
                  <div className="absolute top-4 right-4">
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`glass-morphism-white hover-glow rounded-full h-10 w-10 transition-all duration-300 ${wishlistStatus.get(product._id)
                        ? 'text-red-500 bg-red-50'
                        : 'text-[#f2c9c7] hover:text-red-500'
                        }`}
                      onClick={(e) => handleWishlistToggle(product, e)}
                    >
                      <Heart
                        className={`h-5 w-5 transition-all duration-300 ${wishlistStatus.get(product._id) ? 'fill-current' : ''
                          }`}
                      />
                    </Button>
                  </div>

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#f2c9c7]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#f2c9c7]/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                  {/* Action buttons overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <Button
                        className=" hover-glow rounded-full px-6 py-2 bg-[#c66074] text-white  hover:text-white transition-all duration-300 flex items-center gap-2"
                        onClick={(e) => e.preventDefault()} // Prevent double navigation since card is wrapped in Link
                      >
                        <Eye className="w-4 h-4 bg-[#c66074] text-white" />
                        View
                      </Button>
                      {/* <Button className=" hover-glow rounded-full px-6 py-2 bg-[#c66074] text-white hover:bg-[#f2c9c7] hover:text-white transition-all duration-300 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 bg-[#c66074] text-white" />
                      Buy
                    </Button> */}
                    </div>
                  </div>

                  {/* Shimmer effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 animate-shimmer"></div>
                </div>

                <div className="p-6 bg-white rounded-b-3xl">
                  <h3 className="font-semibold text-[#8B5446] mb-2 group-hover:text-[#f2c9c7] transition-colors duration-300 text-lg">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 capitalize group-hover:text-[#f2c9c7]/70 transition-colors duration-300">
                    {product.categoryName}
                  </p>

                  {/* Enhanced rating display */}
                  {/* <div className="flex items-center mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 transition-colors duration-300 ${
                          i < Math.floor(parseFloat(getAverageRating(product)))
                            ? 'text-[#f2c9c7] fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({product.reviews?.length || 0})
                  </span>
                </div> */}

                  {/* Price and colors section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-[#8B5446] group-hover:text-[#f2c9c7] transition-colors duration-300">
                        ৳{product.price?.current || 0}
                      </span>
                      {product.price?.original && product.price.original > product.price.current && (
                        <span className="text-sm text-muted-foreground line-through">
                          ৳{product.price.original}
                        </span>
                      )}
                    </div>

                    {/* Color options */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex space-x-1">
                        {product.colors.slice(0, 3).map((color, colorIndex) => (
                          <div
                            key={colorIndex}
                            className="w-5 h-5 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer"
                            style={{ backgroundColor: color.hex || '#f2c9c7' }}
                            title={color.name}
                          />
                        ))}
                        {product.colors.length > 3 && (
                          <span className="text-xs text-muted-foreground ml-1 self-center">
                            +{product.colors.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Animated underline */}
                  <div className="w-0 h-0.5 bg-[#c66074] mx-auto mt-4 group-hover:w-full transition-all duration-500 rounded-full"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-16">
          <Link href="/new-arrivals">
            <Button className="bg-[#c66074] text-white hover-glow px-10 py-4 text-lg">
              View All New Arrivals
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}