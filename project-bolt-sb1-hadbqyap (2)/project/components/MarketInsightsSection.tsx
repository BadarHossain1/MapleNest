'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const MarketInsightsSection = () => {
    // Real Estate Updates data
    const realEstateUpdates = [
        {
            id: 1,
            title: 'Top areas to rent affordable apartments in the Greater Toronto Area',
            category: 'MARKET TRENDS',
            image: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&h=250&fit=crop',
            readTime: '3 min read'
        },
        {
            id: 2,
            title: 'Popular areas to buy apartments and villas in Vancouver Metro',
            category: 'MARKET TRENDS',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
            readTime: '4 min read'
        },
        {
            id: 3,
            title: 'Branded residences in Calgary: The pinnacle of luxury living',
            category: 'MARKET TRENDS',
            image: 'https://images.unsplash.com/photo-1605875793179-82d9839faca7?w=400&h=250&fit=crop',
            readTime: '5 min read'
        },
        {
            id: 4,
            title: 'The most expensive properties in Montreal: Premium market insights',
            category: 'MARKET TRENDS',
            image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&h=250&fit=crop',
            readTime: '4 min read'
        }
    ];

    // Popular Neighborhoods data
    const popularNeighborhoods = [
        {
            id: 1,
            name: 'The Annex',
            city: 'Toronto',
            status: 'Ready',
            image: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&h=250&fit=crop'
        },
        {
            id: 2,
            name: 'Yaletown',
            city: 'Vancouver',
            status: 'Ready',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop'
        },
        {
            id: 3,
            name: 'Kensington',
            city: 'Calgary',
            status: 'Ready',
            image: 'https://images.unsplash.com/photo-1605875793179-82d9839faca7?w=400&h=250&fit=crop'
        },
        {
            id: 4,
            name: 'Mile End',
            city: 'Montreal',
            status: 'Ready',
            image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&h=250&fit=crop'
        }
    ];

    // Top Buildings data
    const topBuildings = [
        {
            id: 1,
            name: 'One Bloor East',
            location: 'Toronto',
            floors: '75 floors',
            units: '711 units',
            status: 'Ready',
            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop'
        },
        {
            id: 2,
            name: 'Trump Tower Vancouver',
            location: 'Vancouver',
            floors: '69 floors',
            units: '290 units',
            status: 'Ready',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=250&fit=crop'
        },
        {
            id: 3,
            name: 'The Bow Tower',
            location: 'Calgary',
            floors: '58 floors',
            units: '345 units',
            status: 'Ready',
            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop'
        },
        {
            id: 4,
            name: 'Tour des Canadiens',
            location: 'Montreal',
            floors: '50 floors',
            units: '552 units',
            status: 'Ready',
            image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=250&fit=crop'
        }
    ];

    const cities = ['Toronto', 'Vancouver', 'Calgary', 'Montreal', 'Ottawa'];

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">
                        Learn more about Canada's property market
                    </h2>

                    {/* City Navigation */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {cities.map((city, index) => (
                            <Button
                                key={city}
                                variant={index === 0 ? "default" : "outline"}
                                className={index === 0 ? "bg-emerald-500 hover:bg-emerald-600" : "border-gray-300 hover:border-emerald-500 hover:text-emerald-600"}
                            >
                                {city}
                            </Button>
                        ))}
                    </div>
                </motion.div>

                {/* Real Estate Updates Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-16"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <h3 className="text-2xl font-bold text-gray-900">Real Estate Updates From</h3>
                            <span className="text-2xl font-bold text-emerald-600">MapleNest</span>
                        </div>
                        <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700">
                            View All <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {realEstateUpdates.map((update, index) => (
                            <motion.div
                                key={update.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 * index }}
                                className="group cursor-pointer"
                            >
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <div className="relative">
                                        <img
                                            src={update.image}
                                            alt={update.title}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                                                {update.category}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h4 className="text-white font-semibold text-sm leading-tight">
                                                {update.title}
                                            </h4>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Popular Neighborhoods Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mb-16"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <h3 className="text-2xl font-bold text-gray-900">Discover Popular Neighbourhoods in Canada</h3>
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                Ready Only
                            </span>
                        </div>
                        <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700">
                            View All <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {popularNeighborhoods.map((neighborhood, index) => (
                            <motion.div
                                key={neighborhood.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 * index }}
                                className="group cursor-pointer"
                            >
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <div className="relative">
                                        <img
                                            src={neighborhood.image}
                                            alt={neighborhood.name}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                                                {neighborhood.status}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h4 className="text-white font-semibold text-lg">
                                                {neighborhood.name}
                                            </h4>
                                            <p className="text-white/90 text-sm">
                                                {neighborhood.city}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Top Buildings Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <h3 className="text-2xl font-bold text-gray-900">Explore Top Buildings in Canada</h3>
                            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                Ready Only
                            </span>
                        </div>
                        <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700">
                            View All <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topBuildings.map((building, index) => (
                            <motion.div
                                key={building.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 * index }}
                                className="group cursor-pointer"
                            >
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-emerald-600">
                                    <div className="relative">
                                        <div
                                            className="w-full h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                                            style={{ backgroundImage: `url(${building.image})` }}
                                        >
                                            <div className="absolute inset-0 bg-emerald-600/80" />
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-emerald-500 text-white px-3 py-1 rounded text-xs font-medium">
                                                    {building.status}
                                                </span>
                                            </div>
                                            <div className="absolute top-4 right-4 text-white text-right">
                                                <div className="text-sm font-medium">{building.floors}</div>
                                                <div className="text-xs opacity-90">{building.units}</div>
                                            </div>
                                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                                <h4 className="font-semibold text-lg mb-1">
                                                    {building.name}
                                                </h4>
                                                <p className="text-sm opacity-90">
                                                    {building.location}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default MarketInsightsSection;