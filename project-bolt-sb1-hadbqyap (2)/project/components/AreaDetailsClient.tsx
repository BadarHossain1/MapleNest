'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ArrowLeft, MapPin, Users, DollarSign, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

const MapView = dynamic(() => import('@/components/MapView').then(mod => ({ default: mod.MapView })), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
});

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

interface AreaDetailsClientProps {
  area: any;
  areaListings: any[];
}

export function AreaDetailsClient({ area, areaListings }: AreaDetailsClientProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div 
        className="relative h-96 bg-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <img 
          src={area.heroImage} 
          alt={area.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <Link 
              href="/areas"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to areas</span>
            </Link>
            
            <motion.div {...fadeInUp}>
              <h1 className="text-5xl font-bold text-white mb-4">{area.title}</h1>
              <div className="flex items-center text-white/90 text-lg mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{area.city}, {area.province}</span>
              </div>
              <p className="text-white/90 text-lg max-w-2xl">{area.description}</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="container mx-auto px-4 py-12"
        {...fadeInUp}
        transition={{ delay: 0.2 }}
      >
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <Users className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {area.demographics.population.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Population</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <DollarSign className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
            <p className="text-2xl font-bold text-gray-900 mb-1">
              ${area.demographics.averageIncome.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Average Income</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <TrendingUp className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {formatPrice(area.averagePrices.condo)}
            </p>
            <p className="text-sm text-gray-600">Average Condo Price</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <TrendingUp className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {formatPrice(area.averagePrices.rental, true)}
            </p>
            <p className="text-sm text-gray-600">Average Rent</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {/* Lifestyle */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Lifestyle & Attractions</h2>
              <div className="grid grid-cols-1 gap-4">
                {area.lifestyle.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Local Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Parks & Recreation</h3>
                  <ul className="space-y-2">
                    {area.amenities.parks.map((park, index) => (
                      <li key={index} className="text-gray-700">{park}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Shopping</h3>
                  <ul className="space-y-2">
                    {area.amenities.shopping.map((shop, index) => (
                      <li key={index} className="text-gray-700">{shop}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Dining</h3>
                  <ul className="space-y-2">
                    {area.amenities.dining.map((restaurant, index) => (
                      <li key={index} className="text-gray-700">{restaurant}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Photo Gallery */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Neighborhood Photos</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {area.photos.map((photo, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <img 
                      src={photo} 
                      alt={`${area.title} photo ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Map */}
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
              <div className="h-64 rounded-lg overflow-hidden">
                <MapView 
                  listings={areaListings} 
                  center={area.coordinates} 
                  showSearch={false}
                />
              </div>
            </div>

            {/* Schools & Transit */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Schools</h3>
              <ul className="space-y-2 mb-6">
                {area.schools.map((school, index) => (
                  <li key={index} className="text-gray-700">{school}</li>
                ))}
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Transit</h3>
              <ul className="space-y-2">
                {area.transit.map((transit, index) => (
                  <li key={index} className="text-gray-700">{transit}</li>
                ))}
              </ul>
            </div>

            {/* Property Types */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Property Types</h3>
              <div className="space-y-3">
                {area.propertyTypes.map((type, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-gray-700">{type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}