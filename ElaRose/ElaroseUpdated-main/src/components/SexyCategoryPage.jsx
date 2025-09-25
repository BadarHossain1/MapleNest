"use client"

import { useState, useEffect, use } from 'react';
import { Heart, Star, Filter, Grid, List, Home, ChevronRight, Search, SlidersHorizontal, Eye, ShoppingBag, Sparkles, Zap, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SexyCategoryPage({ params }) {
  const { categorySlug } = use(params);
  const router = useRouter();
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const productsPerPage = 12;

  // Fetch products from API based on category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://elarose-server.onrender.com';
        const response = await fetch(`${apiUrl}/api/products`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();

        if (result.success) {
          // Filter products by category name
          const categoryProducts = result.data.filter((product) => {
            const productCategorySlug = product.categoryName.toLowerCase().replace(/\s+/g, '-');
            return productCategorySlug === categorySlug;
          });
          
          setProducts(categoryProducts);
          setFilteredProducts(categoryProducts);
          
          // Set category name for display
          if (categoryProducts.length > 0) {
            setCategoryName(categoryProducts[0].categoryName);
          } else {
            setCategoryName(categorySlug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()));
          }
        } else {
          setError('Failed to load products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Network error loading products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug]);

  // Filter and sort products
  useEffect(() => {
    let filtered = products.filter((product) => {
      // Price filter
      const price = product.price?.current || product.price || 0;
      if (price < priceRange[0] || price > priceRange[1]) return false;

      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Size filter
      if (selectedSizes.length > 0) {
        const productSizes = product.sizes || [];
        const hasMatchingSize = productSizes.some(size => {
          const sizeValue = typeof size === 'string' ? size : size.size;
          return selectedSizes.includes(sizeValue);
        });
        if (!hasMatchingSize) return false;
      }

      // Color filter
      if (selectedColors.length > 0) {
        const productColors = product.colors || [];
        const hasMatchingColor = productColors.some(color => 
          selectedColors.includes(color.name || color.hex)
        );
        if (!hasMatchingColor) return false;
      }

      return true;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.price?.current || a.price || 0) - (b.price?.current || b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price?.current || b.price || 0) - (a.price?.current || a.price || 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filtered.sort((a, b) => {
          const ratingA = getAverageRating(a);
          const ratingB = getAverageRating(b);
          return ratingB - ratingA;
        });
        break;
      default:
        // newest - keep original order or sort by creation date if available
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, priceRange, searchQuery, selectedSizes, selectedColors, sortBy]);

  const getAverageRating = (product) => {
    if (!product.reviews || product.reviews.length === 0) return 0;
    const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / product.reviews.length;
  };

  const clearFilters = () => {
    setPriceRange([0, 10000]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSearchQuery('');
    setSortBy('newest');
  };

  // Get unique sizes and colors for filters
  const uniqueSizes = [...new Set(products.flatMap(p => 
    (p.sizes || []).map(size => typeof size === 'string' ? size : size.size)
  ))];
  
  const uniqueColors = [...new Set(products.flatMap(p => 
    (p.colors || []).map(color => color.name || color.hex)
  ))];

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#f2c9c7]/5 to-white">
        <div className="container mx-auto px-4 py-12">
          {/* Header Skeleton */}
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="h-12 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full w-64 mx-auto mb-4 loading-shimmer"></div>
            <div className="h-6 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full w-96 mx-auto loading-shimmer"></div>
          </div>

          {/* Filters Skeleton */}
          <div className="flex flex-col lg:flex-row gap-8 mb-12">
            <div className="w-full lg:w-1/4 space-y-6">
              <div className="h-12 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full loading-shimmer"></div>
              <div className="h-32 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-3xl loading-shimmer"></div>
              <div className="h-24 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-3xl loading-shimmer"></div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card-sexy animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="aspect-[3/4] bg-gradient-to-br from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-t-3xl loading-shimmer"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full w-3/4 loading-shimmer"></div>
                      <div className="h-5 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full w-1/2 loading-shimmer"></div>
                      <div className="h-8 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full w-1/3 loading-shimmer"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#f2c9c7]/10 to-white flex items-center justify-center">
        <div className="text-center card-sexy p-12 max-w-lg animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-[#c66074]" />
            <h2 className="text-3xl font-bold text-[#c66074]">Oops!</h2>
            <Sparkles className="w-8 h-8 text-[#c66074]" />
          </div>
          <p className="text-gray-600 mb-8">{error}</p>
          <Button onClick={() => window.location.reload()} className="btn-sexy hover-glow">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f2c9c7]/3 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f2c9c7]/5 to-transparent animate-shimmer opacity-30 pointer-events-none"></div>
      <div className="absolute top-20 right-10 w-64 h-64 bg-[#f2c9c7]/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#f2c9c7]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 py-12 relative">
        {/* Breadcrumb */}
        <nav className="mb-8 animate-fade-in-up">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-[#c66074] hover:text-[#e8b4b1] transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 capitalize">{categoryName}</span>
          </div>
        </nav>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in-up">
            <Sparkles className="w-8 h-8 text-[#c66074] animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold text-[#c66074] capitalize">
              {categoryName}
            </h1>
            <Sparkles className="w-8 h-8 text-[#c66074] animate-pulse" />
          </div>
          <p className="text-muted-foreground text-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Discover our curated collection of {filteredProducts.length} amazing products
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`w-full lg:w-1/4 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="card-sexy p-6 animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#c66074] flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </h3>
                <Button
                  onClick={clearFilters}
                  variant="ghost"
                  size="sm"
                  className="text-[#c66074] hover:text-[#e8b4b1]"
                >
                  Clear All
                </Button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-3 block">Search Products</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c66074]" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="pl-10 glass-morphism border-[#f2c9c7]/30 focus:border-[#f2c9c7] rounded-full"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-3 block">Price Range</label>
                <div className="px-3">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={10000}
                    step={10}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Sizes */}
              {uniqueSizes.length > 0 && (
                <div className="mb-6">
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Sizes</label>
                  <div className="flex flex-wrap gap-2">
                    {uniqueSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSizes(prev =>
                            prev.includes(size)
                              ? prev.filter(s => s !== size)
                              : [...prev, size]
                          );
                        }}
                        className={`px-3 py-2 rounded-full border transition-all duration-300 hover:scale-105 ${
                          selectedSizes.includes(size)
                            ? 'bg-[#f2c9c7] text-white border-[#f2c9c7]'
                            : 'border-gray-300 hover:border-[#f2c9c7] hover:text-[#c66074]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {uniqueColors.length > 0 && (
                <div className="mb-6">
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Colors</label>
                  <div className="flex flex-wrap gap-3">
                    {uniqueColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setSelectedColors(prev =>
                            prev.includes(color)
                              ? prev.filter(c => c !== color)
                              : [...prev, color]
                          );
                        }}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                          selectedColors.includes(color)
                            ? 'border-[#f2c9c7] scale-110'
                            : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color.startsWith('#') ? color : '#f2c9c7' }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 card-sexy p-4 animate-fade-in-up">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  Showing {startIndex + 1}-{Math.min(startIndex + productsPerPage, filteredProducts.length)} of {filteredProducts.length} products
                </span>
                
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden glass-morphism hover-glow rounded-full px-4 py-2"
                  size="sm"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 glass-morphism border-[#f2c9c7]/30 focus:border-[#f2c9c7] rounded-full">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="glass-morphism-white rounded-2xl">
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex items-center glass-morphism rounded-full p-1">
                  <Button
                    onClick={() => setViewMode('grid')}
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    className={`rounded-full ${viewMode === 'grid' ? 'bg-[#f2c9c7] text-white' : ''}`}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => setViewMode('list')}
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    className={`rounded-full ${viewMode === 'list' ? 'bg-[#f2c9c7] text-white' : ''}`}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products */}
            {currentProducts.length > 0 ? (
              <div className={`grid gap-8 mb-12 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {currentProducts.map((product, index) => (
                  <div
                    key={product._id}
                    className={`group card-sexy hover-lift cursor-pointer animate-fade-in-up ${
                      viewMode === 'list' ? 'flex gap-6 p-6' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onMouseEnter={() => setHoveredProduct(product._id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    onClick={() => router.push(`/product/${product._id}`)}
                  >
                    {/* Product Image */}
                    <div className={`relative overflow-hidden ${
                      viewMode === 'list' 
                        ? 'w-48 h-48 rounded-2xl flex-shrink-0' 
                        : 'aspect-[3/4] rounded-t-3xl'
                    }`}>
                      <ImageWithFallback
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700"
                      />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.isNewArrival && (
                          <Badge className="bg-gradient-to-r from-[#f2c9c7] to-[#e8b4b1] text-white animate-pulse-glow">
                            ✨ New
                          </Badge>
                        )}
                        {product.price?.original && product.price.original > product.price.current && (
                          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                            Sale
                          </Badge>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20">
                        <div className="flex gap-3">
                          <Button className="glass-morphism-white hover-glow rounded-full p-3">
                            <Eye className="w-5 h-5 text-[#c66074]" />
                          </Button>
                          {/* <Button className="glass-morphism-white hover-glow rounded-full p-3">
                            <ShoppingBag className="w-5 h-5 text-[#c66074]" />
                          </Button>
                          <Button className="glass-morphism-white hover-glow rounded-full p-3">
                            <Heart className="w-5 h-5 text-[#c66074]" />
                          </Button> */}
                        </div>
                      </div>

                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 animate-shimmer"></div>
                    </div>

                    {/* Product Info */}
                    <div className={`${viewMode === 'list' ? 'flex-1 py-2' : 'p-6 bg-white rounded-b-3xl'}`}>
                      <h3 className="font-semibold text-lg text-gray-800 mb-2 group-hover:text-[#c66074] transition-colors duration-300">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      {/* <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(getAverageRating(product))
                                  ? 'text-[#c66074] fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({product.reviews?.length || 0})
                        </span>
                      </div> */}

                      {/* Price */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xl font-bold text-[#8B5446] group-hover:text-[#c66074] transition-colors duration-300">
                          ৳{product.price?.current || product.price || 0}
                        </span>
                        {product.price?.original && product.price.original > product.price.current && (
                          <span className="text-gray-500 line-through">
                            ৳{product.price.original}
                          </span>
                        )}
                      </div>

                      {/* Colors */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex gap-2 mb-3">
                          {product.colors.slice(0, 4).map((color, colorIndex) => (
                            <div
                              key={colorIndex}
                              className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                              style={{ backgroundColor: color.hex || '#f2c9c7' }}
                              title={color.name}
                            />
                          ))}
                          {product.colors.length > 4 && (
                            <span className="text-xs text-gray-500 self-center ml-1">
                              +{product.colors.length - 4} more
                            </span>
                          )}
                        </div>
                      )}

                      {viewMode === 'list' && (
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {product.description}
                        </p>
                      )}

                      {/* Animated underline */}
                      <div className="w-0 h-0.5 bg-gradient-to-r from-[#f2c9c7] to-[#e8b4b1] group-hover:w-full transition-all duration-500 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 animate-fade-in-up">
                <div className="card-sexy p-12 max-w-lg mx-auto">
                  <Sparkles className="w-16 h-16 text-[#c66074] mx-auto mb-6 animate-pulse" />
                  <h3 className="text-2xl font-bold text-[#c66074] mb-4">No Products Found</h3>
                  <p className="text-gray-600 mb-8">
                    We couldn't find any products matching your criteria. Try adjusting your filters.
                  </p>
                  <Button onClick={clearFilters} className="btn-sexy hover-glow">
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 animate-fade-in-up">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="glass-morphism hover-glow rounded-full px-4 py-2"
                  size="sm"
                >
                  Previous
                </Button>

                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                    ) {
                      return (
                        <Button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          variant={currentPage === page ? 'default' : 'ghost'}
                          className={`w-10 h-10 rounded-full ${
                            currentPage === page 
                              ? 'bg-[#f2c9c7] text-white hover:bg-[#e8b4b1]' 
                              : 'glass-morphism hover-glow'
                          }`}
                          size="sm"
                        >
                          {page}
                        </Button>
                      );
                    } else if (
                      page === currentPage - 3 ||
                      page === currentPage + 3
                    ) {
                      return <span key={page} className="px-2 text-gray-400">...</span>;
                    }
                    return null;
                  })}
                </div>

                <Button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="glass-morphism hover-glow rounded-full px-4 py-2"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}