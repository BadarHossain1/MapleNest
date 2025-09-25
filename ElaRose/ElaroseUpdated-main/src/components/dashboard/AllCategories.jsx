import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription } from '../ui/alert';
import { Edit, Trash2, Folder, Eye, AlertCircle, Save, Image, Upload, X } from 'lucide-react';
import { useImgBBUpload } from '@/hooks/useImgBBUpload';

export default function AllCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
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

    const [imageUploading, setImageUploading] = useState({});
    const { uploadImage, isUploading, uploadProgress } = useImgBBUpload();

    // Fetch all categories
    const fetchCategories = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/categories`);
            const result = await response.json();

            if (result.success) {
                setCategories(result.data);
            } else {
                setMessage({ type: 'error', text: 'Failed to fetch categories' });
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setMessage({ type: 'error', text: 'Network error while fetching categories' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Delete category
    const handleDelete = async (categoryId) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/categories/${categoryId}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                setMessage({ type: 'success', text: 'Category deleted successfully' });
                fetchCategories(); // Refresh the list
            } else {
                setMessage({ type: 'error', text: result.message || 'Failed to delete category' });
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            setMessage({ type: 'error', text: 'Network error while deleting category' });
        }
    };

    // Open update dialog
    const handleUpdate = (category) => {
        setSelectedCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description,
            image: category.image,
            banner: category.banner,
            itemCount: category.itemCount,
            isActive: category.isActive,
            sortOrder: category.sortOrder
        });
        setUpdateDialogOpen(true);
    };

    // Handle form input changes
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

    // Submit update
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCategory) return;

        setUpdateLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/categories/${selectedCategory._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                setMessage({ type: 'success', text: 'Category updated successfully!' });
                setUpdateDialogOpen(false);
                fetchCategories(); // Refresh the list
            } else {
                setMessage({ type: 'error', text: result.message || 'Failed to update category' });
            }
        } catch (error) {
            console.error('Error updating category:', error);
            setMessage({ type: 'error', text: 'Network error while updating category' });
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p>Loading categories...</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">All Categories</h1>
                <p className="text-gray-600">Manage all product categories</p>
            </div>

            {message.text && (
                <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
                        {message.text}
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <Card key={category._id} className="overflow-hidden">
                        <div className="aspect-video overflow-hidden">
                            <img
                                src={category.banner || category.image || '/placeholder-category.jpg'}
                                alt={category.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                        </div>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg capitalize">{category.name}</CardTitle>
                                <div className="flex gap-1">
                                    <Badge variant={category.isActive ? "default" : "secondary"}>
                                        {category.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </div>
                            <CardDescription className="line-clamp-2">
                                {category.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Slug:</span>
                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                        {category.slug}
                                    </code>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Items:</span>
                                    <span className="text-sm font-medium">{category.itemCount}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Sort Order:</span>
                                    <span className="text-sm font-medium">{category.sortOrder}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Created:</span>
                                    <span>{new Date(category.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Updated:</span>
                                    <span>{new Date(category.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdate(category)}
                                    className="flex-1"
                                >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Update
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(category._id)}
                                    className="flex-1"
                                >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="text-center py-12">
                    <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                    <p className="text-gray-600">Start by adding some categories to organize your products.</p>
                </div>
            )}

            {/* Update Category Dialog */}
            <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Update Category</DialogTitle>
                        <DialogDescription>
                            Modify the category information below
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpdateSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Basic Information</h3>
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

                        {/* Images */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Image className="h-5 w-5" />
                                Images
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Category Image</label>
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
                                            <div className="flex gap-2">
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
                                                    placeholder="Or paste URL"
                                                    className="flex-1"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                            <Image className="mx-auto h-8 w-8 text-gray-400" />
                                            <p className="mt-1 text-sm text-gray-600">Upload category image</p>
                                            <div className="flex gap-2 justify-center mt-2">
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
                                                    {imageUploading.image ? `${Math.round(uploadProgress)}%` : 'Choose'}
                                                </Button>
                                                <span className="text-gray-500 text-xs self-center">or</span>
                                                <Input
                                                    value={formData.image}
                                                    onChange={(e) => handleInputChange('image', e.target.value)}
                                                    placeholder="Paste URL"
                                                    className="flex-1"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Banner Image</label>
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
                                            <div className="flex gap-2">
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
                                                    placeholder="Or paste URL"
                                                    className="flex-1"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                            <Image className="mx-auto h-8 w-8 text-gray-400" />
                                            <p className="mt-1 text-sm text-gray-600">Upload banner image</p>
                                            <div className="flex gap-2 justify-center mt-2">
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
                                                    {imageUploading.banner ? `${Math.round(uploadProgress)}%` : 'Choose'}
                                                </Button>
                                                <span className="text-gray-500 text-xs self-center">or</span>
                                                <Input
                                                    value={formData.banner}
                                                    onChange={(e) => handleInputChange('banner', e.target.value)}
                                                    placeholder="Paste URL"
                                                    className="flex-1"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Additional Settings */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Additional Settings</h3>
                            <div>
                                <label className="block text-sm font-medium mb-2">Item Count</label>
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

                        {/* Submit buttons */}
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setUpdateDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={updateLoading}>
                                {updateLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Update Category
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
