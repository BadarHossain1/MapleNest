import { useState, useEffect } from 'react';

export const useDiscounts = () => {
    const [activeDiscounts, setActiveDiscounts] = useState([]);
    const [currentDiscountIndex, setCurrentDiscountIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fetch active discounts from API
    useEffect(() => {
        const fetchActiveDiscounts = async () => {
            try {
                setLoading(true);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://elarose-server.onrender.com';
                console.log('Fetching active discounts from:', `${apiUrl}/api/discounts/active`);

                const response = await fetch(`${apiUrl}/api/discounts/active`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Active discounts API response:', result);

                if (result.success && result.data.length > 0) {
                    setActiveDiscounts(result.data);
                } else {
                    // Fallback to default message if no active discounts
                    setActiveDiscounts([{
                        code: 'FREESHIP',
                        name: 'Free Shipping',
                        description: 'Free shipping on orders over $100',
                        minOrderAmount: 100,
                        freeDelivery: true
                    }]);
                }
            } catch (error) {
                console.error('Error fetching active discounts:', error);
                // Fallback to default message on error
                setActiveDiscounts([{
                    code: 'FREESHIP',
                    name: 'Free Shipping',
                    description: 'Free shipping on orders over $100',
                    minOrderAmount: 100,
                    freeDelivery: true
                }]);
            } finally {
                setLoading(false);
            }
        };

        fetchActiveDiscounts();
    }, []);

    // Rotate through active discounts every 5 seconds
    useEffect(() => {
        if (activeDiscounts.length > 1) {
            const interval = setInterval(() => {
                setCurrentDiscountIndex((prevIndex) =>
                    (prevIndex + 1) % activeDiscounts.length
                );
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [activeDiscounts]);

    // Format discount message
    const getCurrentDiscountMessage = () => {
        if (activeDiscounts.length === 0) {
            return 'Free shipping on orders over $100 | Use code: FREESHIP';
        }

        const currentDiscount = activeDiscounts[currentDiscountIndex];

        let message = '';

        if (currentDiscount.freeDelivery) {
            message = `Free shipping on orders over $${currentDiscount.minOrderAmount || 100}`;
        } else if (currentDiscount.type === 'percentage') {
            message = `${currentDiscount.value}% off ${currentDiscount.minOrderAmount ? `orders over $${currentDiscount.minOrderAmount}` : 'all orders'}`;
        } else if (currentDiscount.type === 'fixed') {
            message = `$${currentDiscount.value} off ${currentDiscount.minOrderAmount ? `orders over $${currentDiscount.minOrderAmount}` : 'all orders'}`;
        } else {
            message = currentDiscount.description || currentDiscount.name;
        }

        return `${message} | Use code: ${currentDiscount.code}`;
    };

    return {
        activeDiscounts,
        currentDiscountIndex,
        loading,
        getCurrentDiscountMessage
    };
};