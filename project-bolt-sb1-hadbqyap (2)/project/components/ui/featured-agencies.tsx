'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Canadian Real Estate Agencies Data
const featuredAgencies = [
    {
        id: 1,
        name: 'Royal LePage',
        logo: 'RL',
        color: 'bg-blue-600',
        propertiesForSale: 2847,
        propertiesForRent: 1256,
        description: 'Canada\'s leading real estate network'
    },
    {
        id: 2,
        name: 'RE/MAX Canada',
        logo: 'RE/MAX',
        color: 'bg-red-600',
        propertiesForSale: 3521,
        propertiesForRent: 892,
        description: 'Premium properties across Canada'
    },
    {
        id: 3,
        name: 'Century 21 Canada',
        logo: 'C21',
        color: 'bg-yellow-600',
        propertiesForSale: 1967,
        propertiesForRent: 743,
        description: 'Your neighborhood experts'
    },
    {
        id: 4,
        name: 'Coldwell Banker',
        logo: 'CB',
        color: 'bg-blue-800',
        propertiesForSale: 2134,
        propertiesForRent: 567,
        description: 'Luxury and residential properties'
    },
    {
        id: 5,
        name: 'Sutton Group',
        logo: 'SG',
        color: 'bg-green-700',
        propertiesForSale: 1589,
        propertiesForRent: 834,
        description: 'Personalized real estate service'
    },
    {
        id: 6,
        name: 'Keller Williams',
        logo: 'KW',
        color: 'bg-red-700',
        propertiesForSale: 2756,
        propertiesForRent: 1123,
        description: 'Technology-driven real estate'
    },
    {
        id: 7,
        name: 'eXp Realty',
        logo: 'eXp',
        color: 'bg-purple-600',
        propertiesForSale: 1876,
        propertiesForRent: 654,
        description: 'Cloud-based real estate platform'
    },
    {
        id: 8,
        name: 'Chestnut Park',
        logo: 'CP',
        color: 'bg-amber-700',
        propertiesForSale: 987,
        propertiesForRent: 423,
        description: 'Toronto\'s premier luxury agency'
    },
    {
        id: 9,
        name: 'Engel & Völkers',
        logo: 'E&V',
        color: 'bg-slate-800',
        propertiesForSale: 756,
        propertiesForRent: 289,
        description: 'International luxury real estate'
    },
    {
        id: 10,
        name: 'Sotheby\'s Realty',
        logo: 'SIR',
        color: 'bg-indigo-700',
        propertiesForSale: 634,
        propertiesForRent: 198,
        description: 'Exceptional properties worldwide'
    }
];

export function FeaturedAgencies() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % (featuredAgencies.length - 2));
        }, 3000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % (featuredAgencies.length - 2));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + (featuredAgencies.length - 2)) % (featuredAgencies.length - 2));
    };

    const visibleAgencies = featuredAgencies.slice(currentIndex, currentIndex + 3);

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Featured Agencies
                    </h2>
                </motion.div>

                {/* Marquee Container */}
                <div
                    className="relative bg-white rounded-xl shadow-sm py-12 px-8 overflow-hidden"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
                    >
                        <ChevronLeft className="h-6 w-6 text-gray-600" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
                    >
                        <ChevronRight className="h-6 w-6 text-gray-600" />
                    </button>

                    {/* Agencies Display */}
                    <motion.div
                        className="flex items-center justify-center gap-16"
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {visibleAgencies.map((agency, index) => (
                            <motion.div
                                key={agency.id}
                                className="flex flex-col items-center min-w-0"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                {/* Agency Logo */}
                                <div className={`w-20 h-20 ${agency.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                                    <span className="text-white font-bold text-sm text-center leading-tight">
                                        {agency.logo}
                                    </span>
                                </div>

                                {/* Agency Name */}
                                <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                                    {agency.name}
                                </h3>

                                {/* Properties Count */}
                                <div className="flex items-center gap-6 text-sm text-gray-600 mb-2">
                                    <div className="text-center">
                                        <div className="font-semibold text-gray-900">
                                            {agency.propertiesForSale.toLocaleString()}
                                        </div>
                                        <div>Properties for Sale</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-semibold text-gray-900">
                                            {agency.propertiesForRent.toLocaleString()}
                                        </div>
                                        <div>Properties to Rent</div>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-xs text-gray-500 text-center max-w-48">
                                    {agency.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Marquee Background Animation */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <motion.div
                            className="flex items-center gap-8 opacity-5"
                            animate={{ x: [-100, -50, 0, 50, 100] }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "linear"
                            }}
                        >
                            {featuredAgencies.concat(featuredAgencies).map((agency, index) => (
                                <div
                                    key={`bg-${index}`}
                                    className={`w-16 h-16 ${agency.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                                >
                                    <span className="text-white font-bold text-xs">
                                        {agency.logo}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Progress Indicators */}
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: featuredAgencies.length - 2 }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Floating Agency Names Marquee */}
                <div className="mt-8 overflow-hidden">
                    <motion.div
                        className="flex items-center gap-12 text-gray-400 text-sm whitespace-nowrap"
                        animate={{ x: [0, -100] }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        {featuredAgencies.concat(featuredAgencies, featuredAgencies).map((agency, index) => (
                            <span key={`marquee-${index}`} className="flex-shrink-0">
                                {agency.name}
                            </span>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}