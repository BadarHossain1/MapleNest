'use client';

import { useState, useEffect } from 'react';
import listingsData from '@/data/listings.json';

export function useListings(status?: string, filters: any = {}, sortBy: string = 'newest') {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      let filtered = listingsData;

      // Filter by status
      if (status === 'for-sale') {
        filtered = filtered.filter(listing => listing.status === 'for-sale');
      } else if (status === 'for-rent') {
        filtered = filtered.filter(listing => listing.status === 'for-rent');
      } else if (status === 'commercial') {
        filtered = filtered.filter(listing => 
          ['office', 'retail', 'warehouse', 'mixed-use'].includes(listing.propertyType)
        );
      }

      // Apply filters
      if (filters.city) {
        filtered = filtered.filter(listing => 
          listing.city.toLowerCase() === filters.city.toLowerCase()
        );
      }

      if (filters.propertyType) {
        filtered = filtered.filter(listing => 
          listing.propertyType === filters.propertyType
        );
      }

      if (filters.minPrice) {
        filtered = filtered.filter(listing => 
          listing.priceCAD >= parseInt(filters.minPrice)
        );
      }

      if (filters.maxPrice) {
        filtered = filtered.filter(listing => 
          listing.priceCAD <= parseInt(filters.maxPrice)
        );
      }

      if (filters.beds) {
        filtered = filtered.filter(listing => 
          listing.beds >= filters.beds
        );
      }

      if (filters.baths) {
        filtered = filtered.filter(listing => 
          listing.baths >= filters.baths
        );
      }

      if (filters.minSqft) {
        filtered = filtered.filter(listing => 
          listing.areaSqft >= parseInt(filters.minSqft)
        );
      }

      if (filters.maxSqft) {
        filtered = filtered.filter(listing => 
          listing.areaSqft <= parseInt(filters.maxSqft)
        );
      }

      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.priceCAD - b.priceCAD);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.priceCAD - a.priceCAD);
          break;
        case 'sqft':
          filtered.sort((a, b) => b.areaSqft - a.areaSqft);
          break;
        case 'beds':
          filtered.sort((a, b) => b.beds - a.beds);
          break;
        case 'newest':
        default:
          filtered.sort((a, b) => a.daysOnMarket - b.daysOnMarket);
          break;
      }

      setListings(filtered);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [status, filters, sortBy]);

  return { listings, loading };
}