"use client"

import { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Heart, Gift, Percent, Sparkles, Star, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from "@/hooks/useWishlist"
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CheckoutModal from '@/components/ui/checkout-modal';

export default function SexyCartPage() {
  const { items: cart, updateQuantity, removeFromCart, getTotal, getItemCount } = useCart()
  const { addToWishlist } = useWishlist()
  const router = useRouter()

  const [isClient, setIsClient] = useState(false)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(null)
  const [isValidatingDiscount, setIsValidatingDiscount] = useState(false)
  const [removingItems, setRemovingItems] = useState(new Set())
  const [showSuccessMessage, setShowSuccessMessage] = useState('')

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Clear applied discount when cart changes significantly
  useEffect(() => {
    if (appliedDiscount && (!cart || cart.length === 0)) {
      setAppliedDiscount(null)
      setPromoCode('')
    }
  }, [cart, appliedDiscount])

  const handleMoveToWishlist = (item) => {
    addToWishlist(item)
    removeFromCart(item.id)
    setShowSuccessMessage('Item moved to wishlist! ✨')
    setTimeout(() => setShowSuccessMessage(''), 3000)
  }

  const handleRemoveItem = (itemId, variant) => {
    setRemovingItems(prev => new Set([...prev, itemId]))
    setTimeout(() => {
      removeFromCart(itemId, variant)
      setRemovingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
      setShowSuccessMessage('Item removed from cart')
      setTimeout(() => setShowSuccessMessage(''), 2000)
    }, 300)
  }

  const handleOrderSuccess = (orderId) => {
  alert(`Order placed successfully! Your order ID is: ${orderId}`)
    router.push('/')
  }

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      setShowSuccessMessage('Please enter a discount code')
      setTimeout(() => setShowSuccessMessage(''), 3000)
      return
    }

    setIsValidatingDiscount(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

      // Get cart categories for validation
      const cartCategories = [...new Set(cartItems.map(item => item.category).filter(Boolean))]

      // Validate discount code with order details
      const response = await fetch(
        `${apiUrl}/api/discounts/code/${encodeURIComponent(promoCode.trim())}?orderAmount=${subtotal}&categories=${cartCategories.join(',')}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      const result = await response.json()

      if (result.success) {
        // Apply the discount
        const applyResponse = await fetch(`${apiUrl}/api/discounts/apply/${encodeURIComponent(promoCode.trim())}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderAmount: subtotal,
            categories: cartCategories
          })
        })

        const applyResult = await applyResponse.json()

        if (applyResult.success) {
          setAppliedDiscount(applyResult.data)
          setShowSuccessMessage(`Discount applied! ${applyResult.data.name} 🎉`)
          setTimeout(() => setShowSuccessMessage(''), 3000)
        } else {
          throw new Error(applyResult.message)
        }
      } else {
        setShowSuccessMessage(result.message || 'Invalid discount code')
        setTimeout(() => setShowSuccessMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error applying discount:', error)
      setShowSuccessMessage(error.message || 'Failed to apply discount. Please try again.')
      setTimeout(() => setShowSuccessMessage(''), 3000)
    } finally {
      setIsValidatingDiscount(false)
    }
  }

  const removePromoCode = () => {
    setAppliedDiscount(null)
    setPromoCode('')
    setShowSuccessMessage('Discount removed')
    setTimeout(() => setShowSuccessMessage(''), 2000)
  }

  // Convert cart items to the format expected by CheckoutModal
  const convertCartItemsForCheckout = (items) => {
    return items.map(item => ({
      _id: item.id,
      productId: item.id,
      productName: item.name,
      productImage: item.image,
      price: item.price,
      originalPrice: item.originalPrice,
      quantity: item.quantity,
      selectedSize: item.size || 'N/A',
      selectedColor: item.color || '#000000',
      colorName: item.colorName || 'Default',
      categoryName: item.category || 'General'
    }))
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f2c9c7]/5 via-white to-[#e8b4b1]/10 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f2c9c7] mx-auto mb-4"></div>
          <p className="text-[#8B5446] text-lg">Loading your cart...</p>
        </div>
      </div>
    )
  }

  // Ensure cart is always an array
  const cartItems = cart || []

  const subtotal = getTotal()
  const shipping = (appliedDiscount?.freeDelivery || subtotal > 50) ? 0 : 9.99
  const tax = subtotal * 0.08
  const promoDiscount = appliedDiscount ? appliedDiscount.discountAmount : 0
  const total = subtotal + shipping + tax - promoDiscount

  const freeShippingProgress = subtotal > 50 ? 100 : (subtotal / 50) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f2c9c7]/5 via-white to-[#e8b4b1]/10 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-[#f2c9c7]/20 to-[#e8b4b1]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-[#d4a4a1]/20 to-[#f2c9c7]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-[#f2c9c7]/10 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-up">
          <div className="bg-white/90 backdrop-blur-lg border border-[#f2c9c7]/30 rounded-2xl px-6 py-4 shadow-2xl">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-5 w-5 text-[#f2c9c7] animate-pulse" />
              <p className="text-[#8B5446] font-medium">{showSuccessMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link href="/products" className="inline-flex items-center text-[#8B5446] hover:text-[#f2c9c7] mb-6 transition-all duration-300 group">
            <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Continue Shopping</span>
          </Link>
          <div className="text-center mb-8">
            <h1 className="text-6xl font-light text-[#8B5446] mb-4 animate-slide-up">
              Your <span className="text-[#f2c9c7] font-medium">Beautiful</span> Cart
            </h1>
            <div className="flex items-center justify-center space-x-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <ShoppingBag className="h-6 w-6 text-[#f2c9c7]" />
              <p className="text-xl text-[#8B5446] font-medium">
                {getItemCount()} {getItemCount() === 1 ? 'beautiful item' : 'beautiful items'} waiting for you
              </p>
              <Sparkles className="h-6 w-6 text-[#f2c9c7] animate-pulse" />
            </div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart with Sexy Design
          <div className="text-center py-20 animate-fade-in">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-[#f2c9c7]/30 to-[#e8b4b1]/30 rounded-full blur-2xl animate-pulse"></div>
              <ShoppingBag className="relative h-32 w-32 text-[#f2c9c7]/60 animate-hover-lift" />
            </div>
            <h2 className="text-4xl font-light text-[#8B5446] mb-6">Your cart feels lonely</h2>
            <p className="text-xl text-[#8B5446]/70 mb-10 max-w-md mx-auto leading-relaxed">
              Let's fill it with some absolutely gorgeous pieces that'll make you shine ✨
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-gradient-to-r from-[#f2c9c7] to-[#e8b4b1] hover:from-[#e8b4b1] hover:to-[#d4a4a1] text-white px-12 py-4 text-lg font-medium rounded-2xl shadow-2xl hover:shadow-[#f2c9c7]/25 transition-all duration-500 hover:scale-105 hover-glow">
                <Sparkles className="mr-3 h-6 w-6" />
                Start Your Shopping Journey
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="xl:col-span-2 space-y-6">
              {/* Free Shipping Progress */}
              {subtotal < 50 && (
                <div className="mb-8 animate-slide-up">
                  <Card className="bg-white/70 backdrop-blur-lg border border-[#f2c9c7]/30 shadow-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Gift className="h-6 w-6 text-[#f2c9c7]" />
                          <span className="text-lg font-medium text-[#8B5446]">Free Shipping Progress</span>
                        </div>
                        <span className="text-[#f2c9c7] font-bold">৳{(50 - subtotal).toFixed(2)} to go!</span>
                      </div>
                      <Progress
                        value={freeShippingProgress}
                        className="h-3 bg-[#f2c9c7]/20"
                      />
                      <p className="text-sm text-[#8B5446]/70 mt-2">
                        Add ৳{(50 - subtotal).toFixed(2)} more for free shipping! 🚚
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {cartItems.map((item, index) => (
                <Card
                  key={item.id}
                  className={`bg-white/70 backdrop-blur-lg border border-[#f2c9c7]/30 shadow-2xl hover:shadow-[#f2c9c7]/20 transition-all duration-500 hover:scale-[1.02] animate-slide-up ${removingItems.has(item.id) ? 'animate-slide-out-right opacity-0' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="relative w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#f2c9c7]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-medium text-[#8B5446] mb-2 hover:text-[#f2c9c7] transition-colors cursor-pointer">
                              {item.name}
                            </h3>
                            <p className="text-[#8B5446]/70 mb-3">
                              {item.category}
                            </p>
                          </div>

                          {/* Price Display */}
                          <div className="text-right">
                            <p className="text-2xl font-bold text-[#8B5446] mb-1">
                              ৳{(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-[#8B5446]/60">
                              ৳{item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>

                        {/* Variants Display */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.variant?.size && (
                            <Badge className="bg-[#f2c9c7]/20 text-[#8B5446] border-[#f2c9c7]/30 hover:bg-[#f2c9c7]/30 transition-colors">
                              <Star className="h-3 w-3 mr-1" />
                              Size {item.variant.size}
                            </Badge>
                          )}
                          {item.variant?.colorName && (
                            <Badge className="bg-[#e8b4b1]/20 text-[#8B5446] border-[#e8b4b1]/30 hover:bg-[#e8b4b1]/30 transition-colors">
                              <Sparkles className="h-3 w-3 mr-1" />
                              {item.variant.colorName}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-[#8B5446]">Quantity:</span>
                            <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-[#f2c9c7]/30">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-[#f2c9c7]/20 text-[#8B5446]"
                                onClick={() => updateQuantity(item.id, item.variant, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center font-bold text-[#8B5446] text-lg">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-[#f2c9c7]/20 text-[#8B5446]"
                                onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveToWishlist(item)}
                              className="text-[#f2c9c7] hover:text-[#e8b4b1] hover:bg-[#f2c9c7]/10 transition-all duration-300 rounded-full px-4 py-2"
                            >
                              <Heart className="h-4 w-4 mr-2" />
                              Save for Later
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id, item.variant)}
                              className="text-red-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 rounded-full px-4 py-2"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="xl:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Main Order Summary */}
                <Card className="bg-white/80 backdrop-blur-lg border border-[#f2c9c7]/30 shadow-2xl animate-slide-up" style={{ animationDelay: '0.3s' }}>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-light text-[#8B5446] mb-8 flex items-center">
                      <Package className="mr-3 h-6 w-6 text-[#f2c9c7]" />
                      Order Summary
                    </h3>

                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[#8B5446]/80">Subtotal</span>
                        <span className="font-semibold text-lg text-[#8B5446]">৳{subtotal.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-[#8B5446]/80">Shipping</span>
                        <span className="font-semibold text-lg">
                          {shipping === 0 ? (
                            <span className="text-green-500 flex items-center">
                              <Gift className="h-4 w-4 mr-1" />
                              Free
                            </span>
                          ) : (
                            <span className="text-[#8B5446]">৳{shipping.toFixed(2)}</span>
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-[#8B5446]/80">Tax</span>
                        <span className="font-semibold text-lg text-[#8B5446]">৳{tax.toFixed(2)}</span>
                      </div>

                      {promoDiscount > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-green-500 flex items-center">
                            <Percent className="h-4 w-4 mr-1" />
                            {appliedDiscount ? appliedDiscount.name : 'Discount'}
                          </span>
                          <span className="font-semibold text-lg text-green-500">-৳{promoDiscount.toFixed(2)}</span>
                        </div>
                      )}

                      <Separator className="bg-[#f2c9c7]/30" />

                      <div className="flex justify-between text-2xl font-bold">
                        <span className="text-[#8B5446]">Total</span>
                        <span className="bg-gradient-to-r from-[#f2c9c7] to-[#e8b4b1] bg-clip-text text-transparent">৳{total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Promo Code Section */}
                    <div className="mt-8 p-4 bg-gradient-to-r from-[#f2c9c7]/10 to-[#e8b4b1]/10 rounded-2xl border border-[#f2c9c7]/20">
                      <h4 className="font-semibold text-[#8B5446] mb-3 flex items-center">
                        <Percent className="h-4 w-4 mr-2 text-[#f2c9c7]" />
                        Discount Code
                      </h4>

                      {appliedDiscount ? (
                        // Show applied discount
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="font-medium text-green-700">{appliedDiscount.code}</span>
                              <span className="text-sm text-green-600">- {appliedDiscount.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={removePromoCode}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          {appliedDiscount.freeDelivery && (
                            <div className="flex items-center space-x-2 text-sm text-green-600">
                              <Package className="h-4 w-4" />
                              <span>Free delivery included!</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        // Show discount input
                        <div className="space-y-3">
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Enter discount code"
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                              className="bg-white/80 border-[#f2c9c7]/30 focus:border-[#f2c9c7] rounded-xl"
                              disabled={isValidatingDiscount}
                            />
                            <Button
                              onClick={applyPromoCode}
                              variant="outline"
                              disabled={isValidatingDiscount || !promoCode.trim()}
                              className="border-[#f2c9c7] text-[#f2c9c7] hover:bg-[#f2c9c7] hover:text-white transition-all duration-300 rounded-xl px-6 disabled:opacity-50"
                            >
                              {isValidatingDiscount ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#f2c9c7]"></div>
                              ) : (
                                'Apply'
                              )}
                            </Button>
                          </div>
                          <p className="text-xs text-[#8B5446]/60">💡 Enter your discount code to save on your order!</p>
                        </div>
                      )}
                    </div>

                    <Button
                      size="lg"
                      className="w-full mt-8 bg-gradient-to-r from-[#f2c9c7] to-[#e8b4b1] hover:from-[#e8b4b1] hover:to-[#d4a4a1] text-white py-4 text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-[#f2c9c7]/30 transition-all duration-500 hover:scale-105 animate-pulse-glow"
                      onClick={() => setShowCheckoutModal(true)}
                    >
                      <Sparkles className="mr-3 h-6 w-6" />
                      Proceed to Checkout
                    </Button>

                    {/* Security Badge */}
                    <div className="mt-6 text-center">
                      <div className="flex items-center justify-center space-x-2 text-sm text-[#8B5446]/60">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>🔒 256-bit SSL secured checkout</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Info */}
                <Card className="bg-white/60 backdrop-blur-lg border border-[#f2c9c7]/30 shadow-xl animate-slide-up" style={{ animationDelay: '0.5s' }}>
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-[#8B5446] mb-6 flex items-center text-lg">
                      <Gift className="mr-3 h-5 w-5 text-[#f2c9c7]" />
                      Delivery Perks
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-3 h-3 bg-gradient-to-r from-[#f2c9c7] to-[#e8b4b1] rounded-full mt-1 animate-pulse"></div>
                        <div>
                          <p className="font-medium text-[#8B5446]">Free Express Shipping</p>
                          <p className="text-sm text-[#8B5446]/60">On orders over ৳50</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-3 h-3 bg-gradient-to-r from-[#f2c9c7] to-[#e8b4b1] rounded-full mt-1 animate-pulse" style={{ animationDelay: '1s' }}></div>
                        <div>
                          <p className="font-medium text-[#8B5446]">Lightning Fast</p>
                          <p className="text-sm text-[#8B5446]/60">2-3 business days delivery</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-3 h-3 bg-gradient-to-r from-[#f2c9c7] to-[#e8b4b1] rounded-full mt-1 animate-pulse" style={{ animationDelay: '2s' }}></div>
                        <div>
                          <p className="font-medium text-[#8B5446]">Hassle-Free Returns</p>
                          <p className="text-sm text-[#8B5446]/60">30-day money-back guarantee</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {cartItems.length > 0 && (
          <CheckoutModal
            isOpen={showCheckoutModal}
            onClose={() => setShowCheckoutModal(false)}
            cartItems={convertCartItemsForCheckout(cartItems)}
            orderSummary={{
              subtotal,
              shipping,
              tax,
              discount: promoDiscount,
              discountCode: appliedDiscount?.code || null,
              discountName: appliedDiscount?.name || null,
              freeDelivery: appliedDiscount?.freeDelivery || false,
              total: total
            }}
            onOrderSuccess={handleOrderSuccess}
          />
        )}
      </div>
    </div>
  )
}