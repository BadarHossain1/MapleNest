"use client"

import { useState, useEffect } from 'react';
import { Heart, Share2, ShoppingBag, Minus, Plus, Truck, RotateCcw, Shield, Eye, Sparkles, ChevronLeft, ChevronRight, Zap, Gift, CreditCard, MessageCircle, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useUser } from '@clerk/nextjs';
import { CartSuccessModal } from '@/components/ui/cart-success-modal';
import ImageModal from '@/components/ui/image-modal';

export default function ProductPage({ params }) {
  const [productId, setProductId] = useState(null);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setProductId(resolvedParams.productId);
    };
    getParams();
  }, [params]);

  const router = useRouter();
  const { user } = useUser();
  const cartContext = useCart();
  const { toggleWishlist, isInWishlist: checkIsInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);

  // Review form state
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError('');

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://elarose-server.onrender.com';
        const response = await fetch(`${apiUrl}/api/products`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          const allProducts = result.data;
          const selectedProduct = allProducts.find((p) => p._id === productId);

          if (selectedProduct) {
            setProduct(selectedProduct);

            // Set default selections
            if (selectedProduct.colors?.length > 0) {
              setSelectedColor(selectedProduct.colors[0].hex);
            }
            if (selectedProduct.sizes?.length > 0) {
              const firstSize = typeof selectedProduct.sizes[0] === 'string'
                ? selectedProduct.sizes[0]
                : selectedProduct.sizes[0].size;
              setSelectedSize(firstSize);
            }

            // Find related products (same category)
            const related = allProducts
              .filter((p) => p._id !== productId && p.categoryName === selectedProduct.categoryName)
              .slice(0, 4);
            setRelatedProducts(related);
          } else {
            setError('Product not found');
          }
        } else {
          setError(result.message || 'Failed to load product');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Network error loading product');
      } finally {
        setLoading(false);
      }
    };

    const checkWishlistStatus = async () => {
      if (checkIsInWishlist) {
        const wishlistStatus = await checkIsInWishlist(productId);
        setIsInWishlist(wishlistStatus);
      }
    };

    fetchProductData();
    checkWishlistStatus();
  }, [productId, checkIsInWishlist]);

  const handleAddToCart = async () => {
    if (!cartContext || typeof cartContext.addToCart !== 'function') {
      console.error('Cart context not available or addToCart is not a function');
      return;
    }

    if (!selectedSize && product?.sizes?.length > 0) {
      alert('Please select a size');
      return;
    }

    const item = {
      id: product._id,
      name: product.name,
      price: product.price?.current || product.price,
      image: product.images?.[0] || '',
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
    };

    try {
      await cartContext.addToCart(item);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  const handleBuyNow = async () => {
    if (!selectedSize && product?.sizes?.length > 0) {
      alert('Please select a size');
      return;
    }

    const buyNowData = {
      productId: product._id,
      productName: product.name,
      price: product.price?.current || product.price,
      originalPrice: product.price?.original || product.originalPrice,
      productImage: product.images?.[0] || '',
      selectedColor: selectedColor,
      selectedSize: selectedSize,
      quantity: quantity,
      colorName: product.colors?.find(c => c.hex === selectedColor)?.name || 'Selected Color',
      categoryName: product.categoryName || 'Product'
    };

    router.push(`/buy-now?data=${encodeURIComponent(JSON.stringify(buyNowData))}`);
  };

  const handleWishlistToggle = async () => {
    if (toggleWishlist && product) {
      await toggleWishlist(product);
      setIsInWishlist(!isInWishlist);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      alert('Please login to submit a review');
      return;
    }

    if (!reviewComment.trim()) {
      alert('Please enter a review comment');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://elarose-server.onrender.com';
      // Use the product's custom id field for the API call, not the MongoDB _id
      const productCustomId = product?.id;
      console.log('Product IDs:', { mongoId: productId, customId: productCustomId });
      if (!productCustomId) {
        throw new Error('Product ID not found');
      }
      const response = await fetch(`${apiUrl}/api/products/${productCustomId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          userName: user.fullName || user.firstName || 'Anonymous',
          userEmail: user.emailAddresses?.[0]?.emailAddress || '',
          comment: reviewComment.trim(),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Update the product state with the new review
          setProduct(prev => ({
            ...prev,
            reviews: [...(prev.reviews || []), result.review]
          }));
          setReviewComment('');
          alert('Review submitted successfully!');
        } else {
          alert(result.message || 'Failed to submit review');
        }
      } else {
        const errorData = await response.text();
        console.error('Response error:', response.status, errorData);
        throw new Error(`Failed to submit review: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };



  const nextImage = () => {
    if (product?.images) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#f2c9c7]/5 to-white">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Image Gallery Skeleton */}
            <div className="space-y-6 animate-fade-in-up">
              <div className="aspect-square bg-gradient-to-br from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-3xl loading-shimmer"></div>
              <div className="flex gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-gradient-to-br from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-2xl loading-shimmer"></div>
                ))}
              </div>
            </div>

            {/* Product Info Skeleton */}
            <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="space-y-4">
                <div className="h-8 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full w-3/4 loading-shimmer"></div>
                <div className="h-6 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full w-1/2 loading-shimmer"></div>
                <div className="h-12 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full w-1/3 loading-shimmer"></div>
              </div>

              <div className="space-y-4">
                <div className="h-6 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full w-full loading-shimmer"></div>
                <div className="h-6 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full w-5/6 loading-shimmer"></div>
                <div className="h-6 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full w-4/6 loading-shimmer"></div>
              </div>

              <div className="flex gap-4">
                <div className="h-14 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full w-32 loading-shimmer"></div>
                <div className="h-14 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full w-40 loading-shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#f2c9c7]/10 to-white flex items-center justify-center">
        <div className="text-center card-sexy p-12 max-w-lg animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-[#c66074]" />
            <h2 className="text-3xl font-bold text-[#c66074]">Product Not Found</h2>
            <Sparkles className="w-8 h-8 text-[#c66074]" />
          </div>
          <p className="text-gray-600 mb-8">{error || 'This product seems to have wandered off!'}</p>
          <Button onClick={() => router.push('/')} className="btn-sexy hover-glow">
            Return to Shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f2c9c7]/3 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f2c9c7]/5 to-transparent animate-shimmer opacity-30 pointer-events-none"></div>
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#c66074]/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#c66074]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>

      <div className="container mx-auto px-4 py-12 relative">
        {/* Breadcrumb */}
        <nav className="mb-8 animate-fade-in-up">
          <div className="flex items-center space-x-2 text-sm">
            <button onClick={() => router.push('/')} className="text-[#c66074] hover:text-[#e8b4b1] transition-colors">
              Home
            </button>
            <span className="text-gray-400">/</span>
            <button onClick={() => router.push(`/category/${product.categorySlug}`)} className="text-[#c66074] hover:text-[#e8b4b1] transition-colors capitalize">
              {product.categoryName}
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{product.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Image Gallery */}
          <div className="space-y-6 animate-fade-in-up">
            {/* Main Image */}
            <div className="relative group">
              <div className="aspect-square rounded-3xl overflow-hidden card-sexy">
                <ImageWithFallback
                  src={product.images?.[selectedImage] || product.images?.[0] || ''}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onLoad={() => setImageLoading(false)}
                />

                {/* Image Navigation */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 glass-morphism-white hover-glow rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <ChevronLeft className="w-6 h-6 text-[#c66074]" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 glass-morphism-white hover-glow rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <ChevronRight className="w-6 h-6 text-[#c66074]" />
                    </button>
                  </>
                )}

                {/* Full Screen Button */}
                <button
                  onClick={() => setShowImageModal(true)}
                  className="absolute top-4 right-4 glass-morphism-white hover-glow rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <Eye className="w-5 h-5 text-[#c66074]" />
                </button>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNewArrival && (
                    <Badge className="bg-[#c66074] text-white animate-pulse-glow">
                      ✨ New
                    </Badge>
                  )}
                  {product.price?.original && product.price.original > product.price.current && (
                    <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse-glow">
                      Sale
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden transition-all duration-300 ${selectedImage === index
                      ? 'ring-2 ring-[#f2c9c7] scale-110 shadow-lg'
                      : 'hover:scale-105 opacity-70 hover:opacity-100'
                      }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {/* Product Title & Reviews */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-[#c66074] leading-tight">
                {product.name}
              </h1>

              {/* Reviews Count */}
              {/* <div className="flex items-center gap-4">
                <span className="text-lg font-medium text-[#c66074]">
                  {product.reviews?.length || 0} {(product.reviews?.length || 0) === 1 ? 'review' : 'reviews'}
                </span>
              </div> */}

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-[#8B5446]">
                  ৳{product.price?.current || product.price || 0}
                </span>
                {product.price?.original && product.price.original > product.price.current && (
                  <span className="text-2xl text-gray-500 line-through">
                    ৳{product.price.original}
                  </span>
                )}
                {product.price?.original && product.price.original > product.price.current && (
                  <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white animate-pulse">
                    Save ${product.price.original - product.price.current}
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="card-sexy p-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Color</h3>
                <div className="flex gap-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color.hex)}
                      className={`w-12 h-12 rounded-full border-4 transition-all duration-300 hover:scale-110 ${selectedColor === color.hex
                        ? 'border-[#f2c9c7] shadow-lg scale-110'
                        : 'border-gray-300 hover:border-[#f2c9c7]'
                        }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Size</h3>
                <div className="flex gap-3">
                  {product.sizes.map((sizeOption, index) => {
                    const size = typeof sizeOption === 'string' ? sizeOption : sizeOption.size;
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 rounded-full border-2 font-medium transition-all duration-300 hover:scale-105 ${selectedSize === size
                          ? 'border-[#f2c9c7] bg-[#c66074] text-white shadow-lg scale-105'
                          : 'border-gray-300 hover:border-[#f2c9c7] hover:text-[#c66074]'
                          }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center glass-morphism rounded-full p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#c66074] hover:text-white transition-all duration-300"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-16 text-center font-bold text-xl">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#c66074] hover:text-white transition-all duration-300"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-[#c66074] text-white btn-sexy hover-glow py-4 text-lg flex items-center justify-center gap-3"
              >
                <ShoppingBag className="w-6 h-6" />
                Add to Cart
              </Button>

              <Button
                onClick={handleBuyNow}
                className="flex-1 bg-gradient-to-r from-[#8B5446] to-[#7a4940] hover:from-[#f2c9c7] hover:to-[#e8b4b1] text-white py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-3"
              >
                <Zap className="w-6 h-6" />
                Buy Now
              </Button>

              <Button
                onClick={handleWishlistToggle}
                variant="outline"
                className={`p-4 rounded-full border-2 transition-all duration-300 hover:scale-110 ${isInWishlist
                  ? 'border-[#f2c9c7] bg-[#c66074] text-white hover:bg-[#e8b4b1]'
                  : 'border-gray-300 hover:border-[#f2c9c7] hover:text-[#c66074]'
                  }`}
              >
                <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card-sexy p-4 hover-lift">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#c66074]/20 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-[#c66074]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Free Shipping</h4>
                    <p className="text-sm text-gray-600">On orders over $100</p>
                  </div>
                </div>
              </div>

              <div className="card-sexy p-4 hover-lift">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#c66074]/20 flex items-center justify-center">
                    <RotateCcw className="w-5 h-5 text-[#c66074]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Easy Returns</h4>
                    <p className="text-sm text-gray-600">30-day return policy</p>
                  </div>
                </div>
              </div>

              <div className="card-sexy p-4 hover-lift">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#c66074]/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#c66074]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Secure Payment</h4>
                    <p className="text-sm text-gray-600">100% secure checkout</p>
                  </div>
                </div>
              </div>

              <div className="card-sexy p-4 hover-lift">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#c66074]/20 flex items-center justify-center">
                    <Gift className="w-5 h-5 text-[#c66074]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Gift Wrapping</h4>
                    <p className="text-sm text-gray-600">Available at checkout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="glass-morphism rounded-full p-1 mb-8">
              <TabsTrigger value="description" className="rounded-full px-8 py-3 data-[state=active]:bg-[#c66074] data-[state=active]:text-white transition-all duration-300">
                Description
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-full px-8 py-3 data-[state=active]:bg-[#c66074] data-[state=active]:text-white transition-all duration-300">
                Reviews ({product.reviews?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="shipping" className="rounded-full px-8 py-3 data-[state=active]:bg-[#c66074] data-[state=active]:text-white transition-all duration-300">
                Shipping
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="card-sexy p-8">
              <div className="prose prose-lg max-w-none">
                <h3 className="text-2xl font-bold text-[#c66074] mb-4">Product Details</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {product.description}
                </p>

                {product.features && (
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">Features</h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Sparkles className="w-5 h-5 text-[#c66074]" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="card-sexy p-8">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-[#c66074]">Customer Reviews</h3>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-[#c66074]" />
                    <span className="font-semibold text-lg">
                      {product.reviews?.length || 0} {(product.reviews?.length || 0) === 1 ? 'review' : 'reviews'}
                    </span>
                  </div>
                </div>

                {/* Add Review Form */}
                <div className="glass-morphism p-6 rounded-2xl">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-[#c66074]" />
                    Write a Review
                  </h4>

                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#c66074] flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user.userName || user.firstName || 'Anonymous'}</p>
                          <p className="text-sm text-gray-600">{user.emailAddresses?.[0]?.emailAddress}</p>
                        </div>
                      </div>

                      <Textarea
                        placeholder="Share your thoughts about this product..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="min-h-[120px] resize-none border-2 border-gray-200 focus:border-[#f2c9c7] rounded-xl"
                        disabled={isSubmittingReview}
                      />

                      <div className="flex justify-end">
                        <Button
                          onClick={handleSubmitReview}
                          disabled={isSubmittingReview || !reviewComment.trim()}
                          className="btn-sexy hover-glow flex items-center gap-2"
                        >
                          {isSubmittingReview ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Submit Review
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-600 mb-4">Please login to write a review</p>
                      <Button onClick={() => router.push('/login')} className="btn-sexy">
                        Login to Review
                      </Button>
                    </div>
                  )}
                </div>

                {/* Reviews List */}
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-gray-800">All Reviews</h4>
                    <div className="grid gap-4">
                      {product.reviews.map((review, index) => (
                        <div key={index} className="card-sexy p-6 hover-lift">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#f2c9c7] to-[#e8b4b1] flex items-center justify-center flex-shrink-0">
                              <User className="w-6 h-6 text-white" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>

                                  <p className="text-sm text-gray-600">{review.userEmail || ''}</p>
                                </div>
                                <span className="text-sm text-gray-500">
                                  {new Date(review.createdAt || review.postTime || Date.now()).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>

                              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-gray-600 mb-2">No reviews yet</h4>
                    <p className="text-gray-500">Be the first to review this product!</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="card-sexy p-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[#c66074] mb-6">Shipping Information</h3>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Truck className="w-6 h-6 text-[#c66074] mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Standard Shipping</h4>
                        <p className="text-gray-600">5-7 business days</p>
                        <p className="text-gray-600">Free on orders over $100</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Zap className="w-6 h-6 text-[#c66074] mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Express Shipping</h4>
                        <p className="text-gray-600">2-3 business days</p>
                        <p className="text-gray-600">$15.99</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <RotateCcw className="w-6 h-6 text-[#c66074] mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Easy Returns</h4>
                        <p className="text-gray-600">30-day return policy</p>
                        <p className="text-gray-600">Free return shipping</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <CreditCard className="w-6 h-6 text-[#c66074] mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Secure Payment</h4>
                        <p className="text-gray-600">SSL encrypted checkout</p>
                        <p className="text-gray-600">Multiple payment options</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Sparkles className="w-8 h-8 text-[#c66074] animate-pulse" />
                <h2 className="text-4xl font-bold text-[#c66074]">You Might Also Like</h2>
                <Sparkles className="w-8 h-8 text-[#c66074] animate-pulse" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct, index) => (
                <div
                  key={relatedProduct._id}
                  className="group card-sexy hover-lift cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${0.1 * index}s` }}
                  onClick={() => router.push(`/product/${relatedProduct._id}`)}
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-3xl">
                    <ImageWithFallback
                      src={relatedProduct.images?.[0]}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-6 bg-white rounded-b-3xl">
                    <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-[#c66074] transition-colors duration-300">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-lg font-bold text-[#8B5446]">
                      ৳{relatedProduct.price?.current || relatedProduct.price || 0}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <CartSuccessModal
            isOpen={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            onViewCart={() => {
              setShowSuccessModal(false);
              router.push('/cart');
            }}
            onContinueShopping={() => {
              setShowSuccessModal(false);
            }}
            product={{
              name: product.name,
              price: product.price?.current || product.price,
              image: product.images?.[selectedImage] || product.images?.[0] || '',
              selectedSize: selectedSize,
              selectedColor: selectedColor,
              colorName: product.colors?.find(c => c.hex === selectedColor)?.name || '',
              quantity: quantity,
            }}
          />
        )}

        {/* Image Modal for fullscreen viewing */}
        <ImageModal
          isOpen={showImageModal}
          onOpenChange={(open) => setShowImageModal(open)}
          images={product?.images || []}
          currentIndex={selectedImage}
          onPrev={() => setSelectedImage((s) => (s - 1 + (product?.images?.length || 1)) % (product?.images?.length || 1))}
          onNext={() => setSelectedImage((s) => (s + 1) % (product?.images?.length || 1))}
        />
      </div>
    </div>
  );
}