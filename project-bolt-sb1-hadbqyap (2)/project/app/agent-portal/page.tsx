'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowRight,
    Star,
    Trophy,
    Users,
    BookOpen,
    TrendingUp,
    Award,
    Building,
    GraduationCap,
    Laptop,
    Phone,
    Mail,
    MapPin,
    Download,
    Eye,
    CheckCircle,
    BarChart3,
    Target,
    Calendar,
    Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// TruBroker Stories Section
const TruBrokerStoriesSection = () => (
    <section className="py-16 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl font-bold text-emerald-600 mb-4">
                        Spotlight Your Listings with MapleNest™ Stories
                    </h2>
                    <p className="text-lg text-gray-700 mb-8">
                        Want more eyes on your listings? MapleNest™ Stories are your chance to shine.
                        Create short, engaging video walkthroughs directly from our mobile app and
                        give clients a real feel for the property.
                    </p>
                    <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                        LEARN MORE
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative"
                >
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-4">
                            Have You Shared Your First MapleNest™ Story Yet?
                        </h3>
                        <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <Eye className="h-5 w-5" />
                                <span className="text-sm font-medium">STORIES from MapleNest in Toronto</span>
                            </div>
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white"
                                        style={{
                                            backgroundImage: `url(https://images.unsplash.com/photo-${1500000000 + i}0-${i}bc1c2e5e3a2?w=40&h=40&fit=crop&crop=face)`,
                                            backgroundSize: 'cover'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    </section>
);

// Top Agencies Section
const TopAgenciesSection = () => {
    const topAgencies = [
        { name: 'RE/MAX Ontario-Atlantic Canada', listings: 1388, logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop' },
        { name: 'Century 21 Canada', listings: 1241, logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop' },
        { name: 'Royal LePage', listings: 1025, logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop' },
        { name: 'Sutton Group Realty', listings: 953, logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop' },
        { name: 'Coldwell Banker Canada', listings: 716, logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop' }
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <div className="flex items-center gap-4 mb-6">
                                    <Button variant="outline" className="text-emerald-600 border-emerald-600">TORONTO</Button>
                                    <Button variant="ghost" className="text-gray-500">VANCOUVER</Button>
                                </div>

                                <h3 className="text-xl font-bold mb-6">
                                    Top Ranking Agencies with most Verified™ Listings in Toronto
                                </h3>

                                <div className="space-y-4">
                                    {topAgencies.map((agency, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-12 h-12 rounded bg-gray-200"
                                                    style={{
                                                        backgroundImage: `url(${agency.logo})`,
                                                        backgroundSize: 'cover'
                                                    }}
                                                />
                                                <span className="font-medium">{agency.name}</span>
                                            </div>
                                            <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                                                {agency.listings.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card className="h-full">
                            <CardHeader className="text-center">
                                <div className="text-sm text-emerald-600 font-medium mb-2">RESOURCE OF THE WEEK</div>
                                <CardTitle className="text-xl">Master Your First Client Meeting</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-gray-600 mb-6">
                                    Discover our professional guidelines and etiquette for successful
                                    conversations that real estate agents have with their customers.
                                </p>
                                <div className="mb-6">
                                    <img
                                        src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=300&h=200&fit=crop"
                                        alt="Professional consultation"
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                </div>
                                <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                                    DOWNLOAD
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// Content Corner Section
const ContentCornerSection = () => {
    const articles = [
        {
            title: 'Canadian Real Estate Market Review Q3 2024',
            category: 'Market Insights',
            readTime: '3 min read',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop',
            description: 'Curious about the performance of the Canadian property market during the third quarter of 2024? We have all the insights you should know.'
        },
        {
            title: 'Your Guide to Hosting an Open House in Canada',
            category: 'Professional Tips',
            readTime: '4 min read',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop',
            description: 'Sell your client\'s home faster and get it on the radar by hosting an Open House! We take you through the basics of arranging for your first event.'
        },
        {
            title: 'The Ultimate Guide to Off-Plan Properties in Canada',
            category: 'Investment Tips',
            readTime: '5 min read',
            image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
            description: 'Are you an off-plan sales specialist in Canada? We share six great tips that can help you elevate your real estate business.'
        }
    ];

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="text-center mb-12">
                        <div className="text-emerald-600 font-medium mb-2">CONTENT CORNER</div>
                        <h2 className="text-3xl font-bold">Top Reads of the Week</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        {articles.map((article, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="h-full hover:shadow-lg transition-shadow">
                                    <div className="aspect-video overflow-hidden rounded-t-lg">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                                                {article.category}
                                            </span>
                                            <span className="text-xs text-gray-500">{article.readTime}</span>
                                        </div>
                                        <h3 className="font-semibold text-lg mb-3">{article.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4">{article.description}</p>
                                        <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-600">
                                            READ MORE
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                            SEE ALL
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// Newsletter Section
const NewsletterSection = () => (
    <section className="py-12 bg-gradient-to-r from-teal-500 to-emerald-600">
        <div className="container mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
            >
                <h2 className="text-3xl font-bold text-white mb-8">Subscribe to our newsletter</h2>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <Input
                        placeholder="Full Name"
                        className="bg-white"
                    />
                    <Input
                        placeholder="Email"
                        type="email"
                        className="bg-white"
                    />
                    <Button className="bg-emerald-700 hover:bg-emerald-800 text-white">
                        SUBSCRIBE
                    </Button>
                </div>
            </motion.div>
        </div>
    </section>
);

// Academy Section
const AcademySection = () => (
    <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="text-emerald-500">
                            <GraduationCap className="h-8 w-8" />
                        </div>
                        <h2 className="text-3xl font-bold">MapleNest Academy</h2>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">ENDORSED BY REAL ESTATE COUNCIL OF CANADA</div>
                    <p className="text-lg text-gray-700 mb-8">
                        Join us to boost the skills you need to succeed in the competitive Canadian Real Estate market,
                        and benefit from great networking opportunities.
                    </p>
                    <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                        LEARN MORE
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                        alt="Real estate professionals in training"
                        className="rounded-xl shadow-lg w-full"
                    />
                </motion.div>
            </div>
        </div>
    </section>
);

// Profolio Section
const ProfolioSection = () => (
    <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-3xl font-bold text-emerald-600">Profolio™</h2>
                        <div className="flex gap-4 text-gray-400">
                            <span>MapleNest</span>
                            <span>|</span>
                            <span>MapleNest | Dubizzle</span>
                            <span className="text-gray-600 font-medium">stronger together</span>
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-4">Best-In-Class Property Management Software</h3>
                    <p className="text-gray-700 mb-8">
                        Profolio™ is a comprehensive listing management software, available to all of our partners.
                        Our sophisticated and intuitive platform enables agents and brokers to upload, edit and manage
                        their listings. Agents can also utilise our featured products like Signature and Hot listings
                        to maximise the reach and conversion for their properties.
                    </p>

                    <div className="flex gap-4">
                        <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                            LEARN MORE
                        </Button>
                        <Button size="lg" variant="outline" className="border-emerald-500 text-emerald-600">
                            LOG IN / DOWNLOAD
                        </Button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop"
                        alt="Property management software interface"
                        className="rounded-xl shadow-lg w-full"
                    />
                </motion.div>
            </div>
        </div>
    </section>
);

// Building Guides CTA
const BuildingGuidesCTA = () => (
    <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold mb-4">Become An Area Expert</h2>
                        <div className="flex gap-8 mb-6">
                            <div className="border-b-2 border-emerald-500 pb-2">
                                <span className="font-semibold">Building Guides</span>
                            </div>
                            <div className="text-gray-400 pb-2">
                                <span>Market Reports</span>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-4">
                        Discover the many stunning buildings of Canada
                    </h3>
                    <p className="text-gray-700 mb-8">
                        Browse through our many detailed guides for every building in Canada.
                    </p>

                    <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                        LEARN MORE
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=400&fit=crop"
                            alt="Isometric city illustration"
                            className="rounded-xl w-full"
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    </section>
);

// Testimonials Section
const TestimonialsSection = () => {
    const testimonials = [
        {
            text: "The training workshops offered by MapleNest Academy have helped me become more professional and confident in my interactions with clients in Toronto and helped me develop my real estate career.",
            author: "Sarah Johnson",
            title: "Real Estate Consultant, Toronto Real Estate",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face"
        },
        {
            text: "I thoroughly enjoyed my time at MapleNest Academy. The trainers' teaching style and sense of humour made the sessions fun, informative and engaging. I had a viewing after the workshop, where I applied what I learnt and secured a deal.",
            author: "Michael Chen",
            title: "Client Manager, Vancouver Premium Real Estate",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"
        },
        {
            text: "Thanks to MapleNest Academy, I managed to close 10 off-plan properties valued at over $2M. The Verified™ badge helped increase inquiry levels greatly.",
            author: "Jamie Thompson",
            title: "Head of Sales and Leasing, Calgary Elite Real Estate",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
        }
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="text-emerald-600 font-medium mb-2">TESTIMONIALS</div>
                        <h2 className="text-3xl font-bold mb-6">Why use MapleNest?</h2>
                        <p className="text-gray-600 mb-8">See what our partners have to say!</p>
                        <Button className="bg-emerald-500 hover:bg-emerald-600">
                            VIEW ALL TESTIMONIALS
                        </Button>
                    </motion.div>

                    <div className="lg:col-span-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    <Card className="h-full">
                                        <CardContent className="p-6">
                                            <div className="text-4xl text-emerald-500 mb-4">"</div>
                                            <p className="text-gray-700 mb-6">{testimonial.text}</p>
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={testimonial.avatar}
                                                    alt={testimonial.author}
                                                    className="w-12 h-12 rounded-full"
                                                />
                                                <div>
                                                    <div className="font-semibold text-emerald-600">{testimonial.author}</div>
                                                    <div className="text-sm text-gray-500">{testimonial.title}</div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Press Section
const PressSection = () => {
    const articles = [
        {
            title: 'MapleNest adopts best global standards to accelerate transition to digital real estate',
            source: 'CBC News',
            language: 'ENGLISH',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop'
        },
        {
            title: 'MapleNest\'s "Real" Real Estate Promise Dominates Toronto\'s Market Expansion',
            source: 'Global News',
            language: 'ENGLISH',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop'
        },
        {
            title: 'Canada Real Estate Council Qualifies 166 Young Canadian Citizens Enrolled In The New Real Estate Program',
            source: 'CTV News',
            language: 'ENGLISH',
            image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop'
        }
    ];

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <div className="text-emerald-600 font-medium mb-2">IN THE PRESS</div>
                            <h2 className="text-3xl font-bold mb-8">Latest News & Coverage</h2>
                            <img
                                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop"
                                alt="Canadian real estate market"
                                className="rounded-xl w-full mb-6"
                            />
                            <h3 className="text-xl font-bold mb-4">
                                Canadian real estate: MapleNest announces AI property valuation service
                            </h3>
                            <div className="flex gap-4 text-sm text-gray-500 mb-4">
                                <span>ENGLISH</span>
                                <span>CANADIAN BUSINESS</span>
                            </div>
                            <Button className="bg-emerald-500 hover:bg-emerald-600">
                                READ MORE
                            </Button>
                        </div>

                        <div className="space-y-6">
                            {articles.map((article, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex gap-4">
                                                <img
                                                    src={article.image}
                                                    alt={article.title}
                                                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-semibold mb-2 text-sm">{article.title}</h4>
                                                    <div className="flex gap-4 text-xs text-gray-500 mb-3">
                                                        <span className="text-yellow-600">{article.language}</span>
                                                        <span>{article.source}</span>
                                                    </div>
                                                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-xs">
                                                        READ MORE
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}

                            <div className="text-center pt-4">
                                <Button className="bg-emerald-500 hover:bg-emerald-600">
                                    SEE ALL
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// Contact Section
const ContactSection = () => (
    <section className="py-16 bg-gradient-to-r from-emerald-500 to-teal-600">
        <div className="container mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
            >
                <h2 className="text-4xl font-bold text-white mb-2">
                    Advertise with <span className="text-yellow-300">MapleNest</span> today!
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-12">
                    <div className="text-white">
                        <img
                            src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop"
                            alt="Isometric city illustration"
                            className="w-full rounded-xl"
                        />
                    </div>

                    <div className="bg-white rounded-xl p-8">
                        <div className="space-y-4">
                            <Input placeholder="Full Name*" />
                            <Input placeholder="Phone Number*" />
                            <Input placeholder="Email*" type="email" />
                            <Input placeholder="Company Name*" />
                            <Button size="lg" className="w-full bg-emerald-500 hover:bg-emerald-600">
                                REGISTER NOW
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    </section>
);

export default function AgentPortalPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section
                className="relative h-96 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1920&h=800&fit=crop)'
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
                        <h1 className="text-5xl font-bold mb-4">Agent Portal</h1>
                        <p className="text-xl mb-8">Your gateway to success in Canadian real estate</p>
                    </motion.div>
                </div>
            </section>

            {/* All Sections */}
            <TruBrokerStoriesSection />
            <TopAgenciesSection />
            <ContentCornerSection />
            <NewsletterSection />
            <AcademySection />
            <ProfolioSection />
            <BuildingGuidesCTA />
            <TestimonialsSection />
            <PressSection />
            <ContactSection />
        </div>
    );
}