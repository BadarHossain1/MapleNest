import { useState } from 'react';

export const useSupport = () => {
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);

    // Fetch messages for a specific order
    const fetchMessages = async (orderId, userEmail) => {
        try {
            setLoading(true);
            setError(null);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/support/${orderId}?userEmail=${encodeURIComponent(userEmail)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (result.success) {
                setMessages(result.data || null);
                return { success: true, data: result.data };
            } else {
                setError(result.message || 'Failed to fetch messages');
                return { success: false, error: result.message };
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            setError('Failed to fetch messages');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // Send a new message
    const sendMessage = async (messageData) => {
        try {
            setLoading(true);
            setError(null);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/support`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageData),
            });

            const result = await response.json();
            console.log('Support API response:', result);

            if (result.success) {
                // Update local state with the full support document
                setMessages(result.data);
                return { success: true, data: result.data };
            } else {
                console.error('Support API error:', result);
                setError(result.message || 'Failed to send message');
                return { success: false, error: result.message };
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Failed to send message');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // Mark messages as read
    const markAsRead = async (orderId, userEmail) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/support/${orderId}/read`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userEmail }),
            });

            const result = await response.json();
            return { success: result.success, data: result.data };
        } catch (error) {
            console.error('Error marking messages as read:', error);
            return { success: false, error: error.message };
        }
    };

    return {
        messages,
        loading,
        error,
        fetchMessages,
        sendMessage,
        markAsRead,
        setMessages
    };
};