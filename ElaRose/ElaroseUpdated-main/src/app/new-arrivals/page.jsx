'use client'; // keep if you're on Next.js (app router). Safe to leave in CRA too.

import { useEffect, useMemo, useRef, useState } from 'react';
import { Heart, Star, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function NewArrivals() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'price-low' | 'price-high' | 'name'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // No Vite. Works in Next.js/CRA: set NEXT_PUBLIC_API_URL (Next) or REACT_APP_API_URL (CRA)
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.REACT_APP_API_URL ||
    'http://localhost:5000';

  const abortRef = useRef(null);

  // restore saved view mode (optional)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('newArrivals:viewMode');
      if (saved === 'grid' || saved === 'list') setViewMode(saved);
    } catch {}
  }, []);

  // persist view mode (optional)
  useEffect(() => {
    try {
      localStorage.setItem('newArrivals:viewMode', viewMode);
    } catch {}
  }, [viewMode]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      setLoading(true);
      setError('');

      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      try {
        const res = await fetch(`${apiUrl}/api/products?isNewArrival=true`, {
          signal: abortRef.current.signal,
          cache: 'no-store',
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok || !json?.success) {
          throw new Error(json?.message || `Failed to load new arrivals (status ${res.status})`);
        }

        const data = Array.isArray(json.data) ? json.data : [];
        setProducts(data);
      } catch (e) {
        if (e?.name !== 'AbortError') {
          console.error('Error fetching new arrivals:', e);
          setError(e?.message || 'Network error loading products');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
    return () => abortRef.current && abortRef.current.abort();
  }, [apiUrl]);

  const formatCurrency = (n) =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0);

  const getAverageRating = (product) => {
    if (!product.reviews?.length) return '0.0';
    const sum = product.reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    const avg = sum / product.reviews.length;
    return (isFinite(avg) ? avg : 0).toFixed(1);
  };

  const sortedProducts = useMemo(() => {
    const copy = [...products];
    copy.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price?.current || 0) - (b.price?.current || 0);
        case 'price-high':
          return (b.price?.current || 0) - (a.price?.current || 0);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'newest':
        default:
          return (b._id || '').localeCompare(a._id || '');
      }
    });
    return copy;
  }, [products, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">New Arrivals</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover the latest trends and styles in our newest collection</p>
          </div>
        </div>

        {/* Loading grid */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-[3/4] bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Oops!</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">New Arrivals</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the latest trends and styles in our newest collection. Fresh pieces that just landed in our store.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {products.length} {products.length === 1 ? 'item' : 'items'}
              </span>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-md">
                <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('grid')}>
                  <Grid className="h-4 w-4" />
                </Button>
                <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('list')}>
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 py-8">
        {sortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No New Arrivals Found</h3>
            <p className="text-gray-600 mb-4">Check back soon for fresh new styles!</p>
            <Button onClick={() => router.push('/')}>Back to Home</Button>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {sortedProducts.map((product) => {
              const firstImg = product.images?.[0] || '';
              const current = product.price?.current ?? 0;
              const original = product.price?.original ?? current;

              return (
                <div
                  key={product._id}
                  className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow group cursor-pointer ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                  onClick={() => router.push(`/product/${product._id}`)}
                  role="button"
                >
                  <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 h-48' : 'aspect-[3/4]'}`}>
                    <ImageWithFallback
                      src={firstImg}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Add to wishlist"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    {product.isNewArrival && <Badge className="absolute top-3 left-3 bg-black text-white">NEW</Badge>}
                  </div>

                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <h3 className="font-medium mb-2 line-clamp-2">{product.name}</h3>

                    {viewMode === 'list' && <p className="text-sm text-gray-600 mb-3 line-clamp-3">{product.description}</p>}

                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600 ml-1">{product.reviews?.length ? getAverageRating(product) : '0.0'}</span>
                    </div>

                    <div className="flex items-center mb-3">
                      <span className="font-semibold text-lg">{formatCurrency(current)}</span>
                      {original > current && <span className="text-gray-500 line-through ml-2 text-sm">{formatCurrency(original)}</span>}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        {(product.colors || []).slice(0, 3).map((color, idx) => (
                          <div
                            key={`${product._id}-color-${idx}`}
                            className="w-5 h-5 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          />
                        ))}
                        {product.colors?.length > 3 && (
                          <div className="w-5 h-5 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{product.colors.length - 3}</span>
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Hook into your cart logic here
                        }}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
