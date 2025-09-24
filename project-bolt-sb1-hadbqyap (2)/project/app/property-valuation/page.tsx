'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Home, TrendingUp, Shield, BarChart3, Users, Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PropertyValuationPage() {
    const [activeTab, setActiveTab] = useState('Property Valuation™');
    const [searchType, setSearchType] = useState('Unit Number');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const tabs = ['Properties', 'New Projects', 'Transactions', 'Property Valuation™', 'Agents'];
    const searchTypes = ['Unit Number', 'Title Deed', 'Oqood', 'DEWA Number'];

    const faqs = [
        {
            question: "How does Property Valuation™ work?",
            answer: "Property Valuation™ uses advanced AI algorithms and comprehensive Canadian real estate data to provide accurate property valuations. Our system analyzes market trends, comparable sales, neighborhood factors, and property characteristics specific to Canadian markets."
        },
        {
            question: "What factors are considered to estimate the prices?",
            answer: "We consider location, property size, age, condition, recent comparable sales, neighborhood amenities, school districts, transit access, market trends, and local economic factors across Canadian cities including Toronto, Vancouver, Montreal, and Calgary."
        },
        {
            question: "How to best utilize Property Valuation™ report?",
            answer: "Use the report as a starting point for pricing decisions, compare with recent market activity, consider the confidence level indicator, and consult with local Canadian real estate professionals for final decision-making."
        },
        {
            question: "How can I get the most accurate price valuations from Property Valuation™?",
            answer: "Ensure you provide complete and accurate property details, verify the property address, and consider recent renovations or improvements that may affect value in the Canadian market context."
        },
        {
            question: "How can I get a valuation for a property I want to sell in Canada?",
            answer: "Simply enter your Canadian property address, select the appropriate province and city, provide property details, and Property Valuation™ will generate a comprehensive valuation report with market insights."
        },
        {
            question: "How can I find how much is my house worth?",
            answer: "Use our Property Valuation™ tool by entering your address and property details. The system will analyze Canadian market data to provide an estimated value range with confidence indicators."
        },
        {
            question: "What's the best free property valuation tool in Canada?",
            answer: "Property Valuation™ is designed specifically for the Canadian real estate market, providing comprehensive valuations using local data sources and market expertise across all major Canadian cities."
        },
        {
            question: "Is Property Valuation™ the most accurate home value estimator in Canada?",
            answer: "Property Valuation™ leverages extensive Canadian real estate data and advanced algorithms to provide highly accurate estimates, though we recommend consulting with local professionals for final valuations."
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative min-h-screen bg-gradient-to-b from-emerald-100 via-teal-50 to-cyan-100 overflow-hidden">
                {/* Canadian Cityscape Background */}
                <div className="absolute bottom-0 left-0 right-0 h-64">
                    <svg viewBox="0 0 1400 400" className="w-full h-full">
                        {/* Toronto CN Tower */}
                        <rect x="200" y="120" width="8" height="200" fill="#4a90e2" />
                        <circle cx="204" cy="120" r="12" fill="#4a90e2" />

                        {/* Vancouver Buildings */}
                        <rect x="100" y="180" width="40" height="140" fill="#5fb3d4" />
                        <rect x="150" y="160" width="35" height="160" fill="#81c784" />
                        <rect x="190" y="200" width="25" height="120" fill="#ffb74d" />

                        {/* Montreal Skyline */}
                        <rect x="300" y="170" width="45" height="150" fill="#7986cb" />
                        <rect x="350" y="190" width="30" height="130" fill="#64b5f6" />
                        <rect x="385" y="160" width="40" height="160" fill="#4fc3f7" />

                        {/* Calgary Buildings */}
                        <rect x="500" y="185" width="35" height="135" fill="#aed581" />
                        <rect x="540" y="175" width="40" height="145" fill="#ffcc02" />
                        <rect x="585" y="195" width="30" height="125" fill="#ff8a65" />

                        {/* Ottawa Parliament */}
                        <rect x="700" y="160" width="50" height="160" fill="#8bc34a" />
                        <polygon points="700,160 725,140 750,160" fill="#2e7d32" />

                        {/* Additional buildings */}
                        <rect x="800" y="190" width="35" height="130" fill="#ab47bc" />
                        <rect x="840" y="170" width="40" height="150" fill="#ec407a" />
                        <rect x="885" y="185" width="32" height="135" fill="#26a69a" />
                        <rect x="920" y="195" width="38" height="125" fill="#ffa726" />
                        <rect x="965" y="175" width="42" height="145" fill="#66bb6a" />
                        <rect x="1010" y="180" width="36" height="140" fill="#42a5f5" />
                        <rect x="1050" y="165" width="44" height="155" fill="#ef5350" />
                        <rect x="1100" y="185" width="34" height="135" fill="#9c27b0" />
                        <rect x="1140" y="170" width="39" height="150" fill="#ff9800" />
                        <rect x="1185" y="190" width="33" height="130" fill="#4caf50" />
                    </svg>
                </div>

                <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                            Property Valuation™
                        </h1>
                        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                            Get a comprehensive, data-backed property valuation in Canada for your freehold property,
                            including an accurate sale estimate and market insights.
                        </p>

                        {/* Tabs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-white rounded-xl shadow-lg p-2 mb-8 inline-flex"
                        >
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-3 font-medium rounded-lg transition-all duration-300 ${activeTab === tab
                                            ? 'bg-emerald-500 text-white shadow-md'
                                            : 'text-gray-600 hover:text-emerald-600'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </motion.div>

                        {/* Search Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="bg-white rounded-xl shadow-xl p-8 max-w-4xl mx-auto"
                        >
                            {/* Search Type Tabs */}
                            <div className="flex flex-wrap justify-center gap-2 mb-6">
                                <span className="text-gray-600 font-medium mr-4">Search by</span>
                                {searchTypes.map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setSearchType(type)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${searchType === type
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-emerald-100'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            {/* Search Inputs */}
                            <div className="flex flex-col md:flex-row gap-4 mb-4">
                                <div className="flex-1 relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        placeholder="Enter location name"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <select className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-600">
                                    <option>Unit Number</option>
                                    <option>101</option>
                                    <option>102</option>
                                    <option>201</option>
                                </select>
                                <Button className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium">
                                    Get Report
                                </Button>
                            </div>

                            <p className="text-sm text-gray-500 text-center">
                                *Select the unit number as per the Title Deed. | <Link href="#" className="text-emerald-600 hover:underline">View Sample</Link>
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Property Value Display Section */}
            <section className="py-20 bg-gradient-to-b from-cyan-50 to-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-800 mb-8">
                            What is Property Valuation™?
                        </h2>

                        <div className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-100 to-teal-100 rounded-3xl p-12 relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <svg viewBox="0 0 400 300" className="w-full h-full">
                                    <rect x="50" y="150" width="300" height="100" fill="url(#cityGradient)" />
                                    <defs>
                                        <linearGradient id="cityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#10b981" />
                                            <stop offset="100%" stopColor="#06b6d4" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>

                            <div className="relative z-10 max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
                                <div className="flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mx-auto mb-6">
                                    <Home className="h-8 w-8 text-emerald-600" />
                                </div>

                                <div className="text-center mb-6">
                                    <p className="text-gray-600 text-lg mb-2">CAD</p>
                                    <h3 className="text-4xl font-bold text-gray-800">3,620,000</h3>
                                    <div className="flex items-center justify-center gap-2 mt-4">
                                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                        <span className="text-emerald-600 font-medium">High Confidence</span>
                                    </div>
                                </div>

                                {/* Mock Chart */}
                                <div className="h-24 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-lg flex items-end justify-center p-4">
                                    <svg viewBox="0 0 200 60" className="w-full h-full">
                                        <path
                                            d="M 10 50 Q 50 30 100 35 T 190 25"
                                            stroke="#10b981"
                                            strokeWidth="3"
                                            fill="none"
                                        />
                                        <circle cx="190" cy="25" r="4" fill="#10b981" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="max-w-3xl mx-auto mt-12 text-lg text-gray-600 leading-relaxed">
                            <p className="mb-6">
                                Property Valuation™ is an AI-powered online home value estimator that provides you an
                                accurate and up-to-date, data-backed property value estimation to help you understand
                                market dynamics and make informed real estate decisions in Canada.
                            </p>
                            <p>
                                Whether you're selling, buying, or simply curious, Property Valuation™ free property valuation
                                report gives you comprehensive insights and analysis of your property's value, estimated
                                rental yields and more across major Canadian markets.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Why Use Property Valuation Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-800 mb-16">
                            Why use Property Valuation™?
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                            {/* Data-Backed */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                                className="text-center"
                            >
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <BarChart3 className="h-10 w-10 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Data-Backed</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Our rich, AI powered solution ensures your estimates align with actual Canadian market trends
                                    across Toronto, Vancouver, Montreal, Calgary and other major cities.
                                </p>
                            </motion.div>

                            {/* Detailed Insights */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-center"
                            >
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <TrendingUp className="h-10 w-10 text-emerald-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Detailed Insights</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Get your Canadian property's detailed value, rental yield, history and comparable properties,
                                    all in one comprehensive report tailored for the Canadian market.
                                </p>
                            </motion.div>

                            {/* Trustworthy */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="text-center"
                            >
                                <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Shield className="h-10 w-10 text-cyan-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Trustworthy</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Designed with transparency in mind, a reliable choice for Canadian property owners, sellers,
                                    buyers and renters across all provinces and territories.
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-800 mb-12">
                            Frequently Asked Questions
                        </h2>

                        <div className="max-w-4xl mx-auto space-y-4">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="text-lg font-medium text-gray-800">{faq.question}</span>
                                        {openFaq === index ? (
                                            <ChevronUp className="h-5 w-5 text-gray-600" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-gray-600" />
                                        )}
                                    </button>
                                    {openFaq === index && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="px-6 pb-4 text-gray-600 leading-relaxed"
                                        >
                                            {faq.answer}
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Agent Contact Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <div className="flex justify-center mb-8">
                            <div className="flex -space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                    JS
                                </div>
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                    MR
                                </div>
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                    AL
                                </div>
                                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                    SK
                                </div>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Need help selling or renting out your property?
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Get in touch with our featured Canadian agents and agencies.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                            <div className="relative flex-1 w-full">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Enter location"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <Button className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium whitespace-nowrap">
                                Search Agents
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}