"use client"

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Star, Filter, Search, Loader2 } from "lucide-react"
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import Link from "next/link"
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Filtered products based on category and search
  const filteredProducts = products.filter(product => {
    // product.categoryName holds the category slug (e.g., 'dresses', 'casual-wear')
    const matchesCategory = selectedCategory === 'all' || product.categoryName === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Mock product data for fallback (will be replaced with API data)
  const mockProducts = [
    {
      id: 1,
      name: "Elegant Summer Dress",
      price: 89.99,
      originalPrice: 120.00,
      image: "/elarose.jpg",
      rating: 4.8,
      reviews: 24,
      isNew: true,
      isSale: true
    },
    {
      id: 2,
      name: "Classic Blazer",
      price: 149.99,
      image: "/elarose.jpg",
      rating: 4.9,
      reviews: 31,
      isNew: false,
      isSale: false
    },
    {
      id: 3,
      name: "Casual Chic Top",
      price: 45.99,
      originalPrice: 65.99,
      image: "/elarose.jpg",
      rating: 4.7,
      reviews: 18,
      isNew: true,
      isSale: true
    },
    {
      id: 4,
      name: "Designer Handbag",
      price: 199.99,
      image: "/elarose.jpg",
      rating: 5.0,
      reviews: 42,
      isNew: false,
      isSale: false
    },
    {
      id: 5,
      name: "Floral Maxi Dress",
      price: 79.99,
      originalPrice: 99.99,
      image: "/elarose.jpg",
      rating: 4.6,
      reviews: 29,
      isNew: false,
      isSale: true
    },
    {
      id: 6,
      name: "Silk Scarf",
      price: 35.99,
      image: "/elarose.jpg",
      rating: 4.8,
      reviews: 15,
      isNew: true,
      isSale: false
    }
  ];

  // Fetch products from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://elarose-server.onrender.com';

        // Fetch products
        const productsResponse = await fetch(`${apiUrl}/api/products`);
        if (!productsResponse.ok) {
          throw new Error(`Failed to fetch products: ${productsResponse.status}`);
        }
        const productsResult = await productsResponse.json();

        if (productsResult.success) {
          setProducts(productsResult.data);
        } else {
          throw new Error(productsResult.message || 'Failed to load products');
        }

        // Fetch categories
        const categoriesResponse = await fetch(`${apiUrl}/api/categories`);
        if (!categoriesResponse.ok) {
          throw new Error(`Failed to fetch categories: ${categoriesResponse.status}`);
        }
        const categoriesResult = await categoriesResponse.json();

        if (categoriesResult.success) {
          setCategories(categoriesResult.data);
        } else {
          console.warn('Failed to load categories, using fallback');
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        // Fallback to mock data on error
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      const cartItem = {
        id: product._id || product.id,
        name: product.name,
        price: product.price?.current || product.price || 0,
        image: product.images?.[0] || product.image || '',
        color: product.colors?.[0]?.hex || '#000000',
        size: (product.sizes && product.sizes.length > 0) ?
          (typeof product.sizes[0] === 'string' ? product.sizes[0] : product.sizes[0].size) :
          'One Size',
        quantity: 1,
      };

      await addToCart(cartItem);
      alert('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  const handleWishlistToggle = async (product) => {
    try {
      await toggleWishlist(product);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.price?.current || a.price || 0) - (b.price?.current || b.price || 0);
      case 'price-high':
        return (b.price?.current || b.price || 0) - (a.price?.current || a.price || 0);
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'rating':
        const aRating = a.reviews && a.reviews.length > 0 ?
          a.reviews.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length : 0;
        const bRating = b.reviews && b.reviews.length > 0 ?
          b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length : 0;
        return bRating - aRating;
      default:
        return 0; // featured order
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#f2c9c7] mx-auto mb-4" />
          <p className="text-lg text-[#2d1b1e]">Loading our beautiful collection...</p>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-[#2d1b1e] mb-4">Unable to Load Products</h2>
          <p className="text-[#2d1b1e]/70 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-[#f2c9c7] text-[#2d1b1e] hover:bg-[#edb3b0]"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-extralight mb-6 text-transparent bg-clip-text bg-black font-extrabold tracking-wide drop-shadow-sm animate-fade-in">
            Our Collection
          </h1>
          <div className="max-w-2xl mx-auto animate-fade-in">
            <p className="text-lg md:text-xl text-[#2d1b1e]/85 mb-4 leading-relaxed">
              Discover our carefully curated selection of <span className="font-semibold text-[#2d1b1e]">fashion-forward pieces</span> designed to
              <span className="text-[#c66074] font-medium"> elevate your everyday style</span>.
            </p>
            <div className="h-1 w-40 mx-auto rounded-full bg-gradient-to-r from-[#c66074] to-[#f2c9c7] opacity-80" />
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-6">
            {/* Top row - Stats and Search */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-[#2d1b1e]">
                <p className="text-lg font-medium">
                  Showing {sortedProducts.length} of {products.length} products
                  {selectedCategory !== 'all' && (
                    <span className="text-[#f2c9c7] ml-2">in {selectedCategory}</span>
                  )}
                </p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#2d1b1e]/50" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-[#f2c9c7]/30 rounded-lg bg-white text-[#2d1b1e] focus:outline-none focus:ring-2 focus:ring-[#f2c9c7] w-64"
                />
              </div>
            </div>

            {/* Filters row */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Category Filter */}
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-[#2d1b1e] font-medium">Filter by Category:</span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                    className={selectedCategory === 'all'
                      ? 'bg-[#f2c9c7] text-[#2d1b1e] hover:bg-[#edb3b0]'
                      : 'border-[#f2c9c7] text-[#2d1b1e] hover:bg-[#f2c9c7]/10'
                    }
                  >
                    All Categories ({products.length})
                  </Button>
                  {categories.map((category) => {
                    // categories from API provide `slug` and `name`.
                    // products store `categoryName` as the slug — use slug for filtering/counts.
                    const categorySlug = category.slug || category.name;
                    const categoryCount = products.filter(p => p.categoryName === categorySlug).length;
                    return (
                      <Button
                        key={category._id || categorySlug}
                        variant={selectedCategory === categorySlug ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(categorySlug)}
                        className={selectedCategory === categorySlug
                          ? 'bg-[#f2c9c7] text-[#2d1b1e] hover:bg-[#edb3b0]'
                          : 'border-[#f2c9c7] text-[#2d1b1e] hover:bg-[#f2c9c7]/10'
                        }
                      >
                        {category.name} ({categoryCount})
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Sort Filter */}
              <div className="flex items-center gap-2">
                <span className="text-[#2d1b1e] font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-[#f2c9c7]/30 rounded-lg bg-white text-[#2d1b1e] focus:outline-none focus:ring-2 focus:ring-[#f2c9c7]"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-[#2d1b1e] mb-2">No products found</h3>
              <p className="text-[#2d1b1e]/70 mb-6">
                {searchQuery
                  ? `No products match "${searchQuery}"${selectedCategory !== 'all' ? ` in ${selectedCategory}` : ''}`
                  : `No products available${selectedCategory !== 'all' ? ` in ${selectedCategory}` : ''}`
                }
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="bg-[#f2c9c7] text-[#2d1b1e] hover:bg-[#edb3b0]"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedProducts.map((product, index) => {
                const currentPrice = product.price?.current || product.price || 0;
                const originalPrice = product.price?.original || product.originalPrice;
                const hasDiscount = originalPrice && originalPrice > currentPrice;
                const averageRating = product.reviews && product.reviews.length > 0
                  ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
                  : 0;

                return (
                  <Card key={product._id || product.id} className="group border-[#f2c9c7]/20 hover:border-[#f2c9c7] hover-lift transition-all duration-300 overflow-hidden">
                    <div className="relative">
                      <div className="aspect-[3/4] relative overflow-hidden">
                        <ImageWithFallback
                          src={product.images?.[0] || product.image || '/elarose.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {product.isNewArrival && (
                            <Badge className="bg-[#f2c9c7] text-[#2d1b1e] hover:bg-[#edb3b0]">
                              ✨ New
                            </Badge>
                          )}
                          {hasDiscount && (
                            <Badge className="bg-red-500 text-white">
                              Sale
                            </Badge>
                          )}
                          {product.categoryName && (
                            <Badge variant="outline" className="bg-white/90 text-[#2d1b1e] border-[#f2c9c7]">
                              {product.categoryName}
                            </Badge>
                          )}
                        </div>

                        {/* Quick Actions */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="bg-white/90 hover:bg-white hover-glow"
                            onClick={(e) => {
                              e.preventDefault();
                              handleWishlistToggle(product);
                            }}
                          >
                            <Heart className={`h-4 w-4 ${isInWishlist(product._id || product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="bg-white/90 hover:bg-white hover-glow"
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddToCart(product);
                            }}
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Quick View Overlay */}
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button className="bg-white text-[#2d1b1e] hover:bg-[#f2c9c7]" asChild>
                            <Link href={`/product/${product._id || product.id}`}>
                              Quick View
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      {/* Rating */}
                      {/* <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < Math.floor(averageRating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                              }`}
                          />
                        ))}
                        <span className="text-xs text-[#2d1b1e]/60 ml-1">
                          ({product.reviews?.length || 0})
                        </span>
                      </div> */}

                      {/* Product Name */}
                      <h3 className="font-medium text-[#2d1b1e] mb-2 group-hover:text-[#f2c9c7] transition-colors line-clamp-2">
                        <Link href={`/product/${product._id || product.id}`}>
                          {product.name}
                        </Link>
                      </h3>

                      {/* Description */}
                      {product.description && (
                        <p className="text-sm text-[#2d1b1e]/60 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-semibold text-[#2d1b1e]">
                          ৳{currentPrice.toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <>
                            <span className="text-sm text-[#2d1b1e]/50 line-through">
                              ৳{originalPrice.toFixed(2)}
                            </span>
                            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                              Save ৳{(originalPrice - currentPrice).toFixed(2)}
                            </Badge>
                          </>
                        )}
                      </div>

                      {/* Colors */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#2d1b1e]/60">Colors:</span>
                          <div className="flex gap-1">
                            {product.colors.slice(0, 4).map((color, colorIndex) => (
                              <div
                                key={colorIndex}
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: color.hex || color }}
                                title={color.name || `Color ${colorIndex + 1}`}
                              />
                            ))}
                            {product.colors.length > 4 && (
                              <span className="text-xs text-[#2d1b1e]/60">+{product.colors.length - 4}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Load More - Future Enhancement */}
          {sortedProducts.length > 0 && (
            <div className="text-center mt-12">
              <p className="text-[#2d1b1e]/70 mb-4">
                Showing all {sortedProducts.length} products
              </p>
              {/* Future: Add pagination here */}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="gradient-primary py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white animate-float"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 rounded-full bg-white animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-3xl md:text-4xl font-light mb-4 text-[#2d1b1e]">
            Stay Updated with New Arrivals
          </h2>
          <p className="text-[#2d1b1e]/80 mb-8 max-w-2xl mx-auto">
            Be the first to know about our latest collections and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-lg border border-[#2d1b1e]/20 bg-white/50 backdrop-blur-sm text-[#2d1b1e] placeholder-[#2d1b1e]/60 focus:outline-none focus:ring-2 focus:ring-[#2d1b1e] flex-1"
            />
            <Button className="bg-[#2d1b1e] text-white hover:bg-[#4a3537] px-6 py-3 hover-lift">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}