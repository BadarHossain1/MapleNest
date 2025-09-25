import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

import { Edit, Trash2, Package, DollarSign, AlertCircle, Save, X, Plus, Eye, Search, Upload, Image } from 'lucide-react';
import { useImgBBUpload } from '@/hooks/useImgBBUpload';

export default function AllProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        categoryId: '',
        categoryName: '',
        stock: 0,
        isNewArrival: false,
        isFeatured: false,
        isTopCollection: false,
        images: [''],
        video: '',
        price: {
            original: 0,
            current: 0,
            cost: 0
        },
        sizes: [],
        colors: [{ name: '', hex: '#000000' }],
        material: '',
        origin: '',
        care: '',
        fit: '',
        features: ['']
    });

    const categories = [
        { id: 'cat001', name: 'dresses', label: 'Dresses' },
        { id: 'cat002', name: 'casual-wear', label: 'Casual Wear' },
        { id: 'cat003', name: 'formal-wear', label: 'Formal Wear' },
        { id: 'cat004', name: 'accessories', label: 'Accessories' },
        { id: 'cat005', name: 'footwear', label: 'Footwear' },
        { id: 'cat006', name: 'professional', label: 'Professional' }
    ];

    const availableSizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];

    const [imageUploading, setImageUploading] = useState({});
    const { uploadImage, isUploading, uploadProgress } = useImgBBUpload();

    // Fetch all products
    const fetchProducts = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/products`);
            const result = await response.json();

            if (result.success) {
                setProducts(result.data);
            } else {
                setMessage({ type: 'error', text: 'Failed to fetch products' });
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setMessage({ type: 'error', text: 'Network error while fetching products' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Delete product
    const handleDelete = async (productId) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/products/${productId}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                setMessage({ type: 'success', text: 'Product deleted successfully' });
                fetchProducts(); // Refresh the list
            } else {
                setMessage({ type: 'error', text: result.message || 'Failed to delete product' });
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            setMessage({ type: 'error', text: 'Network error while deleting product' });
        }
    };

    // Open update dialog
    const handleUpdate = (product) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            categoryId: product.categoryId,
            categoryName: product.categoryName,
            stock: product.stock,
            isNewArrival: product.isNewArrival,
            isFeatured: product.isFeatured,
            isTopCollection: product.isTopCollection || false,
            images: product.images.length > 0 ? product.images : [''],
            video: product.video || '',
            price: {
                original: product.price.original,
                current: product.price.current,
                cost: product.price.cost || 0
            },
            sizes: Array.isArray(product.sizes)
                ? product.sizes.length > 0 && typeof product.sizes[0] === 'string'
                    ? product.sizes
                        .filter(size => size && size.trim())
                        .map(size => ({ size: size.trim(), stock: 0 }))
                    : product.sizes.filter(s => s.size && s.size.trim())
                : [],
            colors: product.colors.length > 0 ? product.colors : [{ name: '', hex: '#000000' }],
            material: product.material,
            origin: product.origin,
            care: product.care,
            fit: product.fit,
            features: product.features.length > 0 ? product.features : ['']
        });
        setUpdateDialogOpen(true);
    };

    // Handle form input changes
    const handleFormChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle price changes
    const handlePriceChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            price: {
                ...prev.price,
                [field]: parseFloat(value) || 0
            }
        }));
    };

    // Handle array field changes
    const handleArrayChange = (field, index, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    // Add new array item
    const addArrayItem = (field, defaultValue = '') => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], defaultValue]
        }));
    };

    // Remove array item
    const removeArrayItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    // Handle size changes
    const addSize = () => {
        setFormData(prev => ({
            ...prev,
            sizes: [...prev.sizes, { size: '', stock: 0 }]
        }));
    };

    const handleSizeChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.map((size, i) =>
                i === index ? { ...size, [field]: field === 'stock' ? parseInt(value) || 0 : value } : size
            )
        }));
    };

    // Handle color changes
    const handleColorChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.map((color, i) =>
                i === index ? { ...color, [field]: value } : color
            )
        }));
    };

    const calculateTotalStock = () => {
        return formData.sizes.reduce((total, sizeStock) => total + sizeStock.stock, 0);
    };

    const handleImageUpload = async (file, index) => {
        setImageUploading(prev => ({ ...prev, [index]: true }));

        try {
            const result = await uploadImage(file);
            if (result.success) {
                const newImages = [...formData.images];
                newImages[index] = result.url;
                setFormData(prev => ({ ...prev, images: newImages }));
                setMessage({ type: 'success', text: 'Image uploaded successfully!' });
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to upload image' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error uploading image' });
        } finally {
            setImageUploading(prev => ({ ...prev, [index]: false }));
        }
    };

    const handleVideoUpload = async (file) => {
        setImageUploading(prev => ({ ...prev, video: true }));

        try {
            const result = await uploadImage(file);
            if (result.success) {
                setFormData(prev => ({ ...prev, video: result.url }));
                setMessage({ type: 'success', text: 'Video uploaded successfully!' });
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to upload video' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error uploading video' });
        } finally {
            setImageUploading(prev => ({ ...prev, video: false }));
        }
    };

    // Submit update
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProduct) return;

        setUpdateLoading(true);

        try {
            const cleanData = {
                ...formData,
                images: formData.images.filter(img => img.trim()),
                colors: formData.colors.filter(color => color.name && color.hex),
                features: formData.features.filter(feature => feature.trim()),
                sizes: formData.sizes.filter(size =>
                    size &&
                    size.size &&
                    size.size.trim() &&
                    availableSizes.includes(size.size.trim()) &&
                    typeof size.stock === 'number' &&
                    size.stock >= 0
                ).map(size => ({
                    size: size.size.trim(),
                    stock: Math.floor(size.stock)
                })),
                video: formData.video.trim() || undefined
            };

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/products/${selectedProduct._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cleanData)
            });

            const result = await response.json();

            if (result.success) {
                setMessage({ type: 'success', text: 'Product updated successfully!' });
                setUpdateDialogOpen(false);
                fetchProducts();
            } else {
                console.error('Update failed:', result);
                const errorMessage = result.message || result.error || 'Failed to update product';
                setMessage({ type: 'error', text: `Update failed: ${errorMessage}` });
            }
        } catch (error) {
            console.error('Error updating product:', error);
            setMessage({ type: 'error', text: 'Network error while updating product' });
        } finally {
            setUpdateLoading(false);
        }
    };

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || product.categoryName === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const uniqueCategories = [...new Set(products.map(p => p.categoryName))];

    if (loading) {
        return (
            <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p>Loading products...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">All Products</h1>
                    <p className="text-muted-foreground">Manage your product inventory</p>
                </div>
                <div className="text-sm text-muted-foreground">
                    {products.length} products total
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

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Product Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {uniqueCategories.map(category => (
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Products Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                    <Card key={product._id} className="overflow-hidden">
                        <div className="aspect-square overflow-hidden">
                            <img
                                src={product.images?.[0] || '/placeholder-product.jpg'}
                                alt={product.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                        </div>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                                <div className="flex gap-1">
                                    {product.isNewArrival && (
                                        <Badge variant="secondary" className="text-xs">New</Badge>
                                    )}
                                    {product.isFeatured && (
                                        <Badge variant="outline" className="text-xs">Featured</Badge>
                                    )}
                                </div>
                            </div>
                            <CardDescription className="line-clamp-2">
                                {product.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-gray-500" />
                                    <span className="font-semibold">৳{product.price.current}</span>
                                    {product.price.original !== product.price.current && (
                                        <span className="text-sm text-gray-500 line-through">
                                            ৳{product.price.original}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">
                                        {Array.isArray(product.sizes) && product.sizes.length > 0 && typeof product.sizes[0] === 'object'
                                            ? product.sizes.reduce((total, sizeStock) => total + (sizeStock.stock || 0), 0)
                                            : product.stock
                                        } in stock
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                    <strong>Category:</strong> {product.categoryName}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Sizes:</strong> {
                                        Array.isArray(product.sizes) && product.sizes.length > 0
                                            ? typeof product.sizes[0] === 'string'
                                                ? product.sizes.join(', ')
                                                : product.sizes.map(s => `${s.size}(${s.stock})`).join(', ')
                                            : 'No sizes available'
                                    }
                                </p>
                                <div className="flex items-center gap-2">
                                    <strong className="text-sm text-gray-600">Colors:</strong>
                                    <div className="flex gap-1">
                                        {product.colors?.slice(0, 3).map((color, index) => (
                                            <div
                                                key={index}
                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                style={{ backgroundColor: color.hex }}
                                                title={color.name}
                                            />
                                        ))}
                                        {product.colors && product.colors.length > 3 && (
                                            <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdate(product)}
                                    className="flex-1"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(product._id)}
                                    className="flex-1"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredProducts.length === 0 && !loading && (
                <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No products found</p>
                </div>
            )}

            {/* Update Dialog */}
            <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Update Product</DialogTitle>
                        <DialogDescription>
                            Edit the product details below
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">Product Name</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => handleFormChange('name', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Category</label>
                                <Select
                                    value={formData.categoryName}
                                    onValueChange={(value) => {
                                        const category = categories.find(cat => cat.name === value);
                                        handleFormChange('categoryName', value);
                                        handleFormChange('categoryId', category?.id || '');
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(category => (
                                            <SelectItem key={category.id} value={category.name}>
                                                {category.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => handleFormChange('description', e.target.value)}
                                rows={3}
                            />
                        </div>

                        {/* Pricing */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium">Original Price</label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={formData.price.original}
                                    onChange={(e) => handlePriceChange('original', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Current Price</label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={formData.price.current}
                                    onChange={(e) => handlePriceChange('current', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Cost Price</label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={formData.price.cost}
                                    onChange={(e) => handlePriceChange('cost', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Status Flags */}
                        <div className="flex gap-6">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="newArrival"
                                    checked={formData.isNewArrival}
                                    onCheckedChange={(checked) => handleFormChange('isNewArrival', checked)}
                                />
                                <label htmlFor="newArrival" className="text-sm font-medium">New Arrival</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="featured"
                                    checked={formData.isFeatured}
                                    onCheckedChange={(checked) => handleFormChange('isFeatured', checked)}
                                />
                                <label htmlFor="featured" className="text-sm font-medium">Featured</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="topCollection"
                                    checked={formData.isTopCollection}
                                    onCheckedChange={(checked) => handleFormChange('isTopCollection', checked)}
                                />
                                <label htmlFor="topCollection" className="text-sm font-medium">Top Collection</label>
                            </div>
                        </div>

                        {/* Base Stock */}
                        <div>
                            <label className="text-sm font-medium">Base Stock</label>
                            <Input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => handleFormChange('stock', parseInt(e.target.value) || 0)}
                                min="0"
                                placeholder="Base quantity"
                            />
                            <p className="text-xs text-gray-500 mt-1">Will be overridden by size stocks</p>
                        </div>

                        {/* Images & Media */}
                        <div>
                            <label className="text-sm font-medium">Product Images</label>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {formData.images.map((image, index) => (
                                        <div key={index} className="relative">
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                                <div className="text-center">
                                                    {image ? (
                                                        <div className="space-y-2">
                                                            <img
                                                                src={image}
                                                                alt={`Preview ${index + 1}`}
                                                                className="w-full h-24 object-cover rounded"
                                                                onError={(e) => {
                                                                    e.currentTarget.src = '/placeholder-image.jpg';
                                                                }}
                                                            />
                                                            <div className="flex gap-1 justify-center">
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (file) handleImageUpload(file, index);
                                                                    }}
                                                                    className="hidden"
                                                                    id={`image-${index}`}
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => document.getElementById(`image-${index}`).click()}
                                                                    disabled={imageUploading[index]}
                                                                >
                                                                    {imageUploading[index] ? 'Uploading...' : 'Replace'}
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleArrayChange('images', index, '')}
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <Image className="mx-auto h-8 w-8 text-gray-400" />
                                                            <p className="mt-1 text-xs text-gray-600">Upload Image {index + 1}</p>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) handleImageUpload(file, index);
                                                                }}
                                                                className="hidden"
                                                                id={`image-${index}`}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => document.getElementById(`image-${index}`).click()}
                                                                disabled={imageUploading[index]}
                                                                className="mt-1"
                                                            >
                                                                {imageUploading[index] ? `${Math.round(uploadProgress)}%` : 'Choose'}
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {formData.images.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeArrayItem('images', index)}
                                                    className="absolute top-1 right-1"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {formData.images.length < 6 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addArrayItem('images')}
                                        className="mt-4"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Image (Max 6)
                                    </Button>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                    First image will be used as the main product image. Upload up to 6 images.
                                </p>
                            </div>
                        </div>

                        {/* Video */}
                        <div>
                            <label className="text-sm font-medium">Product Video (Optional)</label>
                            {formData.video ? (
                                <div className="space-y-2">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-2">
                                        <video
                                            src={formData.video}
                                            className="w-full h-24 object-cover rounded"
                                            controls
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleVideoUpload(file);
                                            }}
                                            className="hidden"
                                            id="video-upload"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => document.getElementById('video-upload').click()}
                                            disabled={imageUploading.video}
                                        >
                                            {imageUploading.video ? 'Uploading...' : 'Replace'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleFormChange('video', '')}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                        <Input
                                            value={formData.video}
                                            onChange={(e) => handleFormChange('video', e.target.value)}
                                            placeholder="Or paste URL"
                                            className="flex-1"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                    <p className="mt-1 text-xs text-gray-600">Upload video or enter URL</p>
                                    <div className="flex gap-2 justify-center mt-2">
                                        <input
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleVideoUpload(file);
                                            }}
                                            className="hidden"
                                            id="video-upload"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => document.getElementById('video-upload').click()}
                                            disabled={imageUploading.video}
                                        >
                                            {imageUploading.video ? `${Math.round(uploadProgress)}%` : 'Choose Video'}
                                        </Button>
                                        <span className="text-gray-500 text-xs self-center">or</span>
                                        <Input
                                            value={formData.video}
                                            onChange={(e) => handleFormChange('video', e.target.value)}
                                            placeholder="Paste URL"
                                            className="flex-1"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Colors */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-sm font-medium">Colors</label>
                                <Button
                                    type="button"
                                    onClick={() => addArrayItem('colors', { name: '', hex: '#000000' })}
                                    size="sm"
                                    variant="outline"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Color
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {formData.colors.map((color, index) => (
                                    <div key={index} className="flex gap-2 items-center">
                                        <Input
                                            value={color.name}
                                            onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                                            placeholder="Color name (e.g., Red)"
                                            className="flex-1"
                                        />
                                        <input
                                            type="color"
                                            value={color.hex}
                                            onChange={(e) => handleColorChange(index, 'hex', e.target.value)}
                                            className="w-12 h-10 border rounded cursor-pointer"
                                        />
                                        {formData.colors.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeArrayItem('colors', index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Product Details */}
                        <div>
                            <label className="text-sm font-medium mb-3 block">Product Details</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Material</label>
                                    <Input
                                        value={formData.material}
                                        onChange={(e) => handleFormChange('material', e.target.value)}
                                        placeholder="e.g., Cotton"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Origin</label>
                                    <Input
                                        value={formData.origin}
                                        onChange={(e) => handleFormChange('origin', e.target.value)}
                                        placeholder="e.g., Made in Bangladesh"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Care Instructions</label>
                                    <Input
                                        value={formData.care}
                                        onChange={(e) => handleFormChange('care', e.target.value)}
                                        placeholder="e.g., Machine wash cold, tumble dry low"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Fit</label>
                                    <Input
                                        value={formData.fit}
                                        onChange={(e) => handleFormChange('fit', e.target.value)}
                                        placeholder="e.g., True to size"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-sm font-medium">Features</label>
                                <Button
                                    type="button"
                                    onClick={() => addArrayItem('features')}
                                    size="sm"
                                    variant="outline"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Feature
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {formData.features.map((feature, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={feature}
                                            onChange={(e) => handleArrayChange('features', index, e.target.value)}
                                            placeholder="e.g., Lightweight breathable fabric"
                                            className="flex-1"
                                        />
                                        {formData.features.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeArrayItem('features', index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sizes */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-sm font-medium">Sizes & Stock</label>
                                <Button type="button" onClick={addSize} size="sm" variant="outline">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Size
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {formData.sizes.map((size, index) => (
                                    <div key={index} className="flex gap-2 items-center">
                                        <Select
                                            value={size.size}
                                            onValueChange={(value) => handleSizeChange(index, 'size', value)}
                                        >
                                            <SelectTrigger className="w-24">
                                                <SelectValue placeholder="Size" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableSizes.map(s => (
                                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            type="number"
                                            placeholder="Stock"
                                            value={size.stock}
                                            onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                                            className="w-20"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeArrayItem('sizes', index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            {/* Total Stock Display */}
                            {formData.sizes.length > 0 && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">Total Stock:</span>
                                        <span className="font-bold">{calculateTotalStock()}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setUpdateDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={updateLoading}>
                                {updateLoading ? 'Updating...' : 'Update Product'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
