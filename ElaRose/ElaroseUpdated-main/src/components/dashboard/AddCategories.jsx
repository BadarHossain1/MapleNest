import { useState } from 'react';
import { Save, AlertCircle, Image, Upload, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';
import { useImgBBUpload } from '@/hooks/useImgBBUpload';

export default function AddCategories() {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        image: '',
        banner: '',
        itemCount: '0 items',
        isActive: true,
        sortOrder: 0
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [imageUploading, setImageUploading] = useState({});

    const { uploadImage, isUploading, uploadProgress } = useImgBBUpload();

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Auto-generate slug when name changes
        if (field === 'name' && typeof value === 'string') {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();

            setFormData(prev => ({
                ...prev,
                slug
            }));
        }
    };

    const handleImageUpload = async (file, field) => {
        setImageUploading(prev => ({ ...prev, [field]: true }));

        try {
            const result = await uploadImage(file);
            if (result.success) {
                setFormData(prev => ({ ...prev, [field]: result.url }));
                setMessage({ type: 'success', text: `${field === 'image' ? 'Category image' : 'Banner'} uploaded successfully!` });
            } else {
                setMessage({ type: 'error', text: result.error || `Failed to upload ${field}` });
            }
        } catch (error) {
            setMessage({ type: 'error', text: `Error uploading ${field}` });
        } finally {
            setImageUploading(prev => ({ ...prev, [field]: false }));
        }
    };

    const validateForm = () => {
        const required = ['name'];
        const missing = required.filter(field => !formData[field]);

        if (missing.length > 0) {
            setMessage({ type: 'error', text: `Missing required fields: ${missing.join(', ')}` });
            return false;
        }

        // Validate URLs (only if they are provided)
        const urlFields = ['image', 'banner'];
        for (const field of urlFields) {
            const url = formData[field];
            if (url && url.trim() && !(/^https?:\/\/.+/.test(url))) {
                setMessage({ type: 'error', text: `Invalid ${field} URL format` });
                return false;
            }
        }

        // Validate slug format
        if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug)) {
            setMessage({ type: 'error', text: 'Slug can only contain lowercase letters, numbers, and hyphens' });
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
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                setMessage({ type: 'success', text: 'Category created successfully!' });
                // Reset form
                setFormData({
                    name: '',
                    slug: '',
                    description: '',
                    image: '',
                    banner: '',
                    itemCount: '0 items',
                    isActive: true,
                    sortOrder: 0
                });
            } else {
                setMessage({ type: 'error', text: result.message || 'Failed to create category' });
            }
        } catch (error) {
            console.error('Error creating category:', error);
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Category</h1>
                <p className="text-gray-600">Create a new product category for the ELAROSE collection</p>
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
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Category Name *</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="e.g., Dresses"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Slug *</label>
                            <Input
                                value={formData.slug}
                                onChange={(e) => handleInputChange('slug', e.target.value)}
                                placeholder="e.g., dresses (auto-generated from name)"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                URL-friendly version of the name. Only lowercase letters, numbers, and hyphens allowed.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Brief description of the category..."
                                rows={3}
                            />
                        </div>
                    </div>
                </Card>

                {/* Images */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Image className="h-5 w-5" />
                        Images
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Category Image</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                <div className="text-center">
                                    {formData.image ? (
                                        <div className="space-y-2">
                                            <img
                                                src={formData.image}
                                                alt="Category preview"
                                                className="w-full h-32 object-cover rounded border"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/placeholder-category.jpg';
                                                }}
                                            />
                                            <div className="flex gap-2 justify-center">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleImageUpload(file, 'image');
                                                    }}
                                                    className="hidden"
                                                    id="image-upload"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => document.getElementById('image-upload').click()}
                                                    disabled={imageUploading.image}
                                                >
                                                    {imageUploading.image ? 'Uploading...' : 'Replace'}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleInputChange('image', '')}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                                <Input
                                                    value={formData.image}
                                                    onChange={(e) => handleInputChange('image', e.target.value)}
                                                    placeholder="Or paste image URL"
                                                    className="flex-1"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <Image className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-600">Upload category image</p>
                                            <div className="flex gap-2 justify-center mt-4">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleImageUpload(file, 'image');
                                                    }}
                                                    className="hidden"
                                                    id="image-upload"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => document.getElementById('image-upload').click()}
                                                    disabled={imageUploading.image}
                                                >
                                                    {imageUploading.image ? `Uploading... ${Math.round(uploadProgress)}%` : 'Choose Image'}
                                                </Button>
                                                <span className="text-gray-500 self-center">or</span>
                                                <Input
                                                    value={formData.image}
                                                    onChange={(e) => handleInputChange('image', e.target.value)}
                                                    placeholder="Paste image URL"
                                                    className="flex-1 max-w-xs"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Banner Image</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                <div className="text-center">
                                    {formData.banner ? (
                                        <div className="space-y-2">
                                            <img
                                                src={formData.banner}
                                                alt="Banner preview"
                                                className="w-full h-20 object-cover rounded border"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/placeholder-category.jpg';
                                                }}
                                            />
                                            <div className="flex gap-2 justify-center">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleImageUpload(file, 'banner');
                                                    }}
                                                    className="hidden"
                                                    id="banner-upload"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => document.getElementById('banner-upload').click()}
                                                    disabled={imageUploading.banner}
                                                >
                                                    {imageUploading.banner ? 'Uploading...' : 'Replace'}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleInputChange('banner', '')}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                                <Input
                                                    value={formData.banner}
                                                    onChange={(e) => handleInputChange('banner', e.target.value)}
                                                    placeholder="Or paste banner URL"
                                                    className="flex-1"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <Image className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-600">Upload banner image</p>
                                            <div className="flex gap-2 justify-center mt-4">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleImageUpload(file, 'banner');
                                                    }}
                                                    className="hidden"
                                                    id="banner-upload"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => document.getElementById('banner-upload').click()}
                                                    disabled={imageUploading.banner}
                                                >
                                                    {imageUploading.banner ? `Uploading... ${Math.round(uploadProgress)}%` : 'Choose Banner'}
                                                </Button>
                                                <span className="text-gray-500 self-center">or</span>
                                                <Input
                                                    value={formData.banner}
                                                    onChange={(e) => handleInputChange('banner', e.target.value)}
                                                    placeholder="Paste banner URL"
                                                    className="flex-1 max-w-xs"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Additional Settings */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Additional Settings</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Initial Item Count</label>
                            <Input
                                value={formData.itemCount}
                                onChange={(e) => handleInputChange('itemCount', e.target.value)}
                                placeholder="e.g., 0 items, 25+ items"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Display text for item count. This will be auto-updated based on actual products.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Sort Order</label>
                            <Input
                                type="number"
                                value={formData.sortOrder}
                                onChange={(e) => handleInputChange('sortOrder', parseInt(e.target.value) || 0)}
                                placeholder="0"
                                min="0"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Lower numbers appear first. Default is 0.
                            </p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                            />
                            <label htmlFor="isActive" className="text-sm font-medium">
                                Active Category
                            </label>
                            <p className="text-xs text-gray-500">
                                Only active categories are displayed to users
                            </p>
                        </div>
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
                                Create Category
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
