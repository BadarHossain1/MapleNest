'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, MapPin, Bed, Bath, Square, Calendar, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SaveButton } from '@/components/SaveButton';
import { formatPrice, formatSquareFeet, cn } from '@/lib/utils';

interface PropertyCardProps {
  listing: any;
  className?: string;
}

export function PropertyCard({ listing, className }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  return (
    <motion.div
      className={cn(
        'group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden',
        className
      )}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image Carousel */}
      <div className="relative h-48 overflow-hidden">
        <Link href={`/listing/${listing.slug}`}>
          <div className="relative w-full h-full">
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            <img 
              src={listing.images[currentImageIndex]} 
              alt={listing.title}
              className={cn(
                'w-full h-full object-cover transition-all duration-300 group-hover:scale-105',
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setIsImageLoaded(true)}
            />
          </div>
        </Link>
        
        {/* Image Navigation */}
        {listing.images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={prevImage}
              className="p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
            >
              ←
            </button>
            <button
              onClick={nextImage}
              className="p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
            >
              →
            </button>
          </div>
        )}

        {/* Image Indicators */}
        {listing.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {listing.images.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-colors',
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                )}
              />
            ))}
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {formatPrice(listing.priceCAD, listing.status === 'for-rent')}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={cn(
            'px-2 py-1 rounded-full text-xs font-medium',
            listing.status === 'for-sale' 
              ? 'bg-blue-100 text-blue-800'
              : 'bg-purple-100 text-purple-800'
          )}>
            {listing.status === 'for-sale' ? 'For Sale' : 'For Rent'}
          </span>
        </div>

        {/* Save Button */}
        <div className="absolute top-3 right-12">
          <SaveButton listingId={listing.id} variant="overlay" />
        </div>

        {/* Verified Badge */}
        {listing.verified && (
          <div className="absolute bottom-3 right-3">
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
              <Check className="h-3 w-3 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-600">Verified</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <Link href={`/listing/${listing.slug}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {listing.title}
          </h3>
        </Link>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{listing.address}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {listing.description}
        </p>

        {/* Property Details */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          {listing.beds > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{listing.beds}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{listing.baths}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4" />
            <span>{formatSquareFeet(listing.areaSqft)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>{listing.daysOnMarket} days on market</span>
          </div>
          
          <Link href={`/listing/${listing.slug}`}>
            <Button size="sm" variant="outline" className="text-xs">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}