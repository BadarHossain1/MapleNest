'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    MapPin,
    Clock,
    Car,
    Train,
    Bus,
    Home,
    ArrowLeft,
    Filter,
    Search,
    Settings2,
    Heart,
    Bed,
    Bath,
    Square
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CommuteFinderPage() {
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [commuteTime, setCommuteTime] = useState('30');
    const [transportMode, setTransportMode] = useState('car');
    const [priceRange, setPriceRange] = useState('all');
    const [propertyType, setPropertyType] = useState('all');
    const [bedrooms, setBedrooms] = useState('all');

    const transportModes = [
        { id: 'car', icon: Car, label: 'Driving', color: 'blue' },
        { id: 'transit', icon: Train, label: 'Transit', color: 'emerald' },
        { id: 'bus', icon: Bus, label: 'Bus', color: 'purple' },
    ];

    const mockProperties = [
        {
            id: 1,
            price: 'CAD 875,000',
            address: '123 Maple Street, Toronto',
            beds: 3,
            baths: 2,
            sqft: '1,250',
            commuteTime: '25 mins',
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
            checked: true
        },
        {
            id: 2,
            price: 'CAD 1,250,000',
            address: '456 Oak Avenue, Mississauga',
            beds: 4,
            baths: 3,
            sqft: '1,850',
            commuteTime: '28 mins',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
            checked: false
        },
        {
            id: 3,
            price: 'CAD 950,000',
            address: '789 Pine Road, Markham',
            beds: 3,
            baths: 2.5,
            sqft: '1,450',
            commuteTime: '32 mins',
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
            checked: false
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
                                <span>Back to Home</span>
                            </Link>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <h1 className="text-xl font-semibold text-gray-900">Commute Finder</h1>
                        </div>
                        <Button variant="outline" size="sm">
                            <Settings2 className="h-4 w-4 mr-2" />
                            Advanced Filters
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Search & Filters Panel */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Commute Search */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        >
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Clock className="h-5 w-5 text-emerald-600" />
                                Commute Details
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">From (Home)</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type="text"
                                            value={fromLocation}
                                            onChange={(e) => setFromLocation(e.target.value)}
                                            placeholder="Enter your work location"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">To (Work)</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type="text"
                                            value={toLocation}
                                            onChange={(e) => setToLocation(e.target.value)}
                                            placeholder="Enter your preferred area"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Max Commute Time: {commuteTime} minutes
                                    </label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="90"
                                        value={commuteTime}
                                        onChange={(e) => setCommuteTime(e.target.value)}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>10 min</span>
                                        <span>90 min</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Transportation</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {transportModes.map((mode) => {
                                            const IconComponent = mode.icon;
                                            return (
                                                <button
                                                    key={mode.id}
                                                    onClick={() => setTransportMode(mode.id)}
                                                    className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${transportMode === mode.id
                                                            ? `border-${mode.color}-500 bg-${mode.color}-50 text-${mode.color}-700`
                                                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                        }`}
                                                >
                                                    <IconComponent className="h-5 w-5" />
                                                    <span className="text-xs font-medium">{mode.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Property Filters */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        >
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Filter className="h-5 w-5 text-emerald-600" />
                                Property Filters
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                                    <select
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="all">All Prices</option>
                                        <option value="under500k">Under CAD 500K</option>
                                        <option value="500k-750k">CAD 500K - 750K</option>
                                        <option value="750k-1m">CAD 750K - 1M</option>
                                        <option value="1m-1.5m">CAD 1M - 1.5M</option>
                                        <option value="over1.5m">Over CAD 1.5M</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                                    <select
                                        value={propertyType}
                                        onChange={(e) => setPropertyType(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="house">House</option>
                                        <option value="condo">Condo</option>
                                        <option value="townhouse">Townhouse</option>
                                        <option value="apartment">Apartment</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                                    <select
                                        value={bedrooms}
                                        onChange={(e) => setBedrooms(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="all">Any</option>
                                        <option value="1">1+ Bedroom</option>
                                        <option value="2">2+ Bedrooms</option>
                                        <option value="3">3+ Bedrooms</option>
                                        <option value="4">4+ Bedrooms</option>
                                    </select>
                                </div>
                            </div>

                            <Button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700">
                                <Search className="h-4 w-4 mr-2" />
                                Find Properties
                            </Button>
                        </motion.div>

                        {/* Results Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-emerald-50 rounded-xl border border-emerald-200 p-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <Home className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-emerald-800">Properties Found</p>
                                    <p className="text-lg font-bold text-emerald-900">847 homes</p>
                                    <p className="text-xs text-emerald-600">Within your commute preferences</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Map & Properties */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Interactive Map */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                        >
                            <div className="h-96 relative bg-gradient-to-br from-cyan-100 via-blue-50 to-emerald-50">
                                {/* Mock Map Interface */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg viewBox="0 0 800 400" className="w-full h-full">
                                        {/* Map Background */}
                                        <rect width="800" height="400" fill="url(#mapGradient)" />

                                        {/* Roads */}
                                        <path d="M0,200 Q200,180 400,200 T800,200" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                                        <path d="M200,0 Q220,100 200,200 T200,400" stroke="#e2e8f0" strokeWidth="6" fill="none" />
                                        <path d="M600,0 Q580,150 600,200 T600,400" stroke="#e2e8f0" strokeWidth="6" fill="none" />

                                        {/* Toronto Skyline */}
                                        <g transform="translate(350, 80)">
                                            {/* CN Tower */}
                                            <rect x="40" y="20" width="4" height="100" fill="#4a90e2" />
                                            <circle cx="42" cy="20" r="6" fill="#4a90e2" />

                                            {/* Buildings */}
                                            <rect x="10" y="60" width="20" height="60" fill="#64b5f6" />
                                            <rect x="35" y="50" width="18" height="70" fill="#81c784" />
                                            <rect x="58" y="70" width="15" height="50" fill="#ffb74d" />
                                            <rect x="78" y="55" width="22" height="65" fill="#f06292" />
                                            <rect x="105" y="65" width="18" height="55" fill="#ba68c8" />
                                        </g>

                                        {/* Property Markers */}
                                        <circle cx="150" cy="250" r="8" fill="#10b981" stroke="white" strokeWidth="2" />
                                        <circle cx="300" cy="180" r="8" fill="#ef4444" stroke="white" strokeWidth="2" />
                                        <circle cx="500" cy="220" r="8" fill="#3b82f6" stroke="white" strokeWidth="2" />
                                        <circle cx="650" cy="160" r="8" fill="#f59e0b" stroke="white" strokeWidth="2" />
                                        <circle cx="700" cy="280" r="8" fill="#8b5cf6" stroke="white" strokeWidth="2" />

                                        {/* Commute Routes */}
                                        <path d="M150,250 Q250,200 350,150" stroke="#10b981" strokeWidth="3" strokeDasharray="5,5" fill="none" opacity="0.7" />
                                        <path d="M300,180 Q350,165 400,150" stroke="#ef4444" strokeWidth="3" strokeDasharray="5,5" fill="none" opacity="0.7" />

                                        <defs>
                                            <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#f0f9ff" />
                                                <stop offset="50%" stopColor="#e0f2fe" />
                                                <stop offset="100%" stopColor="#ecfdf5" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>

                                {/* Map Controls */}
                                <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2 space-y-2">
                                    <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center text-gray-600">
                                        +
                                    </button>
                                    <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center text-gray-600">
                                        −
                                    </button>
                                </div>

                                {/* Map Legend */}
                                <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3">
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                            <span>Available</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                            <span>Sold</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                            <span>New</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Interactive Info Panel */}
                                <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
                                    <h3 className="font-semibold text-gray-900 mb-2">Commute Preview</h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Car className="h-4 w-4 text-blue-600" />
                                            <span>25 min drive to downtown</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Train className="h-4 w-4 text-emerald-600" />
                                            <span>32 min by transit</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Property Listings */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Properties Within Commute Range</h2>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span>Sort by:</span>
                                    <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                                        <option>Commute Time</option>
                                        <option>Price: Low to High</option>
                                        <option>Price: High to Low</option>
                                        <option>Recently Added</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                {mockProperties.map((property, index) => (
                                    <motion.div
                                        key={property.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.1 * index }}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
                                    >
                                        <div className="flex">
                                            <div className="relative w-64 h-48">
                                                <img
                                                    src={property.image}
                                                    alt={property.address}
                                                    className="w-full h-full object-cover"
                                                />
                                                {property.checked && (
                                                    <div className="absolute top-3 left-3 bg-emerald-500 text-white px-2 py-1 rounded text-xs font-medium">
                                                        ✓ Checked
                                                    </div>
                                                )}
                                                <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                                                    <Heart className="h-4 w-4 text-gray-600" />
                                                </button>
                                                <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                                                    {property.commuteTime}
                                                </div>
                                            </div>

                                            <div className="flex-1 p-6">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="text-xl font-bold text-gray-900">{property.price}</h3>
                                                    <div className="flex items-center gap-1 text-emerald-600">
                                                        <Clock className="h-4 w-4" />
                                                        <span className="text-sm font-medium">{property.commuteTime}</span>
                                                    </div>
                                                </div>

                                                <p className="text-gray-600 mb-4">{property.address}</p>

                                                <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                                                    <div className="flex items-center gap-1">
                                                        <Bed className="h-4 w-4" />
                                                        <span>{property.beds} beds</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Bath className="h-4 w-4" />
                                                        <span>{property.baths} baths</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Square className="h-4 w-4" />
                                                        <span>{property.sqft} sqft</span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3">
                                                    <Button variant="outline" size="sm">View Details</Button>
                                                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">Contact Agent</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}