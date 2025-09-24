'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Share2, MapPin, Calendar, Bed, Bath, Square, Home, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Extended project data (same as in AllNewProjectsPage)
const allNewProjects = [
    {
        id: 'skyview-condos-toronto',
        name: 'SkyView Condos',
        type: 'Apartments',
        city: 'Toronto',
        province: 'ON',
        location: 'SkyView Condos, Downtown, Toronto, ON',
        launchPrice: 650000,
        handover: 'Q4 2025',
        images: [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        ],
        beds: 2,
        baths: 2,
        sqft: 950,
        description: 'Experience modern urban living at SkyView Condos, located in the heart of downtown Toronto. These stunning condominiums offer breathtaking city views, premium finishes, and unparalleled access to the city\'s best dining, shopping, and entertainment. With spacious layouts and floor-to-ceiling windows, each unit is designed to maximize natural light and provide a luxurious living experience.',
        features: [
            'Floor-to-ceiling windows',
            'Premium kitchen appliances',
            'In-suite laundry',
            'Rooftop terrace',
            'Fitness center',
            'Concierge service',
            'Underground parking',
            'Pet-friendly',
            'Storage locker',
            'Bike storage'
        ],
        developer: {
            name: 'SkyLine Developments',
            contact: 'info@skylinedevelopments.ca',
            phone: '+1 (416) 555-0123'
        }
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
        images: [
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        ],
        beds: 3,
        baths: 2,
        sqft: 1200,
        description: 'Liberty Towers brings luxury living to Toronto\'s trendy Liberty Village. These sophisticated condominiums feature open-concept designs, premium materials, and state-of-the-art amenities. Located in one of the city\'s most vibrant neighborhoods, residents enjoy easy access to parks, restaurants, and public transit.',
        features: [
            'Open-concept design',
            'Quartz countertops',
            'Stainless steel appliances',
            'Hardwood flooring',
            'Spa-like bathrooms',
            'Balcony/terrace',
            'Gym and yoga studio',
            'Party room',
            'Guest suites',
            'Concierge service'
        ],
        developer: {
            name: 'Liberty Development Corp',
            contact: 'sales@libertydev.ca',
            phone: '+1 (416) 555-0456'
        }
    },
    {
        id: 'pacific-view-vancouver',
        name: 'Pacific View',
        type: 'Waterfront Condos',
        city: 'Vancouver',
        province: 'BC',
        location: 'Coal Harbour, Vancouver, BC',
        launchPrice: 850000,
        handover: 'Q3 2025',
        images: [
            'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        ],
        beds: 2,
        baths: 2,
        sqft: 1000,
        description: 'Pacific View offers unparalleled waterfront living in Vancouver\'s prestigious Coal Harbour. With stunning mountain and ocean views, these luxury condos feature the finest finishes and world-class amenities. Experience the pinnacle of West Coast living in this iconic development.',
        features: [
            'Ocean and mountain views',
            'Premium appliances',
            'Marble countertops',
            'Floor-to-ceiling windows',
            'Private balconies',
            'Infinity pool',
            'Marina access',
            'Spa and wellness center',
            'Wine cellar',
            'Valet parking'
        ],
        developer: {
            name: 'Pacific Coast Properties',
            contact: 'info@pacificcoast.ca',
            phone: '+1 (604) 555-0789'
        }
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

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

interface NewProjectDetailsClientProps {
    slug: string;
}

export function NewProjectDetailsClient({ slug }: NewProjectDetailsClientProps) {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: 'I would like to learn more about this project.'
    });

    useEffect(() => {
        const foundProject = allNewProjects.find(p => p.id === slug);
        setProject(foundProject);
        setLoading(false);
    }, [slug]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
        alert('Thank you for your inquiry! We will contact you soon.');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading project details...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
                    <p className="text-gray-600 mb-8">The project you're looking for doesn't exist or has been removed.</p>
                    <Link href="/new-projects">
                        <Button>Browse New Projects</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <motion.div
                className="bg-white shadow-sm border-b sticky top-20 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/new-projects/all"
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span>Back to projects</span>
                        </Link>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                <Heart className="h-4 w-4 mr-2" />
                                Save
                            </Button>
                            <Button variant="outline" size="sm">
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Image Gallery */}
            <motion.div {...fadeInUp} className="bg-white">
                <div className="container mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-96">
                        <div className="lg:col-span-3">
                            <img
                                src={project.images[currentImageIndex]}
                                alt={project.name}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                        <div className="flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto">
                            {project.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`${project.name} ${index + 1}`}
                                    className={`w-24 h-24 lg:w-full lg:h-24 object-cover rounded-lg cursor-pointer transition-opacity ${index === currentImageIndex ? 'opacity-100 ring-2 ring-green-500' : 'opacity-70 hover:opacity-100'
                                        }`}
                                    onClick={() => setCurrentImageIndex(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Content */}
            <motion.div
                className="container mx-auto px-4 py-8"
                {...fadeInUp}
                transition={{ delay: 0.2 }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Project Header */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        {project.name}
                                    </h1>
                                    <div className="flex items-center text-gray-600 mb-2">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        <span>{project.location}</span>
                                    </div>
                                    <p className="text-lg text-green-600 font-semibold">{project.type}</p>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Starting from</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {formatPrice(project.launchPrice)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Bed className="h-4 w-4" />
                                    <span>{project.beds} bedrooms</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Bath className="h-4 w-4" />
                                    <span>{project.baths} bathrooms</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Square className="h-4 w-4" />
                                    <span>{formatSquareFeet(project.sqft)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>Handover: {project.handover}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Project</h2>
                            <p className="text-gray-600 leading-relaxed">{project.description}</p>
                        </div>

                        {/* Features */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Features & Amenities</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {project.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-gray-700">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Developer Info */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Developer</h2>
                            <div className="space-y-2">
                                <p className="font-medium text-gray-900">{project.developer.name}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Mail className="h-4 w-4" />
                                        <span>{project.developer.contact}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Phone className="h-4 w-4" />
                                        <span>{project.developer.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Contact Form */}
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-32">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                Get Project Information
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Input
                                        type="text"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Input
                                        type="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Input
                                        type="tel"
                                        placeholder="Phone Number"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Textarea
                                        placeholder="Your Message"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        rows={4}
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                                    Send Inquiry
                                </Button>
                            </form>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex gap-2">
                                    <Button
                                        className="flex-1 bg-green-600 hover:bg-green-700 flex items-center gap-2"
                                        onClick={() => window.open(`tel:${project.developer.phone}`, '_blank')}
                                    >
                                        <Phone className="w-4 h-4" />
                                        Call
                                    </Button>
                                    <Button
                                        className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 flex items-center gap-2"
                                        variant="outline"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.513" />
                                        </svg>
                                        WhatsApp
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}