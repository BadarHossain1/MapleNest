'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Dummy Canadian new project data
const newProjectsData = {
    Toronto: [
        {
            id: 'skyview-condos-toronto',
            name: 'SkyView Condos',
            type: 'Apartments',
            location: 'SkyView Condos, Downtown, Toronto, ON',
            launchPrice: 'CAD 650K',
            handover: 'Q4 2025',
            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'liberty-towers-toronto',
            name: 'Liberty Towers',
            type: 'Condominiums',
            location: 'Liberty Village, Toronto, ON',
            launchPrice: 'CAD 750K',
            handover: 'Q2 2026',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'harbourfront-residences-toronto',
            name: 'Harbourfront Residences',
            type: 'Luxury Condos',
            location: 'Harbourfront, Toronto, ON',
            launchPrice: 'CAD 900K',
            handover: 'Q1 2027',
            image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'yorkville-heights-toronto',
            name: 'Yorkville Heights',
            type: 'Penthouses',
            location: 'Yorkville, Toronto, ON',
            launchPrice: 'CAD 1.2M',
            handover: 'Q3 2026',
            image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        }
    ],
    Vancouver: [
        {
            id: 'pacific-view-vancouver',
            name: 'Pacific View',
            type: 'Waterfront Condos',
            location: 'Coal Harbour, Vancouver, BC',
            launchPrice: 'CAD 850K',
            handover: 'Q3 2025',
            image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'mountain-ridge-vancouver',
            name: 'Mountain Ridge',
            type: 'Townhouses',
            location: 'North Vancouver, BC',
            launchPrice: 'CAD 1.1M',
            handover: 'Q1 2026',
            image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'olympic-village-vancouver',
            name: 'Olympic Village Lofts',
            type: 'Lofts',
            location: 'Olympic Village, Vancouver, BC',
            launchPrice: 'CAD 720K',
            handover: 'Q4 2026',
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'west-end-towers-vancouver',
            name: 'West End Towers',
            type: 'High-rise Condos',
            location: 'West End, Vancouver, BC',
            launchPrice: 'CAD 950K',
            handover: 'Q2 2027',
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        }
    ],
    Montreal: [
        {
            id: 'plateau-lofts-montreal',
            name: 'Plateau Lofts',
            type: 'Urban Lofts',
            location: 'Plateau-Mont-Royal, Montreal, QC',
            launchPrice: 'CAD 450K',
            handover: 'Q3 2025',
            image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'old-port-condos-montreal',
            name: 'Old Port Condos',
            type: 'Heritage Condos',
            location: 'Old Port, Montreal, QC',
            launchPrice: 'CAD 550K',
            handover: 'Q1 2026',
            image: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'downtown-suites-montreal',
            name: 'Downtown Suites',
            type: 'Studio & 1BR',
            location: 'Downtown, Montreal, QC',
            launchPrice: 'CAD 380K',
            handover: 'Q4 2025',
            image: 'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'griffintown-towers-montreal',
            name: 'Griffintown Towers',
            type: 'Modern Condos',
            location: 'Griffintown, Montreal, QC',
            launchPrice: 'CAD 520K',
            handover: 'Q2 2026',
            image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        }
    ],
    Calgary: [
        {
            id: 'bow-river-residences-calgary',
            name: 'Bow River Residences',
            type: 'Riverside Condos',
            location: 'Bow River, Calgary, AB',
            launchPrice: 'CAD 420K',
            handover: 'Q3 2025',
            image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'downtown-core-calgary',
            name: 'Downtown Core',
            type: 'Office Condos',
            location: 'Downtown, Calgary, AB',
            launchPrice: 'CAD 380K',
            handover: 'Q1 2026',
            image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'kensington-heights-calgary',
            name: 'Kensington Heights',
            type: 'Family Condos',
            location: 'Kensington, Calgary, AB',
            launchPrice: 'CAD 480K',
            handover: 'Q4 2026',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'mission-district-calgary',
            name: 'Mission District',
            type: 'Urban Living',
            location: 'Mission, Calgary, AB',
            launchPrice: 'CAD 350K',
            handover: 'Q2 2027',
            image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        }
    ],
    Ottawa: [
        {
            id: 'byward-market-condos-ottawa',
            name: 'ByWard Market Condos',
            type: 'Historic Lofts',
            location: 'ByWard Market, Ottawa, ON',
            launchPrice: 'CAD 420K',
            handover: 'Q4 2025',
            image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'rideau-centre-ottawa',
            name: 'Rideau Centre Living',
            type: 'Mixed-use',
            location: 'Rideau Centre, Ottawa, ON',
            launchPrice: 'CAD 450K',
            handover: 'Q2 2026',
            image: 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'westboro-village-ottawa',
            name: 'Westboro Village',
            type: 'Community Living',
            location: 'Westboro, Ottawa, ON',
            launchPrice: 'CAD 380K',
            handover: 'Q1 2027',
            image: 'https://images.unsplash.com/photo-1600607688960-e095d9c3c0e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        }
    ],
    Halifax: [
        {
            id: 'waterfront-district-halifax',
            name: 'Waterfront District',
            type: 'Coastal Condos',
            location: 'Halifax Waterfront, NS',
            launchPrice: 'CAD 320K',
            handover: 'Q3 2025',
            image: 'https://images.unsplash.com/photo-1600607688618-94e3e39e2adf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'downtown-halifax-towers',
            name: 'Downtown Halifax Towers',
            type: 'Urban Condos',
            location: 'Downtown, Halifax, NS',
            launchPrice: 'CAD 280K',
            handover: 'Q1 2026',
            image: 'https://images.unsplash.com/photo-1600607688822-6b5c0a7b9d16?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        }
    ]
};

const cities = ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Halifax'];

interface PropertySliderProps {
    projects: any[];
    city: string;
}

function PropertySlider({ projects, city }: PropertySliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerView = 3;
    const maxIndex = Math.max(0, projects.length - itemsPerView);

    const nextSlide = () => {
        setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
    };

    const prevSlide = () => {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
    };

    return (
        <div className="relative">
            <div className="overflow-hidden">
                <motion.div
                    className="flex gap-6"
                    animate={{ x: `-${currentIndex * (100 / itemsPerView)}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{ width: `${(projects.length / itemsPerView) * 100}%` }}
                >
                    {projects.map((project) => (
                        <div key={project.id} className="flex-shrink-0" style={{ width: `${100 / projects.length}%` }}>
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                                <div className="relative h-48">
                                    <img
                                        src={project.image}
                                        alt={project.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{project.type}</p>
                                    <div className="flex items-start gap-1 text-sm text-gray-600 mb-4">
                                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                        <span className="line-clamp-2">{project.location}</span>
                                    </div>

                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Launch Price</p>
                                            <p className="text-lg font-bold text-green-600">{project.launchPrice}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">Handover</p>
                                            <p className="text-sm font-medium text-gray-900">{project.handover}</p>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                                        variant="outline"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.513" />
                                        </svg>
                                        WhatsApp
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Navigation buttons */}
            {projects.length > itemsPerView && (
                <>
                    <button
                        onClick={prevSlide}
                        disabled={currentIndex === 0}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <button
                        onClick={nextSlide}
                        disabled={currentIndex >= maxIndex}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
                </>
            )}
        </div>
    );
}

export function NewProjectsSection() {
    const [activeCity, setActiveCity] = useState('Toronto');

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Browse New Projects in Canada
                    </h2>
                </motion.div>

                {/* City Tabs */}
                <motion.div
                    className="flex flex-wrap justify-center gap-2 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {cities.map((city) => (
                        <button
                            key={city}
                            onClick={() => setActiveCity(city)}
                            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${activeCity === city
                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
                                }`}
                        >
                            {city}
                        </button>
                    ))}
                </motion.div>

                {/* Property Slider */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mb-12"
                >
                    <PropertySlider
                        projects={newProjectsData[activeCity] || []}
                        city={activeCity}
                    />
                </motion.div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-center"
                >
                    <Link href="/new-projects/all">
                        <Button
                            variant="outline"
                            size="lg"
                            className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200 px-8"
                        >
                            View all new projects in {activeCity}
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}