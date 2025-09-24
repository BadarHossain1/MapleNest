'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, GraduationCap, Award, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Canadian top-rated schools data
const topRatedSchools = [
    {
        id: 1,
        name: 'University of Toronto Schools',
        location: 'Toronto, ON',
        type: 'Public',
        rating: 9.8,
        students: 350,
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=800&h=600&fit=crop',
        description: 'Laboratory school affiliated with University of Toronto'
    },
    {
        id: 2,
        name: 'York House School',
        location: 'Vancouver, BC',
        type: 'Private',
        rating: 9.7,
        students: 640,
        image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop',
        description: 'Independent day school for girls from Junior Kindergarten to Grade 12'
    },
    {
        id: 3,
        name: 'Western Canada High School',
        location: 'Calgary, AB',
        type: 'Public',
        rating: 9.5,
        students: 2100,
        image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&h=600&fit=crop',
        description: 'Renowned public high school with excellent academic programs'
    },
    {
        id: 4,
        name: 'Collège Jean-de-Brébeuf',
        location: 'Montreal, QC',
        type: 'Private',
        rating: 9.6,
        students: 2800,
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=800&h=600&fit=crop',
        description: 'Prestigious French-language college and high school'
    }
];

const specialPrograms = [
    {
        id: 5,
        name: 'Earl Haig Secondary School',
        location: 'Toronto, ON',
        type: 'Arts Focus',
        rating: 9.2,
        students: 1200,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
        description: 'Home to Claude Watson Arts Program'
    },
    {
        id: 6,
        name: 'Sir Winston Churchill Secondary',
        location: 'Vancouver, BC',
        type: 'IB Program',
        rating: 9.1,
        students: 1800,
        image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop',
        description: 'International Baccalaureate World School'
    },
    {
        id: 7,
        name: 'Old Scona Academic',
        location: 'Edmonton, AB',
        type: 'Academic',
        rating: 9.4,
        students: 1500,
        image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&h=600&fit=crop',
        description: 'High-achieving academic alternative program'
    },
    {
        id: 8,
        name: 'École internationale de Montréal',
        location: 'Montreal, QC',
        type: 'International',
        rating: 9.3,
        students: 600,
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=800&h=600&fit=crop',
        description: 'International Baccalaureate programme in French'
    }
];

const elementarySchools = [
    {
        id: 9,
        name: 'Rosedale Public School',
        location: 'Toronto, ON',
        type: 'Elementary',
        rating: 9.0,
        students: 420,
        image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop',
        description: 'Top-rated elementary school in prestigious neighborhood'
    },
    {
        id: 10,
        name: 'Trafalgar Elementary',
        location: 'Vancouver, BC',
        type: 'Elementary',
        rating: 8.9,
        students: 350,
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
        description: 'French Immersion and regular English programs'
    },
    {
        id: 11,
        name: 'Colonel Walker Elementary',
        location: 'Calgary, AB',
        type: 'Elementary',
        rating: 8.8,
        students: 480,
        image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop',
        description: 'Community school with strong parent involvement'
    },
    {
        id: 12,
        name: 'École primaire Saint-Enfant-Jésus',
        location: 'Montreal, QC',
        type: 'Elementary',
        rating: 8.7,
        students: 380,
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
        description: 'French-language elementary school with enriched programs'
    }
];

