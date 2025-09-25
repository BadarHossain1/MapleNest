import { useState } from 'react';

export const useImgBBUpload = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const uploadImage = async (file) => {
        // For now, we'll use a simple approach - you can add ImgBB API key later
        const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

        if (!apiKey) {
            // Fallback to a placeholder or local file handling
            return {
                success: false,
                error: 'Image upload service not configured. Please add NEXT_PUBLIC_IMGBB_API_KEY to your environment variables.'
            };
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return {
                success: false,
                error: 'Invalid file type. Please upload JPG, PNG, GIF, or WebP images only.'
            };
        }

        // Validate file size (max 32MB for ImgBB)
        const maxSize = 32 * 1024 * 1024; // 32MB in bytes
        if (file.size > maxSize) {
            return {
                success: false,
                error: 'File too large. Maximum size is 32MB.'
            };
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const xhr = new XMLHttpRequest();
            
            return new Promise((resolve) => {
                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        const progress = (event.loaded / event.total) * 100;
                        setUploadProgress(progress);
                    }
                });

                xhr.addEventListener('load', () => {
                    setIsUploading(false);
                    setUploadProgress(0);

                    if (xhr.status === 200) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            if (response.success) {
                                resolve({
                                    success: true,
                                    url: response.data.url
                                });
                            } else {
                                resolve({
                                    success: false,
                                    error: response.error?.message || 'Upload failed'
                                });
                            }
                        } catch (error) {
                            resolve({
                                success: false,
                                error: 'Invalid response from server'
                            });
                        }
                    } else {
                        resolve({
                            success: false,
                            error: `Upload failed with status ${xhr.status}`
                        });
                    }
                });

                xhr.addEventListener('error', () => {
                    setIsUploading(false);
                    setUploadProgress(0);
                    resolve({
                        success: false,
                        error: 'Network error during upload'
                    });
                });

                xhr.open('POST', `https://api.imgbb.com/1/upload?key=${apiKey}`);
                xhr.send(formData);
            });

        } catch (error) {
            setIsUploading(false);
            setUploadProgress(0);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    };

    return {
        uploadImage,
        isUploading,
        uploadProgress
    };
};