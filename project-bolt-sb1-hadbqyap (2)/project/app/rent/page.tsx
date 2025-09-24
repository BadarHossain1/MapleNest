'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ListingsGrid } from '@/components/ListingsGrid';
import { FilterBar } from '@/components/FilterBar';
import { ViewToggle } from '@/components/ViewToggle';
import { SortOptions } from '@/components/SortOptions';
import { useListings } from '@/hooks/useListings';

const MapView = dynamic(() => import('@/components/MapView').then(mod => ({ default: mod.MapView })), {
  ssr: false,
  loading: () => <div className="h-[70vh] bg-gray-100 rounded-lg animate-pulse" />
});

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function RentPage() {
  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('newest');
  
  const { listings, loading } = useListings('for-rent', filters, sortBy);

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div 
        className="bg-white shadow-sm sticky top-20 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <h1 className="text-2xl font-bold text-gray-900">
                Rental Properties
              </h1>
              <span className="text-sm text-gray-500">
                {listings.length} properties
              </span>
            </div>
            
            <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
              <SortOptions value={sortBy} onChange={setSortBy} />
              <ViewToggle view={view} onViewChange={setView} />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div {...fadeInUp}>
        <FilterBar 
          filters={filters} 
          onFiltersChange={setFilters}
          showPropertyType
        />
      </motion.div>

      <motion.div 
        className="container mx-auto px-4 py-8"
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {view === 'grid' ? (
          <ListingsGrid listings={listings} loading={loading} />
        ) : (
          <div className="h-[70vh] rounded-lg overflow-hidden shadow-lg">
            <MapView listings={listings} />
          </div>
        )}
      </motion.div>
    </div>
  );
}