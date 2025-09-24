'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Search,
    MapPin,
    ArrowLeft,
    Building,
    Home,
    TrendingUp,
    Users,
    Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FloorPlansPage() {
    const [searchLocation, setSearchLocation] = useState('');

    const canadianCities = [
        {
            id: 1,
            name: 'Toronto',
            province: 'Ontario',
            image: 'https://images.unsplash.com/photo-1517391815110-ca1ca1aeddb7?w=600&h=400&fit=crop',
            description: 'Canada\'s largest city with diverse floor plan options',
            properties: '45,000+ properties'
        },
        {
            id: 2,
            name: 'Vancouver',
            province: 'British Columbia',
            image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600&h=400&fit=crop',
            description: 'Coastal city with modern architectural designs',
            properties: '28,500+ properties'
        },
        {
            id: 3,
            name: 'Montreal',
            province: 'Quebec',
            image: 'https://images.unsplash.com/photo-1518687751798-0dcaac50a4a8?w=600&h=400&fit=crop',
            description: 'Historic charm meets contemporary living spaces',
            properties: '32,200+ properties'
        },
        {
            id: 4,
            name: 'Calgary',
            province: 'Alberta',
            image: 'https://images.unsplash.com/photo-1605538883669-825200433431?w=600&h=400&fit=crop',
            description: 'Prairie city with spacious floor plan layouts',
            properties: '18,700+ properties'
        },
        {
            id: 5,
            name: 'Ottawa',
            province: 'Ontario',
            image: 'https://images.unsplash.com/photo-1594736797933-d0bdb6695772?w=600&h=400&fit=crop',
            description: 'Canada\'s capital with government and residential zones',
            properties: '15,400+ properties'
        },
        {
            id: 6,
            name: 'Edmonton',
            province: 'Alberta',
            image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=400&fit=crop',
            description: 'Northern gateway with affordable housing options',
            properties: '12,800+ properties'
        },
        {
            id: 7,
            name: 'Halifax',
            province: 'Nova Scotia',
            image: 'https://images.unsplash.com/photo-1552832230-8b3734516ed0?w=600&h=400&fit=crop',
            description: 'Maritime city with waterfront floor plans',
            properties: '8,900+ properties'
        }
    ];

    const topSearchedLocations = {
        'Toronto': [
            'Downtown Toronto (CORE)', 'Yorkville', 'The Beaches',
            'Distillery District', 'King West', 'Liberty Village'
        ],
        'Vancouver': [
            'Coal Harbour', 'Yaletown', 'Kitsilano',
            'Gastown', 'West End', 'Olympic Village'
        ],
        'Montreal': [
            'Old Montreal', 'Plateau Mont-Royal', 'Mile End',
            'Griffintown', 'Westmount', 'Outremont'
        ],
        'Calgary': [
            'Beltline', 'Kensington', 'Hillhurst',
            'Mission', 'Eau Claire', 'Inglewood'
        ],
        'Ottawa': [
            'ByWard Market', 'Glebe', 'Westboro',
            'New Edinburgh', 'Hintonburg', 'Little Italy'
        ],
        'Edmonton': [
            'Oliver', 'Strathcona', 'Garneau',
            'Highlands', 'Bonnie Doon', 'Crestwood'
        ]
    };

    const allCanadianLocations = [
        // Ontario
        'Greater Toronto Area (GTA)', 'Ottawa-Gatineau', 'Hamilton', 'London', 'Kitchener-Waterloo',
        'Windsor', 'Oshawa', 'St. Catharines', 'Barrie', 'Kingston', 'Thunder Bay', 'Sudbury',
        'Guelph', 'Peterborough', 'Brantford', 'Chatham-Kent', 'Sarnia', 'North Bay', 'Cornwall',
        'Belleville', 'Timmins', 'Woodstock', 'Stratford', 'Orillia', 'Cobourg', 'Brockville',

        // Quebec
        'Montreal Metropolitan Area', 'Quebec City', 'Gatineau', 'Sherbrooke', 'Trois-Rivières',
        'Chicoutimi', 'Saint-Jean-sur-Richelieu', 'Laval', 'Longueuil', 'Granby', 'Drummondville',
        'Saint-Hyacinthe', 'Shawinigan', 'Joliette', 'Victoriaville', 'Rimouski', 'Saguenay',

        // British Columbia
        'Greater Vancouver Area', 'Victoria', 'Kelowna', 'Abbotsford', 'Kamloops', 'Nanaimo',
        'Prince George', 'Chilliwack', 'Vernon', 'Courtenay', 'Campbell River', 'Cranbrook',
        'Fort St. John', 'Penticton', 'Port Alberni', 'Quesnel', 'Williams Lake', 'Dawson Creek',

        // Alberta
        'Calgary Metropolitan Area', 'Edmonton Metropolitan Area', 'Red Deer', 'Lethbridge',
        'Medicine Hat', 'Grande Prairie', 'Airdrie', 'Spruce Grove', 'Okotoks', 'Cochrane',
        'Lloydminster', 'Camrose', 'Brooks', 'Cold Lake', 'Wetaskiwin', 'Leduc', 'Fort McMurray',

        // Saskatchewan
        'Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw', 'Swift Current', 'Yorkton',
        'North Battleford', 'Estevan', 'Weyburn', 'Lloydminster', 'Melfort', 'Humboldt',

        // Manitoba
        'Winnipeg Metropolitan Area', 'Brandon', 'Steinbach', 'Thompson', 'Portage la Prairie',
        'Winkler', 'Selkirk', 'Morden', 'Dauphin', 'The Pas', 'Flin Flon', 'Gimli',

        // Nova Scotia
        'Halifax Regional Municipality', 'Sydney', 'Truro', 'New Glasgow', 'Yarmouth',
        'Kentville', 'Amherst', 'Bridgewater', 'Antigonish', 'Wolfville', 'Liverpool',

        // New Brunswick
        'Moncton', 'Saint John', 'Fredericton', 'Bathurst', 'Miramichi', 'Campbellton',
        'Edmundston', 'Dieppe', 'Riverview', 'Quispamsis', 'Rothesay', 'Oromocto',

        // Newfoundland and Labrador
        'St. John\'s', 'Mount Pearl', 'Corner Brook', 'Conception Bay South', 'Paradise',
        'Grand Falls-Windsor', 'Happy Valley-Goose Bay', 'Labrador City', 'Stephenville',

        // Prince Edward Island
        'Charlottetown', 'Summerside', 'Stratford', 'Cornwall', 'Montague', 'Kensington',
        'Souris', 'Alberton', 'Georgetown', 'Tignish', 'O\'Leary', 'Borden-Carleton'
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg viewBox="0 0 1200 800" className="w-full h-full">
                        {/* Floor plan outlines */}
                        <g stroke="#059669" strokeWidth="2" fill="none">
                            <rect x="100" y="150" width="200" height="150" />
                            <rect x="150" y="180" width="50" height="40" />
                            <rect x="220" y="180" width="60" height="40" />
                            <rect x="120" y="240" width="40" height="40" />
                            <circle cx="180" cy="260" r="20" />

                            <rect x="400" y="200" width="180" height="120" />
                            <rect x="420" y="220" width="40" height="30" />
                            <rect x="480" y="220" width="40" height="30" />
                            <rect x="540" y="220" width="30" height="30" />

                            <rect x="700" y="180" width="150" height="100" />
                            <rect x="720" y="200" width="30" height="25" />
                            <rect x="760" y="200" width="30" height="25" />
                            <rect x="800" y="200" width="30" height="25" />

                            <rect x="900" y="350" width="200" height="130" />
                            <rect x="920" y="370" width="50" height="35" />
                            <rect x="980" y="370" width="50" height="35" />
                            <rect x="1040" y="370" width="40" height="35" />
                        </g>
                    </svg>
                </div>

                <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        {/* Breadcrumb */}
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-8">
                            <Link href="/" className="text-emerald-600 hover:underline">MapleNest</Link>
                            <span>›</span>
                            <span>Floor plans</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                            Floor plans
                        </h1>
                        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                            Explore detailed floor plans and layouts from Canada's premier real estate developments.
                            Find your perfect home design across major Canadian cities.
                        </p>

                        {/* Search Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-gray-800 rounded-2xl shadow-xl p-2 max-w-2xl mx-auto flex items-center"
                        >
                            <div className="flex-1 relative">
                                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                    placeholder="Enter location"
                                    className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg"
                                />
                            </div>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 font-semibold text-lg">
                                Find
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Canadian Cities Showcase */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <p className="text-emerald-600 font-medium mb-4">CANADIAN FLOOR PLANS</p>
                        <h2 className="text-3xl font-bold text-gray-900 mb-12">
                            Canada Floor plans
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {canadianCities.map((city, index) => (
                                <motion.div
                                    key={city.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={city.image}
                                            alt={`${city.name} real estate`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <h3 className="text-lg font-semibold">{city.name}</h3>
                                            <p className="text-sm opacity-90">{city.province}</p>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-gray-600 text-sm mb-2">{city.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-emerald-600 font-medium">{city.properties}</span>
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <Star className="h-4 w-4 fill-current" />
                                                <span className="text-xs text-gray-600">Premium</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Top Searched Locations */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {Object.entries(topSearchedLocations).map(([city, locations]) => (
                            <div key={city} className="mb-12">
                                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                                    Top Searched Locations - {city}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {locations.map((location, index) => (
                                        <motion.button
                                            key={location}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.6, delay: index * 0.1 }}
                                            className="bg-gray-100 hover:bg-emerald-50 hover:border-emerald-200 border border-gray-200 rounded-lg p-4 text-left transition-colors duration-300 group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-700 group-hover:text-emerald-700 font-medium">
                                                    {location}
                                                </span>
                                                <Building className="h-4 w-4 text-gray-400 group-hover:text-emerald-500" />
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Canadian Location List */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                            Canadian Location List
                        </h3>
                        <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
                            Discover floor plans and real estate opportunities across all major Canadian cities,
                            towns, and metropolitan areas. From coast to coast, explore diverse architectural
                            styles and layouts.
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                            {allCanadianLocations.map((location, index) => (
                                <motion.button
                                    key={location}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: (index % 20) * 0.05 }}
                                    className="bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded-lg p-3 text-left transition-all duration-300 group text-sm"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-700 group-hover:text-emerald-700 font-medium truncate pr-2">
                                            {location}
                                        </span>
                                        <Home className="h-3 w-3 text-gray-400 group-hover:text-emerald-500 flex-shrink-0" />
                                    </div>
                                </motion.button>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Button variant="outline" className="px-8 py-3">
                                Load More Locations
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats & CTA */}
            <section className="py-20 bg-emerald-600">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center text-white"
                    >
                        <h3 className="text-3xl font-bold mb-6">
                            Explore Canada's Real Estate Floor Plans
                        </h3>
                        <p className="text-xl text-emerald-100 mb-12 max-w-3xl mx-auto">
                            Access detailed floor plans from thousands of Canadian properties.
                            Make informed decisions with comprehensive layout information.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="text-center">
                                <div className="text-4xl font-bold mb-2">180,000+</div>
                                <div className="text-emerald-200">Floor Plans Available</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold mb-2">13</div>
                                <div className="text-emerald-200">Provinces & Territories</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold mb-2">500+</div>
                                <div className="text-emerald-200">Canadian Cities</div>
                            </div>
                        </div>

                        <Button className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-3 font-semibold">
                            Start Exploring Floor Plans
                        </Button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}