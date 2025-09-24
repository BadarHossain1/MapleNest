'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const cities = [
    { id: 'toronto', name: 'Toronto', active: true },
    { id: 'vancouver', name: 'Vancouver', active: false },
    { id: 'montreal', name: 'Montreal', active: false },
    { id: 'calgary', name: 'Calgary', active: false },
    { id: 'ottawa', name: 'Ottawa', active: false },
];

const marketTrends = [
    {
        id: 1,
        title: 'Best areas to rent affordable apartments in the Greater Toronto Area',
        image: 'https://source.unsplash.com/800x600/?toronto,apartments',
        badge: 'MARKET TRENDS',
        badgeColor: 'bg-purple-600'
    },
    {
        id: 2,
        title: 'Popular areas to buy condominiums and houses in Downtown Toronto',
        image: 'https://source.unsplash.com/800x600/?toronto,condo',
        badge: 'MARKET TRENDS',
        badgeColor: 'bg-purple-600'
    },
    {
        id: 3,
        title: 'Premium residences in Toronto: The pinnacle of luxury living',
        image: 'https://source.unsplash.com/800x600/?toronto,skyline',
        badge: 'MARKET TRENDS',
        badgeColor: 'bg-purple-600'
    },
    {
        id: 4,
        title: 'The most sought-after properties in North York and Scarborough',
        image: 'https://source.unsplash.com/800x600/?toronto,neighbourhood',
        badge: 'MARKET TRENDS',
        badgeColor: 'bg-purple-600'
    }
];

const neighborhoods = [
    {
        id: 1,
        name: 'Liberty Village',
        image: 'https://source.unsplash.com/800x600/?liberty-village,toronto',
        status: 'Ready'
    },
    {
        id: 2,
        name: 'Financial District',
        image: 'https://source.unsplash.com/800x600/?financial-district,toronto',
        status: 'Ready'
    },
    {
        id: 3,
        name: 'King West',
        image: 'https://source.unsplash.com/800x600/?king-west,toronto',
        status: 'Ready'
    },
    {
        id: 4,
        name: 'Entertainment District',
        image: 'https://source.unsplash.com/800x600/?entertainment-district,toronto',
        status: 'Ready'
    }
];

const topBuildings = [
    {
        id: 1,
        name: 'The One, Toronto Downtown',
        image: 'https://source.unsplash.com/800x600/?toronto,skyscraper',
        status: 'Ready',
        details: 'Luxury Living',
        price: 'Starting $800K'
    },
    {
        id: 2,
        name: 'Lakefront Tower, Harbourfront',
        image: 'https://source.unsplash.com/800x600/?harbourfront,toronto',
        status: 'Ready',
        details: 'Waterfront Views',
        price: 'Starting $650K'
    },
    {
        id: 3,
        name: 'Sky Tower, North York',
        image: 'https://source.unsplash.com/800x600/?north-york,toronto',
        status: 'Ready',
        details: 'Modern Living',
        price: 'Starting $500K'
    },
    {
        id: 4,
        name: 'Urban Heights, Mississauga',
        image: 'https://source.unsplash.com/800x600/?mississauga,condo',
        status: 'Ready',
        details: 'Family Friendly',
        price: 'Starting $450K'
    }
];

const CanadaMarketInsights = () => {
    const [activeCity, setActiveCity] = useState('toronto');

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Learn more about Canada&apos;s property market
                    </h2>

                    {/* City Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {cities.map((city) => (
                            <Button
                                key={city.id}
                                variant={activeCity === city.id ? "default" : "outline"}
                                className={`px-6 py-2 rounded-full ${activeCity === city.id
                                        ? 'bg-teal-500 text-white hover:bg-teal-600'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                onClick={() => setActiveCity(city.id)}
                            >
                                {city.name}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Market Trends Section */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600">Real Estate Updates From</span>
                            <span className="text-teal-600 font-bold text-lg">PropertyCA</span>
                        </div>
                        <Button variant="ghost" className="text-teal-600 hover:text-teal-700">
                            View All <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {marketTrends.map((trend) => (
                            <Card key={trend.id} className="group cursor-pointer hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                                <div className="relative">
                                    <div className="aspect-[4/3] relative overflow-hidden">
                                        <Image
                                            src={trend.image}
                                            alt={trend.title}
                                            fill
                                            unoptimized
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <Badge className={`absolute top-3 left-3 ${trend.badgeColor} text-white text-xs font-medium`}>
                                        {trend.badge}
                                    </Badge>
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-medium text-sm text-gray-900 line-clamp-3 group-hover:text-teal-600 transition-colors">
                                        {trend.title}
                                    </h3>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Popular Neighborhoods Section */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-gray-900">Discover Popular Neighbourhoods in Toronto</h3>
                            <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                                Off-Plan Only
                            </Badge>
                        </div>
                        <Button variant="ghost" className="text-teal-600 hover:text-teal-700">
                            View All <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {neighborhoods.map((neighborhood) => (
                            <Card key={neighborhood.id} className="group cursor-pointer hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                                <div className="relative">
                                    <div className="aspect-[4/3] relative overflow-hidden">
                                        <Image
                                            src={neighborhood.image}
                                            alt={neighborhood.name}
                                            fill
                                            unoptimized
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <Badge className="absolute top-3 left-3 bg-gray-800 text-white text-xs font-medium">
                                        {neighborhood.status}
                                    </Badge>
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-medium text-lg text-gray-900 group-hover:text-teal-600 transition-colors">
                                        {neighborhood.name}
                                    </h3>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Top Buildings Section */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-gray-900">Explore Top Buildings in Toronto</h3>
                            <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                                Off-Plan Only
                            </Badge>
                        </div>
                        <Button variant="ghost" className="text-teal-600 hover:text-teal-700">
                            View All <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topBuildings.map((building) => (
                            <Card key={building.id} className="group cursor-pointer hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                                <div className="relative">
                                    <div className="aspect-[4/3] relative overflow-hidden">
                                        <Image
                                            src={building.image}
                                            alt={building.name}
                                            fill
                                            unoptimized
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <Badge className="absolute top-3 left-3 bg-teal-600 text-white text-xs font-medium">
                                        {building.status}
                                    </Badge>
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-800">
                                        {building.details}
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-medium text-sm text-gray-900 group-hover:text-teal-600 transition-colors mb-2">
                                        {building.name}
                                    </h3>
                                    <p className="text-teal-600 font-semibold text-sm">
                                        {building.price}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CanadaMarketInsights;