export default function SchoolGuidesPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section
                className="relative h-96 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=1920&h=800&fit=crop)'
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
                        <h1 className="text-5xl font-bold mb-4">Find the Best Schools!</h1>
                        <p className="text-xl mb-8">Discover Canada&apos;s top educational institutions for your family</p>
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

            {/* Top Rated Schools Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-12">Top Rated</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                            {topRatedSchools.map((school, index) => (
                                <motion.div
                                    key={school.id}
                                    className="group cursor-pointer"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="relative overflow-hidden rounded-lg shadow-lg bg-emerald-600">
                                        <div
                                            className="h-64 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                                            style={{ backgroundImage: `url(${school.image})` }}
                                        >
                                            <div className="absolute inset-0 bg-black/30" />
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                                    <Award className="h-3 w-3" />
                                                    {school.rating}/10
                                                </span>
                                            </div>
                                            <div className="absolute top-4 right-4 text-white text-right">
                                                <div className="text-sm font-semibold">{school.type}</div>
                                                <div className="text-xs opacity-90 flex items-center gap-1">
                                                    <Users className="h-3 w-3" />
                                                    {school.students}
                                                </div>
                                            </div>
                                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                                <h3 className="font-semibold text-lg mb-1">{school.name}</h3>
                                                <div className="flex items-center gap-1 text-sm opacity-90 mb-2">
                                                    <MapPin className="h-3 w-3" />
                                                    {school.location}
                                                </div>
                                                <p className="text-xs opacity-90">{school.description}</p>
                                            </div>
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                                                    Top Rated
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center">
                            <Button variant="outline" className="group">
                                VIEW ALL TOP RATED SCHOOLS IN CANADA
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Special Programs Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-12">Special Programs</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                            {specialPrograms.map((school, index) => (
                                <motion.div
                                    key={school.id}
                                    className="group cursor-pointer"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="relative overflow-hidden rounded-lg shadow-lg bg-emerald-600">
                                        <div
                                            className="h-64 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                                            style={{ backgroundImage: `url(${school.image})` }}
                                        >
                                            <div className="absolute inset-0 bg-black/30" />
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                                    <GraduationCap className="h-3 w-3" />
                                                    {school.rating}/10
                                                </span>
                                            </div>
                                            <div className="absolute top-4 right-4 text-white text-right">
                                                <div className="text-sm font-semibold">{school.type}</div>
                                                <div className="text-xs opacity-90 flex items-center gap-1">
                                                    <Users className="h-3 w-3" />
                                                    {school.students}
                                                </div>
                                            </div>
                                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                                <h3 className="font-semibold text-lg mb-1">{school.name}</h3>
                                                <div className="flex items-center gap-1 text-sm opacity-90 mb-2">
                                                    <MapPin className="h-3 w-3" />
                                                    {school.location}
                                                </div>
                                                <p className="text-xs opacity-90">{school.description}</p>
                                            </div>
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-medium">
                                                    Special Program
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center">
                            <Button variant="outline" className="group">
                                VIEW ALL SPECIAL PROGRAM SCHOOLS IN CANADA
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Elementary Schools Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-12">Elementary Schools</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                            {elementarySchools.map((school, index) => (
                                <motion.div
                                    key={school.id}
                                    className="group cursor-pointer"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="relative overflow-hidden rounded-lg shadow-lg bg-emerald-600">
                                        <div
                                            className="h-64 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                                            style={{ backgroundImage: `url(${school.image})` }}
                                        >
                                            <div className="absolute inset-0 bg-black/30" />
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                                    <GraduationCap className="h-3 w-3" />
                                                    {school.rating}/10
                                                </span>
                                            </div>
                                            <div className="absolute top-4 right-4 text-white text-right">
                                                <div className="text-sm font-semibold">{school.type}</div>
                                                <div className="text-xs opacity-90 flex items-center gap-1">
                                                    <Users className="h-3 w-3" />
                                                    {school.students}
                                                </div>
                                            </div>
                                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                                <h3 className="font-semibold text-lg mb-1">{school.name}</h3>
                                                <div className="flex items-center gap-1 text-sm opacity-90 mb-2">
                                                    <MapPin className="h-3 w-3" />
                                                    {school.location}
                                                </div>
                                                <p className="text-xs opacity-90">{school.description}</p>
                                            </div>
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-emerald-500 text-white px-2 py-1 rounded text-xs font-medium">
                                                    Elementary
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center">
                            <Button variant="outline" className="group">
                                VIEW ALL ELEMENTARY SCHOOLS IN CANADA
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}