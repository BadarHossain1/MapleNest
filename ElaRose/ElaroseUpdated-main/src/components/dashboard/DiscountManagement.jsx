import { useState, useEffect } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    Search,
    Eye,
    EyeOff,
    Loader,
    Percent,
    DollarSign,
    Truck,
    Users,
    Hash,
    CheckCircle,
    Copy,
    AlertCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';

export default function DiscountManagement() {
    const [discounts, setDiscounts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingDiscount, setEditingDiscount] = useState(null);
    const [stats, setStats] = useState({
        totalDiscounts: 0,
        activeDiscounts: 0,
        totalUsage: 0,
        totalSavings: 0
    });

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        type: 'percentage',
        value: 0,
        minOrderAmount: 0,
        maxDiscountAmount: null,
        freeDelivery: false,
        usageLimit: null,
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: '',
        isActive: true,
        applicableCategories: [],
        excludedCategories: []
    });

    useEffect(() => {
        fetchDiscounts();
    }, []);

    useEffect(() => {
        calculateStats();
    }, [discounts]);

    const fetchDiscounts = async () => {
        try {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/discounts`);
            const result = await response.json();

            if (result?.success) {
                setDiscounts(result.data || []);
            } else {
                // Mock data if API doesn't exist yet
                const mockDiscounts = [
                    {
                        _id: '1',
                        code: 'SUMMER20',
                        name: 'Summer Sale 20% Off',
                        description: 'Get 20% off on all summer collection items',
                        type: 'percentage',
                        value: 20,
                        minOrderAmount: 50,
                        maxDiscountAmount: 100,
                        freeDelivery: false,
                        usageLimit: 100,
                        usedCount: 45,
                        validFrom: '2024-01-01',
                        validUntil: '2024-12-31',
                        isActive: true,
                        createdBy: 'Admin',
                        applicableCategories: ['dresses', 'tops'],
                        excludedCategories: [],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        _id: '2',
                        code: 'NEWUSER',
                        name: 'New User Discount',
                        description: 'Welcome discount for first-time customers',
                        type: 'fixed',
                        value: 15,
                        minOrderAmount: 75,
                        maxDiscountAmount: null,
                        freeDelivery: true,
                        usageLimit: null,
                        usedCount: 23,
                        validFrom: '2024-01-01',
                        validUntil: '2024-12-31',
                        isActive: true,
                        createdBy: 'Admin',
                        applicableCategories: [],
                        excludedCategories: ['sale'],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        _id: '3',
                        code: 'EXPIRED10',
                        name: 'Expired Discount',
                        description: 'This discount has expired',
                        type: 'percentage',
                        value: 10,
                        minOrderAmount: 0,
                        maxDiscountAmount: 50,
                        freeDelivery: false,
                        usageLimit: 50,
                        usedCount: 50,
                        validFrom: '2023-01-01',
                        validUntil: '2023-12-31',
                        isActive: false,
                        createdBy: 'Admin',
                        applicableCategories: [],
                        excludedCategories: [],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }
                ];
                setDiscounts(mockDiscounts);
            }
        } catch (error) {
            console.error('Error fetching discounts:', error);
            setError('Failed to load discounts');
            // Set mock data as fallback
            const mockDiscounts = [
                {
                    _id: '1',
                    code: 'SUMMER20',
                    name: 'Summer Sale 20% Off',
                    description: 'Get 20% off on all summer collection items',
                    type: 'percentage',
                    value: 20,
                    minOrderAmount: 50,
                    maxDiscountAmount: 100,
                    freeDelivery: false,
                    usageLimit: 100,
                    usedCount: 45,
                    validFrom: '2024-01-01',
                    validUntil: '2024-12-31',
                    isActive: true,
                    createdBy: 'Admin',
                    applicableCategories: ['dresses', 'tops'],
                    excludedCategories: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ];
            setDiscounts(mockDiscounts);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = () => {
        const totalDiscounts = discounts.length;
        const activeDiscounts = discounts.filter(d => d.isActive).length;
        const totalUsage = discounts.reduce((sum, d) => sum + (d.usedCount || 0), 0);
        const totalSavings = discounts.reduce((sum, d) => {
            const usage = d.usedCount || 0;
            if (d.type === 'percentage') {
                return sum + (usage * (d.value || 0)); // Approximation
            } else {
                return sum + (usage * (d.value || 0));
            }
        }, 0);

        setStats({
            totalDiscounts,
            activeDiscounts,
            totalUsage,
            totalSavings
        });
    };

    const resetForm = () => {
        setFormData({
            code: '',
            name: '',
            description: '',
            type: 'percentage',
            value: 0,
            minOrderAmount: 0,
            maxDiscountAmount: null,
            freeDelivery: false,
            usageLimit: null,
            validFrom: new Date().toISOString().split('T')[0],
            validUntil: '',
            isActive: true,
            applicableCategories: [],
            excludedCategories: []
        });
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        if (!formData.code.trim()) {
            setMessage({ type: 'error', text: 'Discount code is required' });
            return false;
        }
        if (!formData.name.trim()) {
            setMessage({ type: 'error', text: 'Discount name is required' });
            return false;
        }
        if (formData.value <= 0) {
            setMessage({ type: 'error', text: 'Discount value must be greater than 0' });
            return false;
        }
        if (formData.type === 'percentage' && formData.value > 100) {
            setMessage({ type: 'error', text: 'Percentage value cannot exceed 100%' });
            return false;
        }
        if (!formData.validUntil) {
            setMessage({ type: 'error', text: 'Valid until date is required' });
            return false;
        }
        if (new Date(formData.validUntil) <= new Date(formData.validFrom)) {
            setMessage({ type: 'error', text: 'Valid until date must be after valid from date' });
            return false;
        }
        return true;
    };

    const handleCreateDiscount = async () => {
        if (!validateForm()) return;

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/discounts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    createdBy: 'Admin', // Replace with actual user info
                }),
            });

            const result = await response.json();

            if (result?.success) {
                setMessage({ type: 'success', text: 'Discount code created successfully' });
                setShowCreateModal(false);
                resetForm();
                fetchDiscounts();
            } else {
                // Mock successful creation
                const newDiscount = {
                    _id: Date.now().toString(),
                    ...formData,
                    usedCount: 0,
                    createdBy: 'Admin',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                setDiscounts(prev => [...prev, newDiscount]);
                setMessage({ type: 'success', text: 'Discount code created successfully' });
                setShowCreateModal(false);
                resetForm();
            }
        } catch (error) {
            console.error('Error creating discount:', error);
            setMessage({ type: 'error', text: 'Failed to create discount' });
        }
    };

    const handleEditDiscount = async () => {
        if (!validateForm() || !editingDiscount) return;

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/discounts/${editingDiscount._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result?.success) {
                setMessage({ type: 'success', text: 'Discount code updated successfully' });
                setShowEditModal(false);
                setEditingDiscount(null);
                resetForm();
                fetchDiscounts();
            } else {
                // Mock successful update
                setDiscounts(prev =>
                    prev.map(d =>
                        d._id === editingDiscount._id
                            ? { ...d, ...formData, updatedAt: new Date().toISOString() }
                            : d
                    )
                );
                setMessage({ type: 'success', text: 'Discount code updated successfully' });
                setShowEditModal(false);
                setEditingDiscount(null);
                resetForm();
            }
        } catch (error) {
            console.error('Error updating discount:', error);
            setMessage({ type: 'error', text: 'Failed to update discount' });
        }
    };

    const handleToggleStatus = async (discount) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/discounts/${discount._id}/toggle`, {
                method: 'PATCH',
            });

            const result = await response.json();

            if (result?.success) {
                setMessage({
                    type: 'success',
                    text: `Discount ${result.data.isActive ? 'activated' : 'deactivated'} successfully`
                });
                fetchDiscounts();
            } else {
                // Mock successful toggle
                setDiscounts(prev =>
                    prev.map(d =>
                        d._id === discount._id
                            ? { ...d, isActive: !d.isActive, updatedAt: new Date().toISOString() }
                            : d
                    )
                );
                setMessage({
                    type: 'success',
                    text: `Discount ${!discount.isActive ? 'activated' : 'deactivated'} successfully`
                });
            }
        } catch (error) {
            console.error('Error toggling discount status:', error);
            setMessage({ type: 'error', text: 'Failed to toggle discount status' });
        }
    };

    const handleDeleteDiscount = async (discount) => {
        if (!confirm(`Are you sure you want to delete the discount "${discount.code}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/discounts/${discount._id}`, {
                method: 'DELETE',
            });

            const deleteResult = await response.json();

            if (deleteResult?.success) {
                setMessage({ type: 'success', text: 'Discount has been deleted successfully' });
                fetchDiscounts();
            } else {
                // Mock successful deletion
                setDiscounts(prev => prev.filter(d => d._id !== discount._id));
                setMessage({ type: 'success', text: 'Discount has been deleted successfully' });
            }
        } catch (error) {
            console.error('Error deleting discount:', error);
            // Mock successful deletion
            setDiscounts(prev => prev.filter(d => d._id !== discount._id));
            setMessage({ type: 'success', text: 'Discount has been deleted successfully' });
        }
    };

    const openEditModal = (discount) => {
        setEditingDiscount(discount);
        setFormData({
            code: discount.code,
            name: discount.name,
            description: discount.description,
            type: discount.type,
            value: discount.value,
            minOrderAmount: discount.minOrderAmount,
            maxDiscountAmount: discount.maxDiscountAmount,
            freeDelivery: discount.freeDelivery,
            usageLimit: discount.usageLimit,
            validFrom: discount.validFrom.split('T')[0],
            validUntil: discount.validUntil.split('T')[0],
            isActive: discount.isActive,
            applicableCategories: discount.applicableCategories,
            excludedCategories: discount.excludedCategories
        });
        setShowEditModal(true);
    };

    const copyToClipboard = async (text) => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                setMessage({ type: 'success', text: `Discount code "${text}" copied to clipboard` });
            } else {
                // Fallback for environments where clipboard API is not available
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                setMessage({ type: 'success', text: `Discount code "${text}" copied to clipboard` });
            }
        } catch (error) {
            console.warn('Clipboard copy failed:', error);
            setMessage({ type: 'error', text: 'Failed to copy to clipboard' });
        }
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isExpired = (dateString) => {
        return new Date(dateString) < new Date();
    };

    const filteredDiscounts = discounts.filter(discount => {
        const matchesSearch = discount.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            discount.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && discount.isActive) ||
            (statusFilter === 'inactive' && !discount.isActive) ||
            (statusFilter === 'expired' && isExpired(discount.validUntil));
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader className="h-8 w-8 animate-spin mr-2" />
                <span>Loading discounts...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">Discount Management</h1>
                    <p className="text-gray-600 mt-2">Create and manage discount codes for your store</p>
                </div>
            </div>

            {/* Alert Messages */}
            {message.text && (
                <Alert className={`${message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
                        {message.text}
                    </AlertDescription>
                </Alert>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                            <Hash className="h-4 w-4 mr-2" />
                            Total Discounts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalDiscounts}</div>
                        <p className="text-xs text-muted-foreground">All discount codes</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            Active Discounts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.activeDiscounts}</div>
                        <p className="text-xs text-muted-foreground">Currently available</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Total Usage
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsage}</div>
                        <p className="text-xs text-muted-foreground">Times used</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Total Savings
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">৳{stats.totalSavings.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Customer savings</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                            <CardTitle>Discount Codes</CardTitle>
                            <CardDescription>Manage your store's discount codes and promotions</CardDescription>
                        </div>
                        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                            <DialogTrigger asChild>
                                <Button onClick={() => { resetForm(); setShowCreateModal(true); }}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Discount
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Create New Discount</DialogTitle>
                                    <DialogDescription>
                                        Create a new discount code for your customers
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="code">Discount Code *</Label>
                                        <Input
                                            id="code"
                                            value={formData.code}
                                            onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                                            placeholder="e.g., SUMMER20"
                                            className="uppercase"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="name">Display Name *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            placeholder="e.g., Summer Sale 20% Off"
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            placeholder="Description of the discount offer"
                                            rows={2}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="type">Discount Type *</Label>
                                        <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                <SelectItem value="fixed">Fixed Amount (৳)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="value">Discount Value *</Label>
                                        <Input
                                            id="value"
                                            type="number"
                                            value={formData.value}
                                            onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || 0)}
                                            placeholder={formData.type === 'percentage' ? 'e.g., 20' : 'e.g., 10.00'}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="minOrderAmount">Minimum Order Amount</Label>
                                        <Input
                                            id="minOrderAmount"
                                            type="number"
                                            value={formData.minOrderAmount}
                                            onChange={(e) => handleInputChange('minOrderAmount', parseFloat(e.target.value) || 0)}
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="maxDiscountAmount">Maximum Discount Amount</Label>
                                        <Input
                                            id="maxDiscountAmount"
                                            type="number"
                                            value={formData.maxDiscountAmount || ''}
                                            onChange={(e) => handleInputChange('maxDiscountAmount', e.target.value ? parseFloat(e.target.value) : null)}
                                            placeholder="No limit"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="usageLimit">Usage Limit</Label>
                                        <Input
                                            id="usageLimit"
                                            type="number"
                                            value={formData.usageLimit || ''}
                                            onChange={(e) => handleInputChange('usageLimit', e.target.value ? parseInt(e.target.value) : null)}
                                            placeholder="Unlimited"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="validFrom">Valid From *</Label>
                                        <Input
                                            id="validFrom"
                                            type="date"
                                            value={formData.validFrom}
                                            onChange={(e) => handleInputChange('validFrom', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="validUntil">Valid Until *</Label>
                                        <Input
                                            id="validUntil"
                                            type="date"
                                            value={formData.validUntil}
                                            onChange={(e) => handleInputChange('validUntil', e.target.value)}
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="freeDelivery"
                                                checked={formData.freeDelivery}
                                                onCheckedChange={(checked) => handleInputChange('freeDelivery', checked)}
                                            />
                                            <Label htmlFor="freeDelivery" className="flex items-center">
                                                <Truck className="h-4 w-4 mr-2" />
                                                Include Free Delivery
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="isActive"
                                                checked={formData.isActive}
                                                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                                            />
                                            <Label htmlFor="isActive">Active</Label>
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleCreateDiscount}>
                                        Create Discount
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>

                <CardContent>
                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search discounts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Discounts Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Value</TableHead>
                                    <TableHead>Usage</TableHead>
                                    <TableHead>Valid Until</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredDiscounts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                            {searchTerm || statusFilter !== 'all' ? 'No matching discounts found' : 'No discounts created yet'}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredDiscounts.map((discount) => (
                                        <TableRow key={discount._id}>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Badge variant="outline" className="font-mono">
                                                        {discount.code}
                                                    </Badge>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => copyToClipboard(discount.code)}
                                                        className="h-6 w-6 p-0"
                                                    >
                                                        <Copy className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{discount.name}</div>
                                                    {discount.description && (
                                                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                                            {discount.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    {discount.type === 'percentage' ? (
                                                        <Percent className="h-4 w-4 mr-1" />
                                                    ) : (
                                                        <DollarSign className="h-4 w-4 mr-1" />
                                                    )}
                                                    {discount.type}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {discount.type === 'percentage' ? `${discount.value}%` : `৳${discount.value}`}
                                                </div>
                                                {discount.freeDelivery && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        <Truck className="h-3 w-3 mr-1" />
                                                        Free Delivery
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <div>{discount.usedCount || 0}{discount.usageLimit ? `/${discount.usageLimit}` : ''}</div>
                                                    {discount.usageLimit && (
                                                        <div className="text-xs text-muted-foreground">
                                                            {Math.round(((discount.usedCount || 0) / discount.usageLimit) * 100)}% used
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className={`text-sm ${isExpired(discount.validUntil) ? 'text-red-600' : ''}`}>
                                                    {formatDate(discount.validUntil)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col space-y-1">
                                                    <Badge variant={discount.isActive ? 'default' : 'secondary'}>
                                                        {discount.isActive ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                    {isExpired(discount.validUntil) && (
                                                        <Badge variant="destructive" className="text-xs">
                                                            Expired
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleToggleStatus(discount)}
                                                        className="h-8 w-8 p-0"
                                                        title={discount.isActive ? 'Deactivate' : 'Activate'}
                                                    >
                                                        {discount.isActive ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openEditModal(discount)}
                                                        className="h-8 w-8 p-0"
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteDiscount(discount)}
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Discount</DialogTitle>
                        <DialogDescription>
                            Update the discount code details
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-code">Discount Code</Label>
                            <Input
                                id="edit-code"
                                value={formData.code}
                                disabled
                                className="bg-gray-100"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Display Name *</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="e.g., Summer Sale 20% Off"
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Description of the discount offer"
                                rows={2}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-type">Discount Type *</Label>
                            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                                    <SelectItem value="fixed">Fixed Amount (৳)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-value">Discount Value *</Label>
                            <Input
                                id="edit-value"
                                type="number"
                                value={formData.value}
                                onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || 0)}
                                placeholder={formData.type === 'percentage' ? 'e.g., 20' : 'e.g., 10.00'}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-minOrderAmount">Minimum Order Amount</Label>
                            <Input
                                id="edit-minOrderAmount"
                                type="number"
                                value={formData.minOrderAmount}
                                onChange={(e) => handleInputChange('minOrderAmount', parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-maxDiscountAmount">Maximum Discount Amount</Label>
                            <Input
                                id="edit-maxDiscountAmount"
                                type="number"
                                value={formData.maxDiscountAmount || ''}
                                onChange={(e) => handleInputChange('maxDiscountAmount', e.target.value ? parseFloat(e.target.value) : null)}
                                placeholder="No limit"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-usageLimit">Usage Limit</Label>
                            <Input
                                id="edit-usageLimit"
                                type="number"
                                value={formData.usageLimit || ''}
                                onChange={(e) => handleInputChange('usageLimit', e.target.value ? parseInt(e.target.value) : null)}
                                placeholder="Unlimited"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-validFrom">Valid From *</Label>
                            <Input
                                id="edit-validFrom"
                                type="date"
                                value={formData.validFrom}
                                onChange={(e) => handleInputChange('validFrom', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-validUntil">Valid Until *</Label>
                            <Input
                                id="edit-validUntil"
                                type="date"
                                value={formData.validUntil}
                                onChange={(e) => handleInputChange('validUntil', e.target.value)}
                            />
                        </div>

                        <div className="md:col-span-2 space-y-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="edit-freeDelivery"
                                    checked={formData.freeDelivery}
                                    onCheckedChange={(checked) => handleInputChange('freeDelivery', checked)}
                                />
                                <Label htmlFor="edit-freeDelivery" className="flex items-center">
                                    <Truck className="h-4 w-4 mr-2" />
                                    Include Free Delivery
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="edit-isActive"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                                />
                                <Label htmlFor="edit-isActive">Active</Label>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditDiscount}>
                            Update Discount
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
