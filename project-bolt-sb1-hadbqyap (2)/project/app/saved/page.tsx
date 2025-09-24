'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Heart,
  Search,
  Filter,
  Share2,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Star,
  Grid3X3,
  List,
  SortAsc,
  Trash2,
  Eye,
  Download,
  Mail,
  Plus,
  Bell,
  Edit3,
  TrendingUp,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import listingsData from '@/data/listings.json';

interface SavedProperty {
  id: string;
  title: string;
  address: string;
  city: string;
  price: string;
  originalPrice?: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  gallery: string[];
  savedDate: string;
  status: 'For Sale' | 'For Rent' | 'Sold' | 'Rented';
  features: string[];
  agent: {
    name: string;
    phone: string;
    image: string;
  };
  isNew?: boolean;
  isFeatured?: boolean;
  priceReduced?: boolean;
}

interface SavedSearch {
  id: string;
  name: string;
  location: string;
  priceRange: string;
  propertyType: string;
  bedrooms: string;
  createdAt: string;
  alerts: boolean;
  frequency: string;
}

export default function SavedPage() {
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [activeTab, setActiveTab] = useState<'properties' | 'searches'>('properties');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Convert existing listings data to new format and add mock data
  useEffect(() => {
    const loadData = () => {
      // Load saved properties
      const savedIds = JSON.parse(localStorage.getItem('savedListings') || '[]');
      const savedListings = listingsData.filter(listing => savedIds.includes(listing.id));

      // Convert to new format with additional mock properties
      const convertedProperties: SavedProperty[] = savedListings.map(listing => ({
        id: listing.id.toString(),
        title: listing.title,
        address: listing.address,
        city: listing.city,
        price: listing.price,
        type: listing.type,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        area: listing.area,
        image: `/api/placeholder/400/300`,
        gallery: [`/api/placeholder/400/300`],
        savedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: Math.random() > 0.8 ? 'Sold' : Math.random() > 0.6 ? 'For Rent' : 'For Sale',
        features: ['Parking', 'Balcony', 'Modern Kitchen', 'Hardwood Floors'].slice(0, Math.floor(Math.random() * 4) + 1),
        agent: {
          name: ['Sarah Johnson', 'Michael Chen', 'Emma Dubois', 'David Wilson', 'Lisa Thompson'][Math.floor(Math.random() * 5)],
          phone: `(${Math.floor(Math.random() * 900) + 100}) 555-${Math.floor(Math.random() * 9000) + 1000}`,
          image: `/api/placeholder/60/60`
        },
        isNew: Math.random() > 0.8,
        isFeatured: Math.random() > 0.7,
        priceReduced: Math.random() > 0.8
      }));

      // Add some additional mock properties if list is small
      if (convertedProperties.length < 3) {
        const mockProperties: SavedProperty[] = [
          {
            id: 'mock-1',
            title: 'Luxury Downtown Condo',
            address: '123 Bay Street',
            city: 'Toronto, ON',
            price: '$1,250,000',
            originalPrice: '$1,350,000',
            type: 'Condo',
            bedrooms: 2,
            bathrooms: 2,
            area: 1200,
            image: '/api/placeholder/400/300',
            gallery: ['/api/placeholder/400/300'],
            savedDate: '2024-01-15',
            status: 'For Sale',
            features: ['Balcony', 'Parking', 'Gym', 'Concierge'],
            agent: {
              name: 'Sarah Johnson',
              phone: '(416) 555-0123',
              image: '/api/placeholder/60/60'
            },
            isNew: false,
            isFeatured: true,
            priceReduced: true
          },
          {
            id: 'mock-2',
            title: 'Modern Family Home',
            address: '456 Maple Avenue',
            city: 'Vancouver, BC',
            price: '$2,850,000',
            type: 'House',
            bedrooms: 4,
            bathrooms: 3,
            area: 2800,
            image: '/api/placeholder/400/300',
            gallery: ['/api/placeholder/400/300'],
            savedDate: '2024-01-10',
            status: 'For Sale',
            features: ['Garden', 'Garage', 'Fireplace', 'Hardwood'],
            agent: {
              name: 'Michael Chen',
              phone: '(604) 555-0456',
              image: '/api/placeholder/60/60'
            },
            isNew: true,
            isFeatured: false
          },
          {
            id: 'mock-3',
            title: 'Cozy Studio Apartment',
            address: '789 Queen Street',
            city: 'Montreal, QC',
            price: '$2,200/month',
            type: 'Studio',
            bedrooms: 0,
            bathrooms: 1,
            area: 650,
            image: '/api/placeholder/400/300',
            gallery: ['/api/placeholder/400/300'],
            savedDate: '2024-01-08',
            status: 'For Rent',
            features: ['Furnished', 'Utilities Included', 'Pet Friendly'],
            agent: {
              name: 'Emma Dubois',
              phone: '(514) 555-0789',
              image: '/api/placeholder/60/60'
            },
            isNew: false,
            isFeatured: false
          }
        ];
        convertedProperties.push(...mockProperties);
      }

      setSavedProperties(convertedProperties);

      // Load saved searches
      const searches = JSON.parse(localStorage.getItem('savedSearches') || '[]');
      if (searches.length === 0) {
        // Add some mock saved searches
        const mockSearches: SavedSearch[] = [
          {
            id: 'search-1',
            name: 'Downtown Toronto Condos',
            location: 'Toronto, ON',
            priceRange: '$800K - $1.5M',
            propertyType: 'Condo',
            bedrooms: '2+',
            createdAt: '2024-01-10',
            alerts: true,
            frequency: 'Daily'
          },
          {
            id: 'search-2',
            name: 'Vancouver Family Homes',
            location: 'Vancouver, BC',
            priceRange: '$2M - $4M',
            propertyType: 'House',
            bedrooms: '3+',
            createdAt: '2024-01-05',
            alerts: false,
            frequency: 'Weekly'
          }
        ];
        setSavedSearches(mockSearches);
      } else {
        setSavedSearches(searches);
      }

      setIsLoading(false);
    };

    setTimeout(loadData, 800);
  }, []);

  const filteredAndSortedProperties = savedProperties
    .filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || property.type.toLowerCase() === filterType.toLowerCase();
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime();
        case 'price-high':
          return parseFloat(b.price.replace(/[^0-9.]/g, '')) - parseFloat(a.price.replace(/[^0-9.]/g, ''));
        case 'price-low':
          return parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, ''));
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const handleRemoveProperty = (propertyId: string) => {
    setSavedProperties(prev => prev.filter(p => p.id !== propertyId));
    setSelectedProperties(prev => prev.filter(id => id !== propertyId));

    // Update localStorage if it's an original listing
    const numericId = parseInt(propertyId);
    if (!isNaN(numericId)) {
      const savedIds = JSON.parse(localStorage.getItem('savedListings') || '[]');
      const updated = savedIds.filter((id: number) => id !== numericId);
      localStorage.setItem('savedListings', JSON.stringify(updated));
    }
  };

  const handleBulkRemove = () => {
    setSavedProperties(prev => prev.filter(p => !selectedProperties.includes(p.id)));

    // Update localStorage for original listings
    selectedProperties.forEach(id => {
      const numericId = parseInt(id);
      if (!isNaN(numericId)) {
        const savedIds = JSON.parse(localStorage.getItem('savedListings') || '[]');
        const updated = savedIds.filter((savedId: number) => savedId !== numericId);
        localStorage.setItem('savedListings', JSON.stringify(updated));
      }
    });

    setSelectedProperties([]);
  };

  const handleSelectProperty = (propertyId: string) => {
    setSelectedProperties(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const removeSavedSearch = (searchId: string) => {
    const updated = savedSearches.filter(search => search.id !== searchId);
    setSavedSearches(updated);
    localStorage.setItem('savedSearches', JSON.stringify(updated));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      <div className="container mx-auto px-4 pb-16">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                <Heart className="h-8 w-8 text-red-500 fill-current" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Your Favorites</h1>
                <p className="text-lg text-gray-600">
                  Manage your saved properties and searches
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-white rounded-xl shadow-sm p-1 border">
              <button
                onClick={() => setActiveTab('properties')}
                className={`px-8 py-3 rounded-lg font-medium transition-all ${activeTab === 'properties'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Properties ({savedProperties.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('searches')}
                className={`px-8 py-3 rounded-lg font-medium transition-all ${activeTab === 'searches'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Searches ({savedSearches.length})
                </div>
              </button>
            </div>
          </div>
        </motion.div>

        {activeTab === 'properties' ? (
          <>
            {savedProperties.length > 0 && (
              <motion.div
                className="bg-white rounded-xl shadow-sm p-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search saved properties..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="all">All Types</option>
                      <option value="house">Houses</option>
                      <option value="condo">Condos</option>
                      <option value="townhouse">Townhouses</option>
                      <option value="studio">Studios</option>
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="alphabetical">Alphabetical</option>
                    </select>
                  </div>

                  {/* View Controls */}
                  <div className="flex items-center gap-4">
                    {selectedProperties.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {selectedProperties.length} selected
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleBulkRemove}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share List
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Properties Display */}
            {filteredAndSortedProperties.length === 0 ? (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Heart className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {searchQuery || filterType !== 'all' ? 'No matching properties' : 'No saved properties yet'}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {searchQuery || filterType !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Start browsing properties and save your favorites here'
                  }
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/buy">
                    <Button size="lg">
                      <Search className="h-4 w-4 mr-2" />
                      Browse Properties
                    </Button>
                  </Link>
                  <Link href="/rent">
                    <Button variant="outline" size="lg">Explore Rentals</Button>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
                }`}>
                <AnimatePresence>
                  {filteredAndSortedProperties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className={`bg-white shadow-sm hover:shadow-xl transition-all duration-300 group ${selectedProperties.includes(property.id) ? 'ring-2 ring-emerald-500' : ''
                        } ${viewMode === 'list' ? 'flex' : ''}`}>
                        <div className={`relative ${viewMode === 'list' ? 'w-80 flex-shrink-0' : ''}`}>
                          <div className={`relative overflow-hidden ${viewMode === 'list' ? 'h-full rounded-l-xl' : 'h-56 rounded-t-xl'
                            }`}>
                            <img
                              src={property.image}
                              alt={property.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />

                            {/* Property Status Badges */}
                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                              {property.isNew && (
                                <Badge className="bg-blue-500 text-white shadow-lg">NEW</Badge>
                              )}
                              {property.isFeatured && (
                                <Badge className="bg-yellow-500 text-white shadow-lg">
                                  <Star className="h-3 w-3 mr-1" />
                                  FEATURED
                                </Badge>
                              )}
                              {property.priceReduced && (
                                <Badge className="bg-red-500 text-white shadow-lg">PRICE REDUCED</Badge>
                              )}
                              <Badge className={`shadow-lg ${property.status === 'For Sale' ? 'bg-green-500' :
                                property.status === 'For Rent' ? 'bg-blue-500' :
                                  property.status === 'Sold' ? 'bg-gray-500' :
                                    'bg-orange-500'
                                } text-white`}>
                                {property.status}
                              </Badge>
                            </div>

                            {/* Selection Checkbox */}
                            <div className="absolute top-3 right-3">
                              <input
                                type="checkbox"
                                checked={selectedProperties.includes(property.id)}
                                onChange={() => handleSelectProperty(property.id)}
                                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 shadow-lg"
                              />
                            </div>

                            {/* Quick Actions */}
                            <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                                onClick={() => handleRemoveProperty(property.id)}
                              >
                                <Heart className="h-4 w-4 text-red-500 fill-current" />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <CardContent className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                          <div className="space-y-4">
                            {/* Title and Location */}
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                {property.title}
                              </h3>
                              <div className="flex items-center text-gray-600">
                                <MapPin className="h-4 w-4 mr-1" />
                                {property.address}, {property.city}
                              </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-2">
                              <span className="text-3xl font-bold text-emerald-600">
                                {property.price}
                              </span>
                              {property.originalPrice && (
                                <span className="text-lg text-gray-500 line-through">
                                  {property.originalPrice}
                                </span>
                              )}
                            </div>

                            {/* Property Details */}
                            <div className="flex items-center gap-6 text-gray-600">
                              {property.bedrooms > 0 && (
                                <div className="flex items-center gap-1">
                                  <Bed className="h-4 w-4" />
                                  <span className="font-medium">{property.bedrooms}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Bath className="h-4 w-4" />
                                <span className="font-medium">{property.bathrooms}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Square className="h-4 w-4" />
                                <span className="font-medium">{property.area.toLocaleString()} sq ft</span>
                              </div>
                            </div>

                            {/* Features */}
                            <div className="flex flex-wrap gap-2">
                              {property.features.slice(0, 3).map((feature, idx) => (
                                <Badge key={idx} variant="secondary" className="bg-gray-100 text-gray-700">
                                  {feature}
                                </Badge>
                              ))}
                              {property.features.length > 3 && (
                                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                  +{property.features.length - 3} more
                                </Badge>
                              )}
                            </div>

                            {/* Saved Date */}
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              Saved {formatDate(property.savedDate)}
                            </div>

                            {/* Agent Info */}
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <img
                                src={property.agent.image}
                                alt={property.agent.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="font-medium text-sm">{property.agent.name}</div>
                                <div className="text-xs text-gray-600">{property.agent.phone}</div>
                              </div>
                              <Button size="sm" variant="outline">
                                <Mail className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <Link href={`/listing/${property.id}`} className="flex-1">
                                <Button className="w-full" size="sm">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Summary Stats */}
            {savedProperties.length > 0 && (
              <motion.div
                className="mt-12 bg-white rounded-xl shadow-sm p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Your Portfolio Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600 mb-1">
                      {savedProperties.filter(p => p.status === 'For Sale').length}
                    </div>
                    <div className="text-sm text-gray-600">For Sale</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {savedProperties.filter(p => p.status === 'For Rent').length}
                    </div>
                    <div className="text-sm text-gray-600">For Rent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-1">
                      {savedProperties.filter(p => p.isFeatured).length}
                    </div>
                    <div className="text-sm text-gray-600">Featured</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-1">
                      {savedProperties.filter(p => p.priceReduced).length}
                    </div>
                    <div className="text-sm text-gray-600">Price Reduced</div>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        ) : (
          // Saved Searches Tab
          <div className="space-y-6">
            {savedSearches.length > 0 ? (
              <>
                <motion.div
                  className="flex justify-between items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900">
                    Your Saved Searches
                  </h2>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Search
                  </Button>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedSearches.map((search, index) => (
                    <motion.div
                      key={search.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                    >
                      <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 group">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                {search.name}
                              </h3>
                              <div className="space-y-2 text-sm text-gray-600">
                                {search.location && (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    {search.location}
                                  </div>
                                )}
                                {search.priceRange && (
                                  <div className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" />
                                    {search.priceRange}
                                  </div>
                                )}
                                {search.propertyType && (
                                  <div className="flex items-center gap-2">
                                    <Square className="h-4 w-4" />
                                    {search.propertyType}
                                  </div>
                                )}
                                {search.bedrooms && (
                                  <div className="flex items-center gap-2">
                                    <Bed className="h-4 w-4" />
                                    {search.bedrooms} bedrooms
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {search.alerts && (
                                <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                  <Bell className="h-3 w-3" />
                                  {search.frequency}
                                </div>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSavedSearch(search.id)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="h-4 w-4" />
                              Saved {formatDate(search.createdAt)}
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit3 className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button size="sm">
                                <Search className="h-4 w-4 mr-1" />
                                Run Search
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Search className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  No saved searches yet
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Create and save custom searches to get notified when new properties match your criteria.
                </p>
                <Button size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Search
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}