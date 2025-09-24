'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft,
  MapPin,
  List,
  Map as MapIcon,
  Filter,
  ChevronDown,
  Heart,
  Bed,
  Bath,
  Square,
  Car,
  Search,
  Settings2,
  Eye,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NeighborhoodExplorerPage() {
  const [viewMode, setViewMode] = useState('map');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [priceRange, setPriceRange] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [bedrooms, setBedrooms] = useState('all');

  const filters = [
    { id: 'all', label: 'All', active: true },
    { id: 'ready', label: 'Ready', active: false },
    { id: 'off-plan', label: 'Off-Plan', active: false },
  ];

  const mockProperties = [
    {
      id: 1,
      price: 'CAD 1,690,000',
      beds: 4,
      baths: 3,
      sqft: '2,250',
      address: 'Gardenia Bay, Yas Island, Abu Dhabi',
      developer: 'Sea To Sky Property Management',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
      truCheck: true,
      lat: 24.4985,
      lng: 54.4085,
      type: 'Villa'
    },
    {
      id: 2,
      price: 'CAD 2,850,000',
      beds: 5,
      baths: 4,
      sqft: '3,120',
      address: 'Gardenia Bay, Yas Island, Abu Dhabi',
      developer: 'Elite Real Estate',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
      truCheck: true,
      lat: 24.5015,
      lng: 54.4125,
      type: 'Villa'
    },
    {
      id: 3,
      price: 'CAD 26,500,000',
      beds: 7,
      baths: 8,
      sqft: '8,500',
      address: 'The Sundials, Jumeirah Golf Estates',
      developer: 'Exclusive Real Estate',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
      truCheck: true,
      lat: 25.0445,
      lng: 55.2356,
      type: 'Mansion'
    },
    {
      id: 4,
      price: 'CAD 2,900,000',
      beds: 4,
      baths: 5,
      sqft: '2,850',
      address: 'Acreantage Tower, Dubai Marina, Dubai',
      developer: 'The Network',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400',
      truCheck: true,
      lat: 25.0820,
      lng: 55.1420,
      type: 'Penthouse'
    },
    {
      id: 5,
      price: 'CAD 1,949,999',
      beds: 3,
      baths: 4,
      sqft: '1,875',
      address: 'Binghatti Ghost, Dubai Healthcare City',
      developer: 'Workspace Real Estate - Branch',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400',
      truCheck: true,
      lat: 25.2285,
      lng: 55.3215,
      type: 'Apartment'
    },
    {
      id: 6,
      price: 'CAD 8,950,000',
      beds: 6,
      baths: 7,
      sqft: '5,200',
      address: 'Saadiyat Lagoons, Saadiyat Island, Abu Dhabi',
      developer: 'Sea To Sky Property Management',
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400',
      truCheck: true,
      lat: 24.5420,
      lng: 54.4385,
      type: 'Villa'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Return to regular search</span>
              </Link>
            </div>
            
            {/* Top Filters Bar */}
            <div className="flex items-center gap-4">
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>Buy</option>
                <option>Rent</option>
              </select>
              
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Enter location"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48"
                />
              </div>

              <div className="flex bg-gray-100 rounded-md p-1">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.label)}
                    className={`px-4 py-1 text-sm font-medium rounded transition-all ${
                      selectedFilter === filter.label
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'text-gray-600 hover:text-emerald-600'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>Residential</option>
                <option>Commercial</option>
              </select>

              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>Beds & Baths</option>
                <option>1+ Bed</option>
                <option>2+ Beds</option>
                <option>3+ Beds</option>
              </select>

              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>Price (CAD)</option>
                <option>Under $500K</option>
                <option>$500K - $1M</option>
                <option>$1M+</option>
              </select>

              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>Area (sqft)</option>
                <option>Under 1000</option>
                <option>1000-2000</option>
                <option>2000+</option>
              </select>

              <div className="flex bg-white border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 flex items-center gap-2 text-sm font-medium ${
                    viewMode === 'list' ? 'bg-emerald-500 text-white' : 'text-gray-600 hover:text-emerald-600'
                  }`}
                >
                  <List className="h-4 w-4" />
                  List
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-2 flex items-center gap-2 text-sm font-medium ${
                    viewMode === 'map' ? 'bg-emerald-500 text-white' : 'text-gray-600 hover:text-emerald-600'
                  }`}
                >
                  <MapIcon className="h-4 w-4" />
                  Map
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Properties List Panel */}
        <div className="w-1/2 bg-white border-r border-gray-200 h-screen overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Properties for sale in Canada</h2>
              <button className="text-emerald-600 text-sm hover:underline">Clear Filters</button>
            </div>

            <div className="space-y-4">
              {mockProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 group"
                >
                  <div className="relative">
                    <img
                      src={property.image}
                      alt={property.address}
                      className="w-full h-48 object-cover"
                    />
                    
                    {/* TruCheck Badge */}
                    {property.truCheck && (
                      <div className="absolute top-3 left-3 bg-emerald-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                        <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                        </div>
                        TruCheck™ first
                      </div>
                    )}

                    {/* Heart Icon */}
                    <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors">
                      <Heart className="h-4 w-4 text-gray-600" />
                    </button>

                    {/* Property Type */}
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {property.type}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{property.price}</h3>
                      <div className="text-right">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            <span>{property.beds}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            <span>{property.baths}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Square className="h-4 w-4" />
                            <span>{property.sqft} sqft</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-2">{property.address}</p>
                    <p className="text-gray-500 text-xs mb-4">{property.developer}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-emerald-600 text-xs">
                          <Eye className="h-3 w-3" />
                          <span>5 min to A</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          View Details
                        </Button>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs">
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Panel */}
        <div className="w-1/2 relative">
          <div className="h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-emerald-50">
            {/* Interactive Map */}
            <div className="absolute inset-0">
              <svg viewBox="0 0 800 600" className="w-full h-full">
                {/* Map Background with Canadian Geography */}
                <rect width="800" height="600" fill="url(#canadaMapGradient)" />
                
                {/* Water Bodies */}
                <path d="M0,200 Q100,180 200,200 Q300,220 400,200 Q500,180 600,200 Q700,220 800,200 L800,0 L0,0 Z" fill="#a7f3d0" opacity="0.6" />
                <path d="M0,600 Q100,580 200,600 Q300,620 400,600 Q500,580 600,600 Q700,620 800,600 L800,400 Q700,380 600,400 Q500,420 400,400 Q300,380 200,400 Q100,420 0,400 Z" fill="#a7f3d0" opacity="0.6" />
                
                {/* Major Canadian Cities Areas */}
                {/* Toronto Area */}
                <g transform="translate(600, 300)">
                  <circle cx="0" cy="0" r="60" fill="#f0fdf4" opacity="0.8" />
                  <text x="0" y="5" textAnchor="middle" className="text-sm font-medium fill-emerald-700">Toronto</text>
                  {/* CN Tower landmark */}
                  <line x1="0" y1="-20" x2="0" y2="-40" stroke="#4ade80" strokeWidth="2" />
                  <circle cx="0" cy="-40" r="3" fill="#4ade80" />
                </g>

                {/* Vancouver Area */}
                <g transform="translate(150, 250)">
                  <circle cx="0" cy="0" r="50" fill="#f0fdf4" opacity="0.8" />
                  <text x="0" y="5" textAnchor="middle" className="text-sm font-medium fill-emerald-700">Vancouver</text>
                </g>

                {/* Montreal Area */}
                <g transform="translate(650, 200)">
                  <circle cx="0" cy="0" r="45" fill="#f0fdf4" opacity="0.8" />
                  <text x="0" y="5" textAnchor="middle" className="text-sm font-medium fill-emerald-700">Montreal</text>
                </g>

                {/* Calgary Area */}
                <g transform="translate(350, 280)">
                  <circle cx="0" cy="0" r="40" fill="#f0fdf4" opacity="0.8" />
                  <text x="0" y="5" textAnchor="middle" className="text-sm font-medium fill-emerald-700">Calgary</text>
                </g>

                {/* Property Markers */}
                {mockProperties.map((property, index) => {
                  const x = 200 + (index * 80) + (index % 2 * 40);
                  const y = 200 + (index * 30) + (index % 3 * 20);
                  return (
                    <g key={property.id} transform={`translate(${x}, ${y})`}>
                      <circle
                        cx="0"
                        cy="0"
                        r="12"
                        fill="#10b981"
                        stroke="white"
                        strokeWidth="3"
                        className="cursor-pointer hover:scale-110 transition-transform"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        className="text-xs font-bold fill-white pointer-events-none"
                      >
                        {index + 1}
                      </text>
                      
                      {/* Price tooltip */}
                      <g className="opacity-0 hover:opacity-100 transition-opacity">
                        <rect
                          x="-40"
                          y="-35"
                          width="80"
                          height="20"
                          fill="white"
                          stroke="#e5e7eb"
                          rx="4"
                        />
                        <text
                          x="0"
                          y="-22"
                          textAnchor="middle"
                          className="text-xs font-medium fill-gray-800"
                        >
                          {property.price.replace('CAD ', '')}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* Roads/Highways */}
                <path d="M0,350 Q200,330 400,350 Q600,370 800,350" stroke="#cbd5e1" strokeWidth="4" fill="none" opacity="0.7" />
                <path d="M300,0 Q320,200 300,400 Q280,500 300,600" stroke="#cbd5e1" strokeWidth="3" fill="none" opacity="0.7" />

                <defs>
                  <linearGradient id="canadaMapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f0f9ff" />
                    <stop offset="30%" stopColor="#e0f2fe" />
                    <stop offset="70%" stopColor="#ecfdf5" />
                    <stop offset="100%" stopColor="#f0fdf4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2 space-y-2">
              <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center text-gray-600 font-bold">
                +
              </button>
              <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center text-gray-600 font-bold">
                −
              </button>
            </div>

            {/* Drive Time Info */}
            <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-md flex items-center gap-2">
              <Car className="h-4 w-4" />
              <span className="text-sm font-medium">Drive Time</span>
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span>Available Properties</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>New Listings</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Price Reduced</span>
                </div>
              </div>
            </div>

            {/* Interactive Tooltip */}
            <div className="absolute bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm">
              Use Right Click to place a pin on the map and select your location
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}