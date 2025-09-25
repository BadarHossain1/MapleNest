"use client"

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { ArrowLeft, ShoppingBag, CreditCard, Truck, Shield, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import CheckoutModal from '@/components/ui/checkout-modal';

export default function PremiumCheckoutPage() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get product data from URL params
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, name: 'Review', icon: ShoppingBag, description: 'Product Details' },
    { id: 2, name: 'Payment', icon: CreditCard, description: 'Payment Method' },
    { id: 3, name: 'Complete', icon: Check, description: 'Order Confirmation' }
  ];

  useEffect(() => {
    // Parse order data from URL params - handle both formats
    const encodedData = searchParams.get('data');

    if (encodedData) {
      // New format: encoded JSON data
      try {
        const decodedData = JSON.parse(decodeURIComponent(encodedData));
        setOrderData({
          id: decodedData.productId,
          name: decodedData.productName,
          price: decodedData.price,
          originalPrice: decodedData.originalPrice,
          image: decodedData.productImage,
          quantity: decodedData.quantity,
          size: decodedData.selectedSize,
          color: decodedData.selectedColor,
          colorName: decodedData.colorName,
          categoryName: decodedData.categoryName
        });
      } catch (error) {
        console.error('Error parsing product data:', error);
        alert('Invalid product data');
        router.push('/');
        return;
      }
    } else {
      // Legacy format: individual query parameters
      const productId = searchParams.get('productId');
      const productName = searchParams.get('name');
      const price = searchParams.get('price');
      const image = searchParams.get('image');
      const quantity = searchParams.get('quantity') || '1';
      const size = searchParams.get('size') || 'One Size';
      const color = searchParams.get('color') || '#000000';

      if (productId && productName && price && image) {
        setOrderData({
          id: productId,
          name: decodeURIComponent(productName),
          price: parseFloat(price),
          image: decodeURIComponent(image),
          quantity: parseInt(quantity),
          size,
          color
        });
      } else {
        alert('No product data found');
        router.push('/');
        return;
      }
    }

    setLoading(false);
  }, [user, router, searchParams]);

  const handleOrderSuccess = (orderId) => {
    alert(`Order placed successfully! Your order ID is: ${orderId}`);
    router.push('/account');
  };

  // Convert orderData to cart items format for CheckoutModal
  const convertToCartItems = () => {
    if (!orderData) return [];

    return [{
      _id: orderData.id + '_' + Date.now(),
      productId: orderData.id,
      productName: orderData.name,
      productImage: orderData.image,
      price: orderData.price,
      originalPrice: orderData.originalPrice,
      quantity: orderData.quantity,
      selectedSize: orderData.size,
      selectedColor: orderData.color,
      colorName: orderData.colorName || 'Selected Color',
      categoryName: orderData.categoryName || 'Product'
    }];
  };

  // Calculate order summary
  const calculateOrderSummary = () => {
    if (!orderData) return { subtotal: 0, shipping: 0, tax: 0, total: 0 };

    const subtotal = orderData.price * orderData.quantity;
    const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f2c9c7]/20 via-white to-[#f2c9c7]/10">
        <div className="text-center animate-fade-in transform-gpu">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#f2c9c7]/20 border-t-[#f2c9c7] mx-auto mb-6"></div>
            <div className="absolute inset-0 animate-pulse-glow rounded-full"></div>
          </div>
          <p className="text-[#8B5446] text-xl font-medium animate-fade-in-up">Preparing your premium checkout...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f2c9c7]/20 via-white to-[#f2c9c7]/10">
        <div className="text-center card-glass rounded-2xl p-8 animate-scale-in">
          <p className="text-red-600 mb-6 text-lg">Product data not found</p>
          <Button onClick={() => router.push('/')} className="btn-sexy px-8 py-3 text-lg">
            Return to Home
          </Button>
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

      <div className="relative z-10 pt-8 pb-16">
        <div className="container mx-auto px-4">
          {/* Premium Header */}
          <div className="flex items-center mb-12 animate-fade-in-up">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mr-6 glass-morphism-white hover:glass-morphism px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-[#c66074] mb-2">Premium Checkout</h1>
              <p className="text-[#8B5446]/70 text-lg">Complete your luxury shopping experience</p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="max-w-4xl mx-auto mb-12 animate-fade-in-up stagger-1">
            <div className="glass-morphism rounded-2xl p-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 ${currentStep >= step.id
                        ? 'bg-gradient-to-r from-[#f2c9c7] to-[#e8b4b1] text-white shadow-lg'
                        : 'bg-white/50 text-[#8B5446]/50 border-2 border-[#f2c9c7]/20'
                      }`}>
                      <step.icon className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className={`font-semibold ${currentStep >= step.id ? 'text-[#8B5446]' : 'text-[#8B5446]/50'}`}>
                        {step.name}
                      </p>
                      <p className={`text-sm ${currentStep >= step.id ? 'text-[#8B5446]/70' : 'text-[#8B5446]/40'}`}>
                        {step.description}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-24 h-0.5 ml-8 transition-all duration-500 ${currentStep > step.id ? 'bg-gradient-to-r from-[#f2c9c7] to-[#e8b4b1]' : 'bg-[#f2c9c7]/20'
                        }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-8">
            {/* Product Summary */}
            <div className="lg:col-span-2">
              <div className="card-glass rounded-3xl p-8 mb-8 animate-fade-in-up stagger-2">
                <h2 className="text-2xl font-bold text-[#8B5446] mb-6 flex items-center">
                  <ShoppingBag className="mr-3 h-6 w-6" />
                  Product Details
                </h2>

                <div className="flex space-x-6">
                  <div className="flex-shrink-0">
                    <div className="relative overflow-hidden rounded-2xl">
                      <ImageWithFallback
                        src={orderData.image}
                        alt={orderData.name}
                        className="w-32 h-32 object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-2xl text-[#8B5446] mb-3">{orderData.name}</h3>
                    {orderData.categoryName && (
                      <div className="inline-block bg-[#f2c9c7]/20 text-[#8B5446] px-3 py-1 rounded-full text-sm font-medium mb-3">
                        {orderData.categoryName}
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="text-[#8B5446]/70 w-20">Size:</span>
                        <span className="font-semibold text-[#8B5446]">{orderData.size}</span>
                      </div>
                      {orderData.colorName && (
                        <div className="flex items-center">
                          <span className="text-[#8B5446]/70 w-20">Color:</span>
                          <span className="font-semibold text-[#8B5446]">{orderData.colorName}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <span className="text-[#8B5446]/70 w-20">Quantity:</span>
                        <span className="font-semibold text-[#8B5446]">{orderData.quantity}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mt-4">
                      <span className="font-bold text-3xl text-[#c66074]">${orderData.price.toFixed(2)}</span>
                      {orderData.originalPrice && orderData.originalPrice > orderData.price && (
                        <span className="text-[#8B5446]/50 line-through text-lg">${orderData.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up stagger-3">
                <div className="card-glass rounded-2xl p-6 text-center hover-lift transition-all duration-300">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-white" />
                  </div>
                  <p className="font-bold text-[#8B5446] mb-2">Free Shipping</p>
                  <p className="text-sm text-[#8B5446]/70">On orders over $100</p>
                </div>

                <div className="card-glass rounded-2xl p-6 text-center hover-lift transition-all duration-300">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <p className="font-bold text-[#8B5446] mb-2">Secure Payment</p>
                  <p className="text-sm text-[#8B5446]/70">SSL encrypted checkout</p>
                </div>

                <div className="card-glass rounded-2xl p-6 text-center hover-lift transition-all duration-300">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400 to-purple-500 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <p className="font-bold text-[#8B5446] mb-2">Cash on Delivery</p>
                  <p className="text-sm text-[#8B5446]/70">Pay when you receive</p>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="card-glass rounded-3xl p-8 animate-fade-in-up stagger-4">
                  <h3 className="text-2xl font-bold text-[#8B5446] mb-6">Order Summary</h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-2 border-b border-[#f2c9c7]/20">
                      <span className="text-[#8B5446]/70">Subtotal ({orderData.quantity} item{orderData.quantity > 1 ? 's' : ''})</span>
                      <span className="font-semibold text-[#8B5446]">${calculateOrderSummary().subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-[#f2c9c7]/20">
                      <span className="text-[#8B5446]/70">Shipping</span>
                      <span className={`font-semibold ${calculateOrderSummary().shipping === 0 ? 'text-green-600' : 'text-[#8B5446]'}`}>
                        {calculateOrderSummary().shipping === 0 ? 'Free' : `$${calculateOrderSummary().shipping.toFixed(2)}`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-[#f2c9c7]/20">
                      <span className="text-[#8B5446]/70">Tax</span>
                      <span className="font-semibold text-[#8B5446]">${calculateOrderSummary().tax.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center py-4 bg-gradient-to-r from-[#f2c9c7]/10 to-[#e8b4b1]/10 rounded-2xl px-4 mt-6">
                      <span className="font-bold text-xl text-[#8B5446]">Total</span>
                      <span className="font-bold text-2xl text-[#c66074]">${calculateOrderSummary().total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    size="lg"
                    className="w-full btn-sexy py-4 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    onClick={() => setShowCheckoutModal(true)}
                  >
                    Complete Order - ${calculateOrderSummary().total.toFixed(2)}
                  </Button>

                  <p className="text-center text-sm text-[#8B5446]/60 mt-4">
                    Secure checkout powered by premium encryption
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Modal */}
          <CheckoutModal
            isOpen={showCheckoutModal}
            onClose={() => setShowCheckoutModal(false)}
            cartItems={convertToCartItems()}
            orderSummary={calculateOrderSummary()}
            onOrderSuccess={handleOrderSuccess}
          />
        </div>
      </div>
    </div>
  );
}