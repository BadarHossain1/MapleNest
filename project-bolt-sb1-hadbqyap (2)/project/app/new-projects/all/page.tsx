'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Filter, SortAsc } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Extended dummy data for all Canadian cities
const allNewProjects = [
    // Toronto Projects
    {
        id: 'skyview-condos-toronto',
        name: 'SkyView Condos',
        type: 'Apartments',
        city: 'Toronto',
        province: 'ON',
        location: 'SkyView Condos, Downtown, Toronto, ON',
        launchPrice: 650000,
        handover: 'Q4 2025',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        beds: 2,
        baths: 2,
        sqft: 950,
        description: 'Modern condos in the heart of downtown Toronto with stunning city views.'
    },
    {
        id: 'liberty-towers-toronto',
        name: 'Liberty Towers',
        type: 'Condominiums',
        city: 'Toronto',
        province: 'ON',
        location: 'Liberty Village, Toronto, ON',
        launchPrice: 750000,
        handover: 'Q2 2026',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        beds: 3,
        baths: 2,
        sqft: 1200,
        description: 'Luxury condominiums in trendy Liberty Village with premium amenities.'
    },
    {
        id: 'harbourfront-residences-toronto',
        name: 'Harbourfront Residences',
        type: 'Luxury Condos',
        city: 'Toronto',
        province: 'ON',
        location: 'Harbourfront, Toronto, ON',
        launchPrice: 900000,
        handover: 'Q1 2027',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        beds: 2,
        baths: 3,
        sqft: 1100,
        description: 'Waterfront luxury living with panoramic lake views and world-class amenities.'
    },
    // Vancouver Projects
    {
        id: 'pacific-view-vancouver',
        name: 'Pacific View',
        type: 'Waterfront Condos',
        city: 'Vancouver',
        province: 'BC',
        location: 'Coal Harbour, Vancouver, BC',
        launchPrice: 850000,
        handover: 'Q3 2025',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        beds: 2,
        baths: 2,
        sqft: 1000,
        description: 'Prime waterfront condos with mountain and ocean views in Coal Harbour.'
    },
    {
        id: 'mountain-ridge-vancouver',
        name: 'Mountain Ridge',
        type: 'Townhouses',
        city: 'Vancouver',
        province: 'BC',
        location: 'North Vancouver, BC',
        launchPrice: 1100000,
        handover: 'Q1 2026',
        image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        beds: 4,
        baths: 3,
        sqft: 1800,
        description: 'Spacious family townhouses with mountain views and private gardens.'
    },
    // Montreal Projects
    {
        id: 'plateau-lofts-montreal',
        name: 'Plateau Lofts',
        type: 'Urban Lofts',
        city: 'Montreal',
        province: 'QC',
        location: 'Plateau-Mont-Royal, Montreal, QC',
        launchPrice: 450000,
        handover: 'Q3 2025',
        image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        beds: 2,
        baths: 1,
        sqft: 900,
        description: 'Trendy lofts in the vibrant Plateau neighborhood with artistic charm.'
    },
    {
        id: 'old-port-condos-montreal',
        name: 'Old Port Condos',
        type: 'Heritage Condos',
        city: 'Montreal',
        province: 'QC',
        location: 'Old Port, Montreal, QC',
        launchPrice: 550000,
        handover: 'Q1 2026',
        image: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        beds: 1,
        baths: 1,
        sqft: 750,
        description: 'Historic charm meets modern luxury in Old Montreal\'s cobblestone streets.'
    },
    // Calgary Projects
    {
        id: 'bow-river-residences-calgary',
        name: 'Bow River Residences',
        type: 'Riverside Condos',
        city: 'Calgary',
        province: 'AB',
        location: 'Bow River, Calgary, AB',
        launchPrice: 420000,
        handover: 'Q3 2025',
        image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        beds: 2,
        baths: 2,
        sqft: 1050,
        description: 'Riverside living with stunning Bow River views and walking trails.'
    },
    {
        id: 'downtown-core-calgary',
        name: 'Downtown Core',
        type: 'Office Condos',
        city: 'Calgary',
        province: 'AB',
        location: 'Downtown, Calgary, AB',
        launchPrice: 380000,
        handover: 'Q1 2026',
        image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        beds: 1,
        baths: 1,
        sqft: 650,
        description: 'Urban living in the heart of Calgary\'s business district.'
    },
    // Ottawa Projects
    {
        id: 'byward-market-condos-ottawa',
        name: 'ByWard Market Condos',
        type: 'Historic Lofts',
        city: 'Ottawa',
        province: 'ON',
        location: 'ByWard Market, Ottawa, ON',
        launchPrice: 420000,
        handover: 'Q4 2025',
        image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        beds: 2,
        baths: 1,
        sqft: 850,
        description: 'Historic lofts in Ottawa\'s iconic ByWard Market district.'
    },
    {
        id: 'rideau-centre-ottawa',
        name: 'Rideau Centre Living',
        type: 'Mixed-use',
        city: 'Ottawa',
        province: 'ON',
        location: 'Rideau Centre, Ottawa, ON',
        launchPrice: 450000,
        handover: 'Q2 2026',
        image: 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        beds: 1,
        baths: 1,
        sqft: 700,
        description: 'Modern mixed-use development in the heart of downtown Ottawa.'
    },
    // Halifax Projects
    {
        id: 'waterfront-district-halifax',
        name: 'Waterfront District',
        type: 'Coastal Condos',
        city: 'Halifax',
        province: 'NS',
        location: 'Halifax Waterfront, NS',
        launchPrice: 320000,
        handover: 'Q3 2025',
        image: 'https://images.unsplash.com/photo-1600607688618-94e3e39e2adf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        beds: 2,
        baths: 1,
        sqft: 800,
        description: 'Coastal living with stunning harbor views and maritime charm.'
    },
    {
        id: 'downtown-halifax-towers',
        name: 'Downtown Halifax Towers',
        type: 'Urban Condos',
        city: 'Halifax',
        province: 'NS',
        location: 'Downtown, Halifax, NS',
        launchPrice: 280000,
        handover: 'Q1 2026',
        image: 'https://images.unsplash.com/photo-1600607688822-6b5c0a7b9d16?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        beds: 1,
        baths: 1,
        sqft: 600,
        description: 'Affordable urban living in Halifax\'s growing downtown core.'
    }
];

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

const formatSquareFeet = (sqft: number) => {
    return new Intl.NumberFormat('en-CA').format(sqft) + ' sq ft';
};

export default function AllNewProjectsPage() {
    const [filteredProjects, setFilteredProjects] = useState(allNewProjects);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [sortBy, setSortBy] = useState('name');

    const cities = [...new Set(allNewProjects.map(p => p.city))];
    const types = [...new Set(allNewProjects.map(p => p.type))];

    useEffect(() => {
        let filtered = allNewProjects;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(project =>
                project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.type.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by city
        if (selectedCity) {
            filtered = filtered.filter(project => project.city === selectedCity);
        }

        // Filter by type
        if (selectedType) {
            filtered = filtered.filter(project => project.type === selectedType);
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.launchPrice - b.launchPrice;
                case 'price-high':
                    return b.launchPrice - a.launchPrice;
                case 'name':
                default:
                    return a.name.localeCompare(b.name);
            }
        });

        setFilteredProjects(filtered);
    }, [searchTerm, selectedCity, selectedType, sortBy]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-4 mb-6">
                        <Link
                            href="/new-projects"
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span>Back to New Projects</span>
                        </Link>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                All New Projects in Canada
                            </h1>
                            <p className="text-gray-600">
                                {filteredProjects.length} projects found across Canadian cities
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
                        <div className="flex-1">
                            <Input
                                type="text"
                                placeholder="Search projects, locations, or types..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        <div className="flex gap-4">
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">All Cities</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>

                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">All Types</option>
                                {types.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="relative h-48">
                                <img
                                    src={project.image}
                                    alt={project.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium">
                                        {project.type}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.name}</h3>
                                <div className="flex items-start gap-1 text-sm text-gray-600 mb-4">
                                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <span>{project.location}</span>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {project.description}
                                </p>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span>{project.beds} beds</span>
                                        <span>{project.baths} baths</span>
                                        <span>{formatSquareFeet(project.sqft)}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Starting from</p>
                                        <p className="text-xl font-bold text-green-600">
                                            {formatPrice(project.launchPrice)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Handover</p>
                                        <p className="text-sm font-medium text-gray-900">{project.handover}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Link href={`/new-projects/${project.id}`} className="flex-1">
                                        <Button variant="outline" className="w-full">
                                            View Details
                                        </Button>
                                    </Link>
                                    <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.513" />
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {filteredProjects.length === 0 && (
                    <div className="text-center py-12">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Filter className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Found</h3>
                            <p className="text-gray-600">
                                Try adjusting your filters or search terms to find more projects.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}