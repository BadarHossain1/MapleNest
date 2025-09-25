import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Edit, Eye, User, Loader } from 'lucide-react';

// Order Details View Component
function OrderDetailsView({ order }) {
    return (
        <div className="space-y-6">
            {/* Order Summary */}
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium mb-2">Order Information</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Order ID:</span>
                                <span className="font-medium">{order.orderId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Date:</span>
                                <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                            </div>
                            <div className="flex justify-between">
                                <span>Channel:</span>
                                <Badge variant={order.channel === 'online' ? 'default' : 'secondary'}>
                                    {order.channel.charAt(0).toUpperCase() + order.channel.slice(1)}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium mb-2">Customer Information</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {order.shippingAddress.fullName}
                            </div>
                            <div className="flex items-center gap-2">
                                <span>📧</span>
                                {order.userEmail}
                            </div>
                            <div className="flex items-center gap-2">
                                <span>📞</span>
                                {order.shippingAddress.phone}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shipping Address */}
            <div>
                <h4 className="font-medium mb-2">Shipping Address</h4>
                <div className="text-sm text-muted-foreground">
                    <p>{order.shippingAddress.addressLine1}</p>
                    {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                    <p>{order.shippingAddress.country}</p>
                </div>
            </div>

            {/* Order Items */}
            <div>
                <h4 className="font-medium mb-2">Order Items</h4>
                <div className="space-y-3">
                    {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                            <img src={item.productImage} alt={item.productName} className="w-16 h-16 object-cover rounded" />
                            <div className="flex-1">
                                <h5 className="font-medium">{item.productName}</h5>
                                <p className="text-sm text-muted-foreground">
                                    Size: {item.selectedSize} | Color: {item.colorName}
                                </p>
                                <p className="text-sm">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">৳{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Order Summary */}
            <div>
                <h4 className="font-medium mb-2">Order Summary</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>৳{order.orderSummary.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>৳{order.orderSummary.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>৳{order.orderSummary.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>৳{order.orderSummary.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {order.notes && (
                <div>
                    <h4 className="font-medium mb-2">Order Notes</h4>
                    <p className="text-sm text-muted-foreground">{order.notes}</p>
                </div>
            )}
        </div>
    );
}

// Edit Order Form Component
function EditOrderForm({ order, onClose, onUpdate }) {
    const [formData, setFormData] = useState({
        status: order.status,
        channel: order.channel
    });
    const [updateLoading, setUpdateLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);

        try {
            await onUpdate(order.orderId, formData);
            alert('Order updated successfully!');
            onClose();
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order. Please try again.');
        } finally {
            setUpdateLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="status">Order Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="canceled">Canceled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="channel">Order Channel</Label>
                    <Select value={formData.channel} onValueChange={(value) => setFormData({ ...formData, channel: value })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select channel" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="store">Store</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" disabled={updateLoading}>
                    {updateLoading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
                    Update Order
                </Button>
            </DialogFooter>
        </form>
    );
}

const OrderManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedChannel, setSelectedChannel] = useState('all');
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [editingOrder, setEditingOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [orderStats, setOrderStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        shippedOrders: 0,
        canceledOrders: 0,
        onlineOrders: 0,
        storeOrders: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        fetchOrdersData();
    }, []);

    const fetchOrdersData = async () => {
        try {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/orders`);
            const result = await response.json();

            if (result.success) {
                const ordersData = result.data;
                setOrders(ordersData);

                // Calculate statistics
                const stats = {
                    totalOrders: ordersData.length,
                    pendingOrders: ordersData.filter((order) => order.status === 'pending').length,
                    completedOrders: ordersData.filter((order) => order.status === 'completed').length,
                    shippedOrders: ordersData.filter((order) => order.status === 'shipped').length,
                    canceledOrders: ordersData.filter((order) => order.status === 'canceled').length,
                    onlineOrders: ordersData.filter((order) => order.channel === 'online').length,
                    storeOrders: ordersData.filter((order) => order.channel === 'store').length,
                    totalRevenue: ordersData.reduce((sum, order) => sum + order.orderSummary.total, 0)
                };

                setOrderStats(stats);
            } else {
                setError('Failed to load orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderDetails = async (orderId, updateData) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            const result = await response.json();

            if (result.success) {
                await fetchOrdersData(); // Refresh data
                return true;
            } else {
                throw new Error(result.error || 'Failed to update order');
            }
        } catch (error) {
            console.error('Error updating order:', error);
            throw error;
        }
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'pending': return 'secondary';
            case 'completed': return 'default';
            case 'shipped': return 'outline';
            case 'canceled': return 'destructive';
            default: return 'outline';
        }
    };

    const getChannelBadgeVariant = (channel) => {
        switch (channel) {
            case 'online': return 'default';
            case 'store': return 'secondary';
            default: return 'outline';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
        const matchesChannel = selectedChannel === 'all' || order.channel === selectedChannel;
        return matchesSearch && matchesStatus && matchesChannel;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader className="h-8 w-8 animate-spin mr-2" />
                <span>Loading orders...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Order Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {orderStats.totalOrders.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">All time orders</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {orderStats.pendingOrders.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">Awaiting processing</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Online Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {orderStats.onlineOrders.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {orderStats.totalOrders > 0 ? `${((orderStats.onlineOrders / orderStats.totalOrders) * 100).toFixed(1)}% of total` : '0%'}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ৳{orderStats.totalRevenue.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">All time revenue</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                            <CardTitle>Order Management</CardTitle>
                            <CardDescription>Track and update order status and channel</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="canceled">Canceled</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="All Channels" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Channels</SelectItem>
                                <SelectItem value="online">Online</SelectItem>
                                <SelectItem value="store">Store</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Orders Table */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Channel</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No orders found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredOrders.map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell>
                                            <div className="font-medium">{order.orderId}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{order.shippingAddress.fullName}</div>
                                                <div className="text-sm text-muted-foreground">{order.userEmail}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(order.status)}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getChannelBadgeVariant(order.channel)}>
                                                {order.channel.charAt(0).toUpperCase() + order.channel.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>৳{order.orderSummary.total.toFixed(2)}</TableCell>
                                        <TableCell>
                                            {new Date(order.orderDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                                        <DialogHeader>
                                                            <DialogTitle>Order Details - {order.orderId}</DialogTitle>
                                                            <DialogDescription>Complete order information</DialogDescription>
                                                        </DialogHeader>
                                                        {selectedOrder && <OrderDetailsView order={selectedOrder} />}
                                                    </DialogContent>
                                                </Dialog>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="sm" onClick={() => setEditingOrder(order)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-md">
                                                        <DialogHeader>
                                                            <DialogTitle>Update Order - {order.orderId}</DialogTitle>
                                                            <DialogDescription>Change order status and channel</DialogDescription>
                                                        </DialogHeader>
                                                        {editingOrder && (
                                                            <EditOrderForm
                                                                order={editingOrder}
                                                                onClose={() => setEditingOrder(null)}
                                                                onUpdate={updateOrderDetails}
                                                            />
                                                        )}
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default OrderManagement;
