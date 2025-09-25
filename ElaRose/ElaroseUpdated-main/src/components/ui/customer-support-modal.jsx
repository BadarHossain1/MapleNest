"use client"

import React, { useState, useEffect, useRef } from 'react';
import {
    X, Send, MessageCircle, User, Shield, Clock, CheckCircle2,
    Loader2, AlertCircle, Paperclip, Smile
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSupport } from '@/hooks/useSupport';

export default function CustomerSupportModal({
    isOpen,
    onClose,
    order,
    user
}) {
    const { messages, loading, error, fetchMessages, sendMessage, markAsRead } = useSupport();
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const messageInputRef = useRef(null);

    // Fetch messages when modal opens
    useEffect(() => {
        if (isOpen && order && user) {
            fetchMessages(order._id, user.email);
            markAsRead(order._id, user.email);
        }
    }, [isOpen, order, user]);

    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && messageInputRef.current) {
            setTimeout(() => {
                messageInputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || sending) return;

        const messageText = newMessage.trim();
        setNewMessage('');
        setSending(true);

        try {
            const messageData = {
                orderId: order._id,
                orderNumber: order._id.slice(-6),
                userDetails: {
                    id: user.id,
                    name: user.fullName || user.name || 'Customer',
                    email: user.email,
                    profileImage: user.profileImage || user.imageUrl
                },
                orderDetails: {
                    id: order._id || 'N/A',
                    totalAmount: order.totalAmount || 0,
                    status: order.status || 'Unknown',
                    createdAt: order.createdAt || new Date().toISOString(),
                    items: order.items?.map(item => ({
                        name: item.productName || item.name || 'Unknown Product',
                        quantity: item.quantity || 1,
                        price: item.price || 0
                    })) || []
                },
                message: messageText,
                sender: 'customer',
                timestamp: new Date().toISOString(),
                isRead: false
            };

            console.log('Sending message data:', messageData);
            const result = await sendMessage(messageData);

            if (!result.success) {
                setNewMessage(messageText); // Restore message on failure
                console.error('Failed to send message:', result.error);
            } else {
                console.log('Message sent successfully:', result.data);
            }
        } catch (error) {
            setNewMessage(messageText); // Restore message on failure
            console.error('Error sending message:', error);
            // You could add a toast notification here to show the error to the user
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;

        return date.toLocaleDateString();
    };

    const renderConversation = () => {
        // Handle null or empty messages
        if (!messages) {
            return [];
        }

        // If messages is still the old format (array of messages), use it directly
        if (Array.isArray(messages) && messages.length > 0 && messages[0].message) {
            return messages.map((message, index) => renderMessage(message, index));
        }

        // If messages is the new format (Support document), extract messages and replies
        if (messages && typeof messages === 'object' && !Array.isArray(messages)) {
            const allMessages = [];

            // Add customer messages
            if (messages.messages && Array.isArray(messages.messages)) {
                messages.messages.forEach(msg => {
                    allMessages.push({
                        ...msg,
                        sender: 'customer'
                    });
                });
            }

            // Add admin replies
            if (messages.replies && Array.isArray(messages.replies)) {
                messages.replies.forEach(reply => {
                    allMessages.push({
                        ...reply,
                        sender: 'admin'
                    });
                });
            }

            // Sort by timestamp
            allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            return allMessages.map((message, index) => renderMessage(message, index));
        }

        return [];
    };

    const renderMessage = (message, index) => (
        <div
            key={`${message.sender}-${index}-${message.timestamp}`}
            className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className={`max-w-[80%] ${message.sender === 'customer' ? 'order-2' : 'order-1'}`}>
                {/* Message Bubble */}
                <div
                    className={`rounded-2xl px-4 py-3 ${message.sender === 'customer'
                        ? 'bg-gradient-to-r from-[#f2c9c7] to-[#e8b4b1] text-white'
                        : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                        }`}
                >
                    <p className="whitespace-pre-wrap break-words">{message.message || message.text}</p>
                </div>

                {/* Message Info */}
                <div className={`flex items-center gap-2 mt-1 px-2 ${message.sender === 'customer' ? 'justify-end' : 'justify-start'
                    }`}>
                    <div className="flex items-center gap-1">
                        {message.sender === 'admin' && (
                            <Shield className="w-3 h-3 text-[#f2c9c7]" />
                        )}
                        <span className="text-xs text-gray-500">
                            {message.sender === 'admin' ? 'Support Team' : 'You'}
                        </span>
                    </div>
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                        {formatTime(message.timestamp)}
                    </span>
                    {message.sender === 'customer' && (
                        <CheckCircle2 className={`w-3 h-3 ${message.isRead ? 'text-green-500' : 'text-gray-400'}`} />
                    )}
                </div>
            </div>

            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex-shrink-0 ${message.sender === 'customer' ? 'order-1 ml-3' : 'order-2 mr-3'
                } ${message.sender === 'customer' ? 'self-end' : 'self-end'}`}>
                {message.sender === 'customer' ? (
                    <img
                        src={user?.profileImage || user?.imageUrl || '/default-avatar.png'}
                        alt="You"
                        className="w-full h-full rounded-full object-cover border-2 border-[#f2c9c7]/30"
                        onError={(e) => {
                            e.target.src = '/default-avatar.png';
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#f2c9c7] to-[#e8b4b1] rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                    </div>
                )}
            </div>
        </div>
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-2xl h-[600px] flex flex-col shadow-2xl animate-scale-in border border-[#f2c9c7]/20">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#f2c9c7]/20 bg-gradient-to-r from-[#f2c9c7]/10 to-[#e8b4b1]/10 rounded-t-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#f2c9c7] to-[#e8b4b1] rounded-full flex items-center justify-center">
                            <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Customer Support</h2>
                            <p className="text-sm text-gray-600">Order #{order?._id?.slice(-6) || 'N/A'}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Order Info Banner */}
                <div className="px-6 py-4 bg-gradient-to-r from-[#f2c9c7]/5 to-[#e8b4b1]/5 border-b border-[#f2c9c7]/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-[#f2c9c7]/20 text-[#8B5446] border-[#f2c9c7]/30">
                                Order #{order?._id?.slice(-6)}
                            </Badge>
                            <span className="text-sm text-gray-600">${order?.totalAmount?.toFixed(2)}</span>
                            {/* Ticket Status */}
                            {messages && typeof messages === 'object' && !Array.isArray(messages) && messages.status && (
                                <Badge className={`${getTicketStatusColor(messages.status)} text-white text-xs`}>
                                    {messages.status}
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className={`${getOrderStatusColor(order?.status)} text-white`}>
                                {order?.status || 'Unknown'}
                            </Badge>
                            {/* Ticket Priority */}
                            {messages && typeof messages === 'object' && !Array.isArray(messages) && messages.priority && (
                                <Badge className={`${getPriorityColor(messages.priority)} text-white text-xs`}>
                                    {messages.priority}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50/50 to-white">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <Loader2 className="w-8 h-8 text-[#f2c9c7] animate-spin mx-auto mb-3" />
                                <p className="text-gray-500">Loading messages...</p>
                            </div>
                        </div>
                    ) : !messages || (Array.isArray(messages) && messages.length === 0) ||
                        (messages && typeof messages === 'object' && !Array.isArray(messages) &&
                            (!messages.messages || messages.messages.length === 0) &&
                            (!messages.replies || messages.replies.length === 0)) ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <MessageCircle className="w-16 h-16 text-[#f2c9c7]/50 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Start a Conversation</h3>
                                <p className="text-gray-500 mb-4">Send a message to get help with your order</p>
                                <div className="bg-[#f2c9c7]/10 rounded-xl p-4 max-w-md">
                                    <p className="text-sm text-gray-600">
                                        💬 Our support team typically responds within 2-4 hours during business hours
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        renderConversation()
                    )}

                    {error && (
                        <div className="flex items-center justify-center p-4">
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t border-[#f2c9c7]/20 p-4 bg-white rounded-b-2xl">
                    <div className="flex items-end gap-3">
                        <div className="flex-1">
                            <div className="relative">
                                <Input
                                    ref={messageInputRef}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message..."
                                    disabled={sending}
                                    className="pr-12 py-3 border-[#f2c9c7]/30 focus:border-[#f2c9c7] rounded-xl bg-gray-50/50 transition-all duration-200"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="w-8 h-8 text-gray-400 hover:text-gray-600"
                                        disabled
                                    >
                                        <Smile className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Press Enter to send, Shift+Enter for new line</p>
                        </div>

                        <Button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || sending}
                            className="bg-gradient-to-r from-[#f2c9c7] to-[#e8b4b1] hover:from-[#e8b4b1] hover:to-[#d4a4a1] text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {sending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper function for order status colors
const getOrderStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'delivered': return 'bg-green-500';
        case 'shipped': return 'bg-blue-500';
        case 'processing': return 'bg-yellow-500';
        case 'cancelled': return 'bg-red-500';
        default: return 'bg-gray-500';
    }
};

// Helper function for ticket status colors
const getTicketStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'open': return 'bg-red-500';
        case 'in-progress': return 'bg-blue-500';
        case 'pending': return 'bg-yellow-500';
        case 'resolved': return 'bg-green-500';
        case 'closed': return 'bg-gray-500';
        default: return 'bg-gray-400';
    }
};

// Helper function for priority colors
const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
        case 'urgent': return 'bg-red-600';
        case 'high': return 'bg-orange-500';
        case 'medium': return 'bg-yellow-500';
        case 'low': return 'bg-green-500';
        default: return 'bg-gray-400';
    }
};