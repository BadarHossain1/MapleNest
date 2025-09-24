'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Share2, MapPin, Calendar, Bed, Bath, Square, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PhotoGallery } from '@/components/PhotoGallery';
import { SaveButton } from '@/components/SaveButton';
import { ContactForm } from '@/components/ContactForm';
import { formatPrice, formatSquareFeet } from '@/lib/utils';
import listingsData from '@/data/listings.json';
import agentsData from '@/data/agents.json';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/MapView').then(mod => ({ default: mod.MapView })), {
  ssr: false,
  loading: () => <div className="h-80 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
    <p className="text-gray-500">Loading map...</p>
  </div>
});

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

interface ListingDetailsClientProps {
  slug: string;
}

export default function ListingDetailsClient({ slug }: ListingDetailsClientProps) {
  const [listing, setListing] = useState(null);
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundListing = listingsData.find(l => l.slug === slug);
    if (foundListing) {
      setListing(foundListing);
      const foundAgent = agentsData.find(a => a.email === foundListing.broker.email);
      setAgent(foundAgent);
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-8">The property you're looking for doesn't exist or has been removed.</p>
          <Link href="/buy">
            <Button>Browse Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div 
        className="bg-white shadow-sm border-b sticky top-20 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href={listing.status === 'for-sale' ? '/buy' : '/rent'}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to listings</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <SaveButton listingId={listing.id} />
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div {...fadeInUp}>
        <PhotoGallery images={listing.images} />
      </motion.div>

      <motion.div 
        className="container mx-auto px-4 py-8"
        {...fadeInUp}
        transition={{ delay: 0.2 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Property Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {formatPrice(listing.priceCAD, listing.status === 'for-rent')}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{listing.address}</span>
                  </div>
                  <p className="text-gray-600">{listing.city}, {listing.province}</p>
                </div>
                
                <div className="flex items-center gap-4 text-center">
                  {listing.beds > 0 && (
                    <div className="flex items-center gap-1">
                      <Bed className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">{listing.beds}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Bath className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">{listing.baths}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Square className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">{formatSquareFeet(listing.areaSqft)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  <span className="capitalize">{listing.propertyType.replace('-', ' ')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Built {listing.yearBuilt}</span>
                </div>
                <span>•</span>
                <span>{listing.daysOnMarket} days on market</span>
                {listing.verified && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-600 font-medium">Verified</span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">{listing.description}</p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Features & Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {listing.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
              <div className="h-80 rounded-lg overflow-hidden">
                <MapView listings={[listing]} showSearch={false} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-32">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Contact Agent
                </h3>
                {agent && (
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={agent.headshot} 
                      alt={agent.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{agent.name}</p>
                      <p className="text-sm text-gray-600">{agent.brokerage}</p>
                    </div>
                  </div>
                )}
              </div>
              <ContactForm listing={listing} agent={agent} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}