'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  showPropertyType?: boolean;
  showCommercialFilters?: boolean;
}

export function FilterBar({ 
  filters, 
  onFiltersChange, 
  showPropertyType = false,
  showCommercialFilters = false 
}: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  const propertyTypes = showCommercialFilters 
    ? ['office', 'retail', 'warehouse', 'mixed-use']
    : ['condo', 'detached', 'semi-detached', 'townhouse', 'loft'];

  const cities = ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-32 z-30">
      <div className="container mx-auto px-4">
        {/* Quick Filters */}
        <div className="flex items-center gap-4 py-4 overflow-x-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              'flex items-center gap-2 whitespace-nowrap',
              hasActiveFilters && 'border-emerald-500 text-emerald-600'
            )}
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full text-xs">
                {Object.keys(filters).length}
              </span>
            )}
          </Button>

          {/* Price Range Quick Filters */}
          <div className="flex items-center gap-2">
            {['Under $500K', '$500K-$1M', '$1M-$2M', 'Over $2M'].map((range) => (
              <Button
                key={range}
                variant="outline"
                size="sm"
                className="whitespace-nowrap"
                onClick={() => {
                  // Implement price range logic
                  console.log('Price range:', range);
                }}
              >
                {range}
              </Button>
            ))}
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 py-6 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Location */}
              <div className="space-y-2">
                <Label className="font-medium text-gray-900">City</Label>
                <select
                  value={filters.city || ''}
                  onChange={(e) => updateFilter('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Property Type */}
              {showPropertyType && (
                <div className="space-y-2">
                  <Label className="font-medium text-gray-900">Property Type</Label>
                  <select
                    value={filters.propertyType || ''}
                    onChange={(e) => updateFilter('propertyType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price Range */}
              <div className="space-y-2">
                <Label className="font-medium text-gray-900">Price Range</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ''}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ''}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Bedrooms/Bathrooms (not for commercial) */}
              {!showCommercialFilters && (
                <div className="space-y-2">
                  <Label className="font-medium text-gray-900">Bedrooms</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <Button
                        key={num}
                        variant={filters.beds === num ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateFilter('beds', num)}
                        className="flex-1"
                      >
                        {num}+
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Bathrooms (not for commercial) */}
              {!showCommercialFilters && (
                <div className="space-y-2">
                  <Label className="font-medium text-gray-900">Bathrooms</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((num) => (
                      <Button
                        key={num}
                        variant={filters.baths === num ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateFilter('baths', num)}
                        className="flex-1"
                      >
                        {num}+
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Square Footage */}
              <div className="space-y-2">
                <Label className="font-medium text-gray-900">Square Footage</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min sq ft"
                    value={filters.minSqft || ''}
                    onChange={(e) => updateFilter('minSqft', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Max sq ft"
                    value={filters.maxSqft || ''}
                    onChange={(e) => updateFilter('maxSqft', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Year Built */}
              <div className="space-y-2">
                <Label className="font-medium text-gray-900">Year Built</Label>
                <select
                  value={filters.yearBuilt || ''}
                  onChange={(e) => updateFilter('yearBuilt', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Any Year</option>
                  <option value="2020+">2020 or newer</option>
                  <option value="2010+">2010 or newer</option>
                  <option value="2000+">2000 or newer</option>
                  <option value="pre-2000">Before 2000</option>
                </select>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <Label className="font-medium text-gray-900">Features</Label>
                <div className="space-y-2">
                  {['Parking', 'Gym', 'Concierge', 'Balcony', 'Pet Friendly'].map((feature) => (
                    <label key={feature} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.features?.includes(feature) || false}
                        onChange={(e) => {
                          const currentFeatures = filters.features || [];
                          const newFeatures = e.target.checked
                            ? [...currentFeatures, feature]
                            : currentFeatures.filter((f: string) => f !== feature);
                          updateFilter('features', newFeatures);
                        }}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                onClick={() => setIsExpanded(false)}
                className="px-8"
              >
                Apply Filters
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}