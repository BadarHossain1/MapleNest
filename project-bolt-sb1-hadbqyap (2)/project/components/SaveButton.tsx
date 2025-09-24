'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SaveButtonProps {
  listingId: number;
  variant?: 'default' | 'overlay';
  size?: 'sm' | 'default';
}

export function SaveButton({ listingId, variant = 'default', size = 'default' }: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedListings = JSON.parse(localStorage.getItem('savedListings') || '[]');
    setIsSaved(savedListings.includes(listingId));
  }, [listingId]);

  const toggleSave = () => {
    const savedListings = JSON.parse(localStorage.getItem('savedListings') || '[]');
    
    if (isSaved) {
      const updated = savedListings.filter((id: number) => id !== listingId);
      localStorage.setItem('savedListings', JSON.stringify(updated));
      setIsSaved(false);
    } else {
      const updated = [...savedListings, listingId];
      localStorage.setItem('savedListings', JSON.stringify(updated));
      setIsSaved(true);
    }
  };

  if (variant === 'overlay') {
    return (
      <button
        onClick={toggleSave}
        className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-sm transition-colors"
        aria-label={isSaved ? 'Remove from saved' : 'Save property'}
      >
        <Heart 
          className={cn(
            'h-4 w-4 transition-colors',
            isSaved 
              ? 'text-red-500 fill-red-500' 
              : 'text-gray-600 hover:text-red-500'
          )} 
        />
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      size={size}
      onClick={toggleSave}
      className={cn(
        'gap-2',
        isSaved && 'border-red-200 text-red-600 hover:text-red-700'
      )}
    >
      <Heart 
        className={cn(
          'h-4 w-4 transition-colors',
          isSaved ? 'text-red-500 fill-red-500' : 'text-gray-600'
        )} 
      />
      {isSaved ? 'Saved' : 'Save'}
    </Button>
  );
}