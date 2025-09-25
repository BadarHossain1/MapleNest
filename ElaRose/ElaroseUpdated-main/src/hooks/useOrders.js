import { useState, useCallback } from 'react';

export function useOrders() {
    const [loading, setLoading] = useState(false);

    const getUserOrders = useCallback(async (userEmail) => {
        try {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/orders/user/${encodeURIComponent(userEmail)}`);
            const result = await response.json();

            if (result.success) {
                return { success: true, data: result.data };
            } else {
                return { success: false, error: result.error || 'Failed to fetch orders' };
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            return { success: false, error: 'Network error' };
        } finally {
            setLoading(false);
        }
    }, []);

    const getOrderById = useCallback(async (orderId) => {
        try {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/orders/${orderId}`);
            const result = await response.json();

            if (result.success) {
                return { success: true, data: result.data };
            } else {
                return { success: false, error: result.error || 'Order not found' };
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            return { success: false, error: 'Network error' };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        getUserOrders,
        getOrderById
    };
}