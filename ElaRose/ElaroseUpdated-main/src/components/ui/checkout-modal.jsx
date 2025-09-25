import { useState } from 'react';
import { X, Truck, Shield, DollarSign } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Separator } from './separator';
import { useUser } from '@clerk/nextjs';
import { generateInvoice, formatOrderDataForInvoice } from '@/lib/invoiceGenerator';

export default function CheckoutModal({
    isOpen,
    onClose,
    cartItems,
    orderSummary,
    onOrderSuccess
}) {
    const { user } = useUser();
    const [processing, setProcessing] = useState(false);

    const [shippingForm, setShippingForm] = useState({
        fullName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
        email: user?.emailAddresses?.[0]?.emailAddress || '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States'
    });

    const handleShippingInputChange = (field, value) => {
        setShippingForm(prev => ({
            ...prev,
            [field]: value
        }));
    };



    const validateForm = () => {
        const required = ['fullName', 'email', 'phone', 'addressLine1', 'city', 'state', 'zipCode'];
        for (const field of required) {
            if (!shippingForm[field].trim()) {
                alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                return false;
            }
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(shippingForm.email)) {
            alert('Please enter a valid email address');
            return false;
        }

        // Phone validation
        const phoneRegex = /^\+?[\d\s-()]+$/;
        if (!phoneRegex.test(shippingForm.phone)) {
            alert('Please enter a valid phone number');
            return false;
        }



        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setProcessing(true);

        try {
            // Generate guest user ID if user is not logged in
            const guestUserId = user?.id || `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const userEmail = user?.emailAddresses?.[0]?.emailAddress || shippingForm.email;

            const orderData = {
                userId: guestUserId,
                userEmail: userEmail,
                isGuestOrder: !user, // Flag to indicate if this is a guest order
                items: cartItems.map(item => ({
                    productId: item.productId,
                    productName: item.productName,
                    productImage: item.productImage,
                    price: item.price,
                    originalPrice: item.originalPrice,
                    quantity: item.quantity,
                    selectedSize: item.selectedSize,
                    selectedColor: item.selectedColor,
                    colorName: item.colorName,
                    categoryName: item.categoryName
                })),
                shippingAddress: shippingForm,
                orderSummary,
                paymentMethod: 'cod'
            };

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const result = await response.json();

            if (result.success) {
                // Generate and download invoice
                try {
                    const invoiceData = formatOrderDataForInvoice(
                        {
                            items: cartItems,
                            totalAmount: orderSummary.total,
                            shippingCost: orderSummary.shipping,
                            tax: orderSummary.tax || 0,
                            paymentMethod: 'Cash on Delivery'
                        },
                        {
                            customerName: shippingForm.fullName,
                            email: shippingForm.email,
                            phone: shippingForm.phone,
                            address: `${shippingForm.addressLine1}, ${shippingForm.addressLine2 ? shippingForm.addressLine2 + ', ' : ''}${shippingForm.city}, ${shippingForm.state} ${shippingForm.zipCode}, ${shippingForm.country}`
                        },
                        {
                            orderId: result.data.orderId || result.data._id,
                            status: 'Confirmed',
                            createdAt: new Date().toISOString()
                        }
                    );

                    const filename = generateInvoice(invoiceData, {
                        orderId: result.data.orderId || result.data._id,
                        status: 'Confirmed'
                    });

                    // Show success message with invoice info
                    setTimeout(() => {
                        alert(`🎉 Order Placed Successfully!\n\nOrder ID: ${result.data.orderId || result.data._id}\n\n📄 Invoice Downloaded: ${filename}\n\nYou can find your invoice in the Downloads folder. Thank you for shopping with ElaRose!`);
                    }, 500); // Small delay to ensure modal closes first
                } catch (invoiceError) {
                    console.error('Failed to generate invoice:', invoiceError);
                    // Still show success for the order, even if invoice fails
                    setTimeout(() => {
                        alert(`🎉 Order Placed Successfully!\n\nOrder ID: ${result.data.orderId || result.data._id}\n\n⚠️ Invoice generation failed, but your order was processed successfully. You can contact support for a manual invoice if needed.\n\nThank you for shopping with ElaRose!`);
                    }, 500);
                }

                // Close modal and call success callback
                onClose();
                if (onOrderSuccess) onOrderSuccess(result.data.orderId || result.data._id);
            } else {
                alert(result.message || 'Failed to place order. Please try again.');
            }

        } catch (error) {
            console.error('Order submission error:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-semibold">Checkout</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                    {/* Left Column - Forms */}
                    <div className="space-y-6">
                        {/* Shipping Information */}
                        <div>
                            <h3 className="text-lg font-medium mb-4">Shipping Information</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="fullName">Full Name *</Label>
                                        <Input
                                            id="fullName"
                                            value={shippingForm.fullName}
                                            onChange={(e) => handleShippingInputChange('fullName', e.target.value)}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={shippingForm.email}
                                            onChange={(e) => handleShippingInputChange('email', e.target.value)}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={shippingForm.phone}
                                        onChange={(e) => handleShippingInputChange('phone', e.target.value)}
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                                    <Input
                                        id="addressLine1"
                                        value={shippingForm.addressLine1}
                                        onChange={(e) => handleShippingInputChange('addressLine1', e.target.value)}
                                        placeholder="123 Main Street"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="addressLine2">Address Line 2</Label>
                                    <Input
                                        id="addressLine2"
                                        value={shippingForm.addressLine2}
                                        onChange={(e) => handleShippingInputChange('addressLine2', e.target.value)}
                                        placeholder="Apt, Suite, Unit (Optional)"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="city">City *</Label>
                                        <Input
                                            id="city"
                                            value={shippingForm.city}
                                            onChange={(e) => handleShippingInputChange('city', e.target.value)}
                                            placeholder="New York"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="state">State *</Label>
                                        <Input
                                            id="state"
                                            value={shippingForm.state}
                                            onChange={(e) => handleShippingInputChange('state', e.target.value)}
                                            placeholder="NY"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="zipCode">ZIP Code *</Label>
                                        <Input
                                            id="zipCode"
                                            value={shippingForm.zipCode}
                                            onChange={(e) => handleShippingInputChange('zipCode', e.target.value)}
                                            placeholder="10001"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="country">Country *</Label>
                                        <Input
                                            id="country"
                                            value={shippingForm.country}
                                            onChange={(e) => handleShippingInputChange('country', e.target.value)}
                                            placeholder="United States"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div>
                            <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center space-x-2 mb-3">
                                    {/* <DollarSign className="h-5 w-5 text-green-600" /> */}
                                    <span className="font-medium text-green-800 text-lg">৳     Cash on Delivery</span>
                                </div>
                                <div className="text-sm text-green-600 space-y-1">
                                    <p>• Pay when you receive your order</p>
                                    <p>• No advance payment required</p>
                                    <p>• Exact change recommended</p>
                                    <p>• Safe and secure payment method</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div>
                        <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                            <h3 className="text-lg font-medium mb-4">Order Summary</h3>

                            {/* Items */}
                            <div className="space-y-3 mb-6">
                                {cartItems.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <img
                                            src={item.productImage}
                                            alt={item.productName}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{item.productName}</p>
                                            <p className="text-sm text-gray-600">
                                                {item.selectedSize} • {item.colorName} • Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">৳{(item.price * item.quantity).toFixed(2)}</p>
                                            {item.originalPrice && item.originalPrice > item.price && (
                                                <p className="text-sm text-gray-500 line-through">
                                                    ৳{(item.originalPrice * item.quantity).toFixed(2)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-4" />

                            {/* Summary */}
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>৳{orderSummary.subtotal.toFixed(2)}</span>
                                </div>

                                {orderSummary.discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount {orderSummary.discountCode ? `(${orderSummary.discountCode})` : ''}</span>
                                        <span>-${orderSummary.discount.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className={orderSummary.shipping === 0 ? 'text-green-600' : ''}>
                                        {orderSummary.shipping === 0 ? 'Free' : `$${orderSummary.shipping.toFixed(2)}`}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Tax</span>
                                    <span>৳{orderSummary.tax.toFixed(2)}</span>
                                </div>

                                <Separator className="my-2" />

                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span>৳{orderSummary.total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="space-y-2 mb-6 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <Truck className="h-4 w-4" />
                                    <span>Free shipping on orders over $100</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <DollarSign className="h-4 w-4" />
                                    <span>Cash on delivery - Pay when you receive</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Shield className="h-4 w-4" />
                                    <span>Safe and secure delivery</span>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <Button
                                onClick={handleSubmit}
                                disabled={processing}
                                className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg"
                                size="lg"
                            >
                                {processing ? (
                                    'Processing...'
                                ) : (
                                    `Place Order - ৳${orderSummary.total.toFixed(2)}`
                                )}
                            </Button>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                By placing your order, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}