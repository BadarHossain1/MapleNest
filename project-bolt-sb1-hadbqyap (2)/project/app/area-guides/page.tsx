'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Canadian areas data
const readyAreas = [
    {
        id: 1,
        name: 'Downtown Toronto',
        status: 'Ready',
        image: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800&h=600&fit=crop',
        description: 'The heart of Canada\'s largest city with world-class amenities'
    },
    {
        id: 2,
        name: 'West Vancouver',
        status: 'Ready',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        description: 'Luxury living with stunning mountain and ocean views'
    },
    {
        id: 3,
        name: 'Beltline, Calgary',
        status: 'Ready',
        image: 'https://images.unsplash.com/photo-1605875793179-82d9839faca7?w=800&h=600&fit=crop',
        description: 'Calgary\'s trendy inner-city neighborhood'
    },
    {
        id: 4,
        name: 'Old Montreal',
        status: 'Ready',
        image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&h=600&fit=crop',
        description: 'Historic charm meets modern urban living'
    }
];

const developingAreas = [
    {
        id: 5,
        name: 'The Distillery District',
        status: 'Developing',
        image: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&h=600&fit=crop',
        description: 'Toronto\'s historic arts and culture district'
    },
    {
        id: 6,
        name: 'River District, Vancouver',
        status: 'Developing',
        image: 'https://images.unsplash.com/photo-1441906363162-903afd0d3d52?w=800&h=600&fit=crop',
        description: 'New waterfront community development'
    },
    {
        id: 7,
        name: 'East Village, Calgary',
        status: 'Developing',
        image: 'https://images.unsplash.com/photo-1416838375725-e834a83f62b7?w=800&h=600&fit=crop',
        description: 'Calgary\'s newest urban neighborhood'
    },
    {
        id: 8,
        name: 'Griffintown, Montreal',
        status: 'Developing',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
        description: 'Montreal\'s rapidly growing tech hub'
    }
];

export default function AreaGuidesPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section
                className="relative h-96 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=1920&h=800&fit=crop)'
                }}
            >
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
                    <motion.div
                        className="text-center text-white"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl font-bold mb-4">Discover Canada!</h1>
                        <p className="text-xl mb-8">Explore the best neighborhoods across the country</p>
                        <div className="flex justify-center">
                            <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-lg max-w-md w-full">
                                <input
                                    type="text"
                                    placeholder="Search location"
                                    className="flex-1 px-6 py-4 text-gray-900 focus:outline-none"
                                />
                                <Button className="rounded-none px-8 py-4 bg-emerald-500 hover:bg-emerald-600">
                                    SEARCH
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Ready Areas Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-12">Ready</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                            {readyAreas.map((area, index) => (
                                <motion.div
                                    key={area.id}
                                    className="group cursor-pointer"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="relative overflow-hidden rounded-lg shadow-lg">
                                        <div
                                            className="h-64 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                                            style={{ backgroundImage: `url(${area.image})` }}
                                        >
                                            <div className="absolute inset-0 bg-black/30" />
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                    {area.status}
                                                </span>
                                            </div>
                                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                                <h3 className="font-semibold text-lg mb-1">{area.name}</h3>
                                                <p className="text-sm opacity-90">{area.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center">
                            <Button variant="outline" className="group">
                                VIEW ALL READY AREA GUIDES IN CANADA
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Developing Areas Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-12">Developing</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                            {developingAreas.map((area, index) => (
                                <motion.div
                                    key={area.id}
                                    className="group cursor-pointer"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="relative overflow-hidden rounded-lg shadow-lg">
                                        <div
                                            className="h-64 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                                            style={{ backgroundImage: `url(${area.image})` }}
                                        >
                                            <div className="absolute inset-0 bg-black/30" />
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                    {area.status}
                                                </span>
                                            </div>
                                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                                <h3 className="font-semibold text-lg mb-1">{area.name}</h3>
                                                <p className="text-sm opacity-90">{area.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center">
                            <Button variant="outline" className="group">
                                VIEW ALL DEVELOPING AREA GUIDES IN CANADA
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Additional Ready Areas by Province */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-12">Ready Areas by Province</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                            {[
                                {
                                    name: 'Kensington Market, Toronto',
                                    province: 'Ontario',
                                    image: 'https://images.unsplash.com/photo-1528702748617-c64d49f918af?w=800&h=600&fit=crop'
                                },
                                {
                                    name: 'Yaletown, Vancouver',
                                    province: 'British Columbia',
                                    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
                                },
                                {
                                    name: 'Plateau-Mont-Royal, Montreal',
                                    province: 'Quebec',
                                    image: 'https://images.unsplash.com/photo-1541704328070-0018615eb969?w=800&h=600&fit=crop'
                                },
                                {
                                    name: 'Kensington, Calgary',
                                    province: 'Alberta',
                                    image: 'https://images.unsplash.com/photo-1605875793179-82d9839faca7?w=800&h=600&fit=crop'
                                }
                            ].map((area, index) => (
                                <motion.div
                                    key={area.name}
                                    className="group cursor-pointer"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="relative overflow-hidden rounded-lg shadow-lg">
                                        <div
                                            className="h-64 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                                            style={{ backgroundImage: `url(${area.image})` }}
                                        >
                                            <div className="absolute inset-0 bg-black/30" />
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                    Ready
                                                </span>
                                            </div>
                                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                                <h3 className="font-semibold text-lg mb-1">{area.name}</h3>
                                                <p className="text-sm opacity-90">{area.province}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center">
                            <Button variant="outline" className="group">
                                VIEW ALL READY AREA GUIDES BY PROVINCE
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Developing Areas by Province */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.9 }}
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-12">Developing Areas by Province</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                            {[
                                {
                                    name: 'Port Lands, Toronto',
                                    province: 'Ontario',
                                    image: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&h=600&fit=crop'
                                },
                                {
                                    name: 'Olympic Village, Vancouver',
                                    province: 'British Columbia',
                                    image: 'https://images.unsplash.com/photo-1441906363162-903afd0d3d52?w=800&h=600&fit=crop'
                                },
                                {
                                    name: 'Quartier des Spectacles, Montreal',
                                    province: 'Quebec',
                                    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'
                                },
                                {
                                    name: 'Victoria Park, Calgary',
                                    province: 'Alberta',
                                    image: 'https://images.unsplash.com/photo-1416838375725-e834a83f62b7?w=800&h=600&fit=crop'
                                }
                            ].map((area, index) => (
                                <motion.div
                                    key={area.name}
                                    className="group cursor-pointer"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="relative overflow-hidden rounded-lg shadow-lg">
                                        <div
                                            className="h-64 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                                            style={{ backgroundImage: `url(${area.image})` }}
                                        >
                                            <div className="absolute inset-0 bg-black/30" />
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                    Developing
                                                </span>
                                            </div>
                                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                                <h3 className="font-semibold text-lg mb-1">{area.name}</h3>
                                                <p className="text-sm opacity-90">{area.province}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center">
                            <Button variant="outline" className="group">
                                VIEW ALL DEVELOPING AREA GUIDES BY PROVINCE
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}