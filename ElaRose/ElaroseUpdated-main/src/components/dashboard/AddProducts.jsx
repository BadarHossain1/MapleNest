import { useState } from 'react';
import { Plus, Minus, Save, AlertCircle, Upload, Image, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { useImgBBUpload } from '@/hooks/useImgBBUpload';

export default function AddProducts() {
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

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [imageUploading, setImageUploading] = useState({});

    const { uploadImage, isUploading, uploadProgress } = useImgBBUpload();

    const categories = [
        { id: 'cat001', name: 'dresses', label: 'Dresses' },
        { id: 'cat002', name: 'casual-wear', label: 'Casual Wear' },
        { id: 'cat003', name: 'formal-wear', label: 'Formal Wear' },
        { id: 'cat004', name: 'accessories', label: 'Accessories' },
        { id: 'cat005', name: 'footwear', label: 'Footwear' },
        { id: 'cat006', name: 'professional', label: 'Professional' }
    ];

    const availableSizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];

    const handleInputChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleCategoryChange = (categoryName) => {
        const category = categories.find(cat => cat.name === categoryName);
        setFormData(prev => ({
            ...prev,
            categoryName,
            categoryId: category?.id || ''
        }));
    };

    const handleArrayChange = (field, index, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => ({
            ...prev,
            [field]: newArray
        }));
    };

    const addArrayItem = (field, defaultValue = '') => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], defaultValue]
        }));
    };

    const removeArrayItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleColorChange = (index, field, value) => {
        const newColors = [...formData.colors];
        newColors[index] = {
            ...newColors[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            colors: newColors
        }));
    };

    const addColor = () => {
        setFormData(prev => ({
            ...prev,
            colors: [...prev.colors, { name: '', hex: '#000000' }]
        }));
    };

    const removeColor = (index) => {
        if (formData.colors.length > 1) {
            setFormData(prev => ({
                ...prev,
                colors: prev.colors.filter((_, i) => i !== index)
            }));
        }
    };

    const handleSizeToggle = (size) => {
        setFormData(prev => {
            const existingIndex = prev.sizes.findIndex(s => s.size === size);
            if (existingIndex >= 0) {
                // Remove the size
                return {
                    ...prev,
                    sizes: prev.sizes.filter((_, index) => index !== existingIndex)
                };
            } else {
                // Add the size with 0 stock initially
                return {
                    ...prev,
                    sizes: [...prev.sizes, { size, stock: 0 }]
                };
            }
        });
    };

    const handleSizeStockChange = (size, stock) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.map(s =>
                s.size === size ? { ...s, stock: Math.max(0, stock) } : s
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

    const validateForm = () => {
        const required = ['name', 'categoryName'];
        const missing = required.filter(field => !formData[field]);

        if (missing.length > 0) {
            setMessage({ type: 'error', text: `Missing required fields: ${missing.join(', ')}` });
            return false;
        }

        if (formData.price.current <= 0 || formData.price.original <= 0) {
            setMessage({ type: 'error', text: 'Valid prices are required' });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Clean up the data
            const cleanData = {
                ...formData,
                images: formData.images.filter(img => img.trim()),
                colors: formData.colors.filter(color => color.name && color.hex),
                features: formData.features.filter(feature => feature.trim()),
                video: formData.video.trim() || undefined,
                stock: calculateTotalStock() // Use calculated total stock
            };

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cleanData)
            });

            const result = await response.json();

            if (result.success) {
                setMessage({ type: 'success', text: 'Product created successfully!' });
                // Reset form
                setFormData({
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
                    price: { original: 0, current: 0, cost: 0 },
                    sizes: [],
                    colors: [{ name: '', hex: '#000000' }],
                    material: '',
                    origin: '',
                    care: '',
                    fit: '',
                    features: ['']
                });
            } else {
                setMessage({ type: 'error', text: result.message || 'Failed to create product' });
            }
        } catch (error) {
            console.error('Error creating product:', error);
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h1>
                <p className="text-gray-600">Create a new product for the ELAROSE collection</p>
            </div>

            {message.text && (
                <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
                        {message.text}
                    </AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Product Name *</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="e.g., Floral Summer Dress"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Category *</label>
                            <Select value={formData.categoryName} onValueChange={handleCategoryChange}>
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
                    <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Detailed product description..."
                            rows={4}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Base Stock</label>
                            <Input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                                min="0"
                                placeholder="Base quantity"
                            />
                            <p className="text-xs text-gray-500 mt-1">Will be overridden by size stocks</p>
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                            <Checkbox
                                id="newArrival"
                                checked={formData.isNewArrival}
                                onCheckedChange={(checked) => handleInputChange('isNewArrival', checked)}
                            />
                            <label htmlFor="newArrival" className="text-sm font-medium">New Arrival</label>
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                            <Checkbox
                                id="featured"
                                checked={formData.isFeatured}
                                onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                            />
                            <label htmlFor="featured" className="text-sm font-medium">Featured</label>
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                            <Checkbox
                                id="topCollection"
                                checked={formData.isTopCollection}
                                onCheckedChange={(checked) => handleInputChange('isTopCollection', checked)}
                            />
                            <label htmlFor="topCollection" className="text-sm font-medium">Top Collection</label>
                        </div>
                    </div>
                </Card>

                {/* Images and Media */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Images & Media</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Product Images *</h3>
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
                                                            className="w-full h-40 object-cover rounded"
                                                            onError={(e) => {
                                                                e.currentTarget.src = '/placeholder-image.jpg';
                                                            }}
                                                        />
                                                        <div className="flex gap-2 justify-center">
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
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <Image className="mx-auto h-12 w-12 text-gray-400" />
                                                        <p className="mt-2 text-sm text-gray-600">Upload Image {index + 1}</p>
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
                                                            className="mt-2"
                                                        >
                                                            {imageUploading[index] ? `Uploading... ${Math.round(uploadProgress)}%` : 'Choose File'}
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
                                                className="absolute top-2 right-2"
                                            >
                                                <Minus className="h-4 w-4" />
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

                        <div>
                            <label className="block text-sm font-medium mb-2">Product Video (Optional)</label>
                            {formData.video ? (
                                <div className="space-y-2">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                        <video
                                            src={formData.video}
                                            className="w-full h-40 object-cover rounded"
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
                                            {imageUploading.video ? 'Uploading...' : 'Replace Video'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleInputChange('video', '')}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                        <Input
                                            value={formData.video}
                                            onChange={(e) => handleInputChange('video', e.target.value)}
                                            placeholder="Or paste video URL"
                                            className="flex-1"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-600">Upload a product video or enter URL</p>
                                    <div className="flex gap-2 justify-center mt-4">
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
                                            {imageUploading.video ? `Uploading... ${Math.round(uploadProgress)}%` : 'Choose Video'}
                                        </Button>
                                        <span className="text-gray-500 self-center">or</span>
                                        <Input
                                            value={formData.video}
                                            onChange={(e) => handleInputChange('video', e.target.value)}
                                            placeholder="Paste video URL"
                                            className="flex-1 max-w-xs"
                                        />
                                    </div>
                                </div>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                Upload a video file or provide a direct URL to a video.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Pricing */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Pricing</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Cost Price (৳)</label>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.price.cost || ''}
                                onChange={(e) => handleInputChange('price.cost', parseFloat(e.target.value) || 0)}
                                min="0"
                                placeholder="0.00"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Your purchase/manufacturing cost</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Original Price * (৳)</label>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.price.original}
                                onChange={(e) => handleInputChange('price.original', parseFloat(e.target.value) || 0)}
                                min="0"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Current Price * (৳)</label>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.price.current}
                                onChange={(e) => handleInputChange('price.current', parseFloat(e.target.value) || 0)}
                                min="0"
                                required
                            />
                        </div>
                    </div>
                    {formData.price.cost > 0 && formData.price.current > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <div className="text-sm text-blue-800">
                                <strong>Profit Margin:</strong> ৳{(formData.price.current - formData.price.cost).toFixed(2)}
                                ({formData.price.cost > 0 ? ((formData.price.current - formData.price.cost) / formData.price.cost * 100).toFixed(1) : 0}%)
                            </div>
                        </div>
                    )}
                </Card>

                {/* Sizes */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Available Sizes</h2>
                    <div className="flex flex-wrap gap-2">
                        {availableSizes.map(size => (
                            <Badge
                                key={size}
                                variant={formData.sizes.some(s => s.size === size) ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => handleSizeToggle(size)}
                            >
                                {size}
                            </Badge>
                        ))}
                    </div>

                    {/* Size Stock Management */}
                    {formData.sizes.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-medium mb-4">Stock Management</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {formData.sizes.map((sizeStock) => (
                                    <div key={sizeStock.size} className="flex items-center gap-3 p-3 border rounded-lg">
                                        <Badge variant="outline" className="min-w-[3rem] justify-center">
                                            {sizeStock.size}
                                        </Badge>
                                        <div className="flex-1">
                                            <Input
                                                type="number"
                                                placeholder="Stock"
                                                value={sizeStock.stock || ''}
                                                onChange={(e) => handleSizeStockChange(sizeStock.size, parseInt(e.target.value) || 0)}
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">Total Stock:</span>
                                    <span className="font-bold">{calculateTotalStock()}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Colors */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Colors</h2>
                    <div className="space-y-4">
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
                                        onClick={() => removeColor(index)}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addColor}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Color
                        </Button>
                    </div>
                </Card>

                {/* Product Details */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Product Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Material</label>
                            <Input
                                value={formData.material}
                                onChange={(e) => handleInputChange('material', e.target.value)}
                                placeholder="e.g., Cotton"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Origin</label>
                            <Input
                                value={formData.origin}
                                onChange={(e) => handleInputChange('origin', e.target.value)}
                                placeholder="e.g., Made in Bangladesh"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Care Instructions</label>
                            <Input
                                value={formData.care}
                                onChange={(e) => handleInputChange('care', e.target.value)}
                                placeholder="e.g., Machine wash cold, tumble dry low"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Fit</label>
                            <Input
                                value={formData.fit}
                                onChange={(e) => handleInputChange('fit', e.target.value)}
                                placeholder="e.g., True to size"
                            />
                        </div>
                    </div>
                </Card>

                {/* Features */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Features</h2>
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
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addArrayItem('features')}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Feature
                        </Button>
                    </div>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <Button type="submit" size="lg" disabled={loading}>
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Create Product
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
