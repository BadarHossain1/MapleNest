"use client"

import { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function WishlistPage() {
  const { items: wishlistItems, removeFromWishlist, loading: wishlistLoading } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useUser();
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState({});

  // Debug wishlist items
  useEffect(() => {
    console.log('Wishlist items:', wishlistItems);
    wishlistItems?.forEach((item, index) => {
      console.log(`Wishlist item ${index}:`, item);
    });
  }, [wishlistItems]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleRemoveFromWishlist = async (productId) => {
    setIsRemoving(prev => ({ ...prev, [productId]: true }));
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setIsRemoving(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleAddToCart = async (product) => {
    // Build cart item matching the product page's structure
    const cartItem = {
      id: product._id || product.id,
      name: product.name,
      price: product.price?.current || product.price || 0,
      image: product.images?.[0] || product.image || '',
      color: product.colors?.[0]?.hex || '#000000',
      size: (product.sizes && product.sizes.length > 0) ? (typeof product.sizes[0] === 'string' ? product.sizes[0] : product.sizes[0].size) : 'One Size',
      quantity: 1,
    };

    try {
      await addToCart(cartItem);
      // Quick UX feedback — small success alert (keeps behavior lightweight)
      alert('Added to cart');
      // Optionally: remove from wishlist after adding
      // await removeFromWishlist(product._id || product.id);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  };

  if (wishlistLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f2c9c7]/20 via-white to-[#f2c9c7]/10">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#f2c9c7]/5 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#f2c9c7]/3 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center animate-fade-in transform-gpu">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#f2c9c7]/20 border-t-[#f2c9c7] mx-auto mb-6"></div>
              <div className="absolute inset-0 animate-pulse-glow rounded-full"></div>
            </div>
            <p className="text-[#8B5446] text-xl font-medium animate-fade-in-up">Loading your beautiful wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f2c9c7]/20 via-white to-[#f2c9c7]/10">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#f2c9c7]/5 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#f2c9c7]/3 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center animate-fade-in transform-gpu">
            <div className="max-w-md mx-auto card-glass rounded-3xl p-12">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-[#f2c9c7] to-[#e8b4b1] rounded-full flex items-center justify-center shadow-lg">
                <Heart className="h-16 w-16 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-[#c66074] mb-4">Your Wishlist Awaits</h1>
              <p className="text-[#8B5446]/70 mb-8 leading-relaxed">
                Save items you love by clicking the heart icon. They'll appear here for easy shopping later!
              </p>
              <div className="space-y-4">
                <Link href="/">
                  <Button size="lg" className="btn-sexy px-8 py-3 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                    Start Shopping
                  </Button>
                </Link>
                <div className="text-sm text-[#8B5446]/60">
                  or <Link href="/cart" className="text-[#f2c9c7] hover:underline font-medium">view your cart</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f2c9c7]/20 via-white to-[#f2c9c7]/10">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#f2c9c7]/5 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#f2c9c7]/3 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-bold text-[#c66074] mb-2">My Beautiful Wishlist</h1>
            <p className="text-[#8B5446]/70 text-lg">
              {wishlistItems.length} precious item{wishlistItems.length !== 1 ? 's' : ''} saved for later
            </p>
          </div>
          <Link href="/">
            <Button className="glass-morphism-white hover:glass-morphism px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 text-[#8B5446] font-medium">
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlistItems.map((product, index) => (
            <div
              key={product._id || product.id || `wishlist-item-${index}`}
              className="group card-glass rounded-3xl overflow-hidden hover-lift transition-all duration-500 animate-fade-in-up transform-gpu"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <ImageWithFallback
                  src={product.images?.[0] || product.image || ''}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
                  onClick={() => router.push(`/product/${product._id || product.id}`)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Remove from wishlist button */}
                <button
                  onClick={() => handleRemoveFromWishlist(product._id || product.id)}
                  disabled={isRemoving[product._id || product.id]}
                  className="absolute top-4 right-4 w-12 h-12 glass-morphism-white rounded-full flex items-center justify-center hover:glass-morphism transition-all duration-300 hover:scale-110 shadow-lg"
                >
                  <Heart className="h-5 w-5 text-red-500 fill-current" />
                </button>
              </div>

              {/* Product Details */}
              <div className="p-6">
                <div className="mb-4">
                  <h3
                    className="text-xl font-bold text-[#8B5446] mb-2 group-hover:text-[#c66074] transition-all duration-300 cursor-pointer"
                    onClick={() => router.push(`/product/${product._id || product.id}`)}
                  >
                    {product.name}
                  </h3>
                  {product.categoryName && (
                    <div className="inline-block bg-[#f2c9c7]/20 text-[#8B5446] px-3 py-1 rounded-full text-sm font-medium">
                      {product.categoryName}
                    </div>
                  )}
                </div>

                {/* Rating */}
                {product.reviews && product.reviews.length > 0 && (
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={`star-${i}`}
                        className={`h-4 w-4 ${i < Math.floor(calculateAverageRating(product.reviews))
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                          }`}
                      />
                    ))}
                    <span className="text-sm text-[#8B5446]/60 ml-2">
                      ({product.reviews.length})
                    </span>
                  </div>
                )}

                <p className="text-sm text-[#8B5446]/70 mb-4 leading-relaxed line-clamp-2">
                  {product.description}
                </p>

                {/* Price and Actions */}
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-[#c66074]">
                        ৳{(product.price?.current || product.price || 0).toFixed(2)}
                      </span>
                      {((product.price?.original || product.originalPrice) &&
                        (product.price?.original || product.originalPrice) > (product.price?.current || product.price || 0)) && (
                          <span className="text-sm text-[#8B5446]/50 line-through">
                            ৳{(product.price?.original || product.originalPrice || 0).toFixed(2)}
                          </span>
                        )}
                    </div>
                    {((product.price?.original || product.originalPrice) &&
                      (product.price?.original || product.originalPrice) > (product.price?.current || product.price || 0)) && (
                        <div className="text-sm text-[#f2c9c7] font-bold">
                          Save ৳{((product.price?.original || product.originalPrice || 0) - (product.price?.current || product.price || 0)).toFixed(2)}
                        </div>
                      )}
                  </div>
                </div>

                {/* Color Options */}
                {product.colors && product.colors.length > 0 && (
                  <div className="flex space-x-3 mb-6">
                    {product.colors.slice(0, 4).map((color, colorIndex) => (
                      <div
                        key={color.hex || `color-${colorIndex}`}
                        className="w-7 h-7 rounded-full border-2 border-white shadow-md hover:border-[#f2c9c7] hover:scale-110 transition-all duration-300 cursor-pointer"
                        style={{ backgroundColor: color.hex || '#ccc' }}
                        title={color.name || `Color ${colorIndex + 1}`}
                      />
                    ))}
                    {product.colors.length > 4 && (
                      <div className="w-7 h-7 rounded-full border-2 border-white shadow-md glass-morphism-white flex items-center justify-center">
                        <span className="text-xs text-[#8B5446] font-bold">+{product.colors.length - 4}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full btn-sexy py-3 text-sm font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>

                  <div className="flex space-x-3">
                    <Button
                      onClick={() => router.push(`/product/${product._id || product.id}`)}
                      className="flex-1 glass-morphism-white hover:glass-morphism text-[#8B5446] font-medium py-2 rounded-xl transition-all duration-300"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() => handleRemoveFromWishlist(product._id || product.id)}
                      disabled={isRemoving[product._id || product.id]}
                      className="px-4 glass-morphism-white hover:bg-red-50 text-red-500 hover:text-red-600 rounded-xl transition-all duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Date Added */}
                <div className="text-xs text-[#8B5446]/50 mt-4 text-center font-medium">
                  Added {new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Actions */}
        <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="max-w-2xl mx-auto card-glass rounded-3xl p-12">
            <h2 className="text-3xl font-bold text-[#c66074] mb-4">Love everything in your wishlist?</h2>
            <p className="text-[#8B5446]/70 mb-8 text-lg leading-relaxed">
              Add all items to your cart and checkout quickly, or continue browsing for more amazing products.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                onClick={() => {
                  wishlistItems.forEach(product => handleAddToCart(product));
                }}
                className="btn-sexy px-8 py-4 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                Add All to Cart
              </Button>
              <Button
                size="lg"
                onClick={() => router.push('/')}
                className="glass-morphism-white hover:glass-morphism px-8 py-4 text-lg font-medium text-[#8B5446] rounded-2xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}