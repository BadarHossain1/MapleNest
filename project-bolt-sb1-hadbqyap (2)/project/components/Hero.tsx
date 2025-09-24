'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Real homes live here
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Real Prices. Real Photos. Real Properties.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full max-w-4xl mx-auto"
        >
          {/* Property Type Tabs */}
          <div className="bg-white rounded-t-lg p-1 mb-0 inline-flex shadow-lg">
            <button className="px-6 py-3 text-green-600 font-medium bg-white rounded-md shadow-sm">
              Properties
            </button>
            <button className="px-6 py-3 text-gray-600 font-medium hover:text-green-600 transition-colors">
              New Projects
            </button>
            <button className="px-6 py-3 text-gray-600 font-medium hover:text-green-600 transition-colors">
              Transactions
            </button>
            <button className="px-6 py-3 text-gray-600 font-medium hover:text-green-600 transition-colors">
              Property-Valuation™
            </button>
            <button className="px-6 py-3 text-gray-600 font-medium hover:text-green-600 transition-colors">
              Agents
            </button>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-lg rounded-tl-none shadow-lg p-6">
            {/* Buy/Rent Toggle */}
            <div className="flex mb-4">
              <button className="px-6 py-2 bg-green-50 text-green-600 font-medium rounded-l-md border border-green-200">
                Buy
              </button>
              <button className="px-6 py-2 bg-white text-gray-600 font-medium rounded-r-md border border-gray-200 border-l-0 hover:bg-gray-50">
                Rent
              </button>
            </div>

            {/* Search Controls */}
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter location"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-4 flex-1">
                <select className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-600">
                  <option>All</option>
                  <option>Ready</option>
                  <option>Off-Plan</option>
                </select>
                <select className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-600">
                  <option>Residential</option>
                  <option>Commercial</option>
                </select>
              </div>
            </div>

            {/* Additional Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              <div className="flex gap-4 flex-1">
                <select className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-600">
                  <option>Beds & Baths</option>
                  <option>1 Bed</option>
                  <option>2 Beds</option>
                  <option>3+ Beds</option>
                </select>
                <select className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-600">
                  <option>Price (CAD)</option>
                  <option>Under $500K</option>
                  <option>$500K - $1M</option>
                  <option>$1M+</option>
                </select>
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md font-medium transition-colors">
                Search
              </button>
            </div>

            {/* AI Suggestion */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-sm">Get instant answers about Canadian real estate with PropertyGPT</span>
              </div>
              <Link href="/ai-assistant" className="text-green-600 font-medium hover:text-green-700 transition-colors flex items-center gap-1">
                Try PropertyGPT
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Experience the Journey Button */}
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <button className="flex items-center gap-3 px-6 py-3 bg-black/50 backdrop-blur-sm text-white rounded-full border border-white/20 hover:bg-black/60 transition-all duration-300">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="font-medium">Experience the Journey</span>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}

export function FeatureCards() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Property Valuation Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="p-8">
              <div className="h-32 mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-50 rounded-lg flex items-center justify-center">
                  <div className="relative">
                    {/* House with price tag illustration */}
                    <div className="w-16 h-12 bg-green-200 rounded-sm relative">
                      <div className="absolute -top-2 -right-2 w-8 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">$</span>
                      </div>
                      <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-sm"></div>
                      <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-sm"></div>
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-4 bg-green-300 rounded-sm"></div>
                    </div>
                    {/* Trees */}
                    <div className="absolute -left-4 top-4 w-3 h-6 bg-green-400 rounded-full"></div>
                    <div className="absolute -right-6 top-2 w-4 h-8 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Property Valuation™
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Get accurate market valuations for your Canadian property instantly
              </p>
              <Link href="/property-valuation" className="text-green-600 font-medium hover:text-green-700 transition-colors flex items-center gap-1 group">
                Learn more
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Smart Search Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="p-8">
              <div className="h-32 mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-50 rounded-lg flex items-center justify-center">
                  <div className="relative">
                    {/* Car with location pins illustration */}
                    <div className="w-16 h-8 bg-gray-700 rounded-lg relative">
                      <div className="absolute top-1 left-2 w-3 h-2 bg-cyan-300 rounded-sm"></div>
                      <div className="absolute top-1 right-2 w-3 h-2 bg-cyan-300 rounded-sm"></div>
                      <div className="absolute -bottom-1 left-3 w-2 h-2 bg-gray-800 rounded-full"></div>
                      <div className="absolute -bottom-1 right-3 w-2 h-2 bg-gray-800 rounded-full"></div>
                    </div>
                    {/* Location pins */}
                    <div className="absolute -top-4 -left-2 w-3 h-4 bg-red-500 rounded-t-full rounded-b-sm"></div>
                    <div className="absolute -top-6 right-2 w-4 h-5 bg-blue-500 rounded-t-full rounded-b-sm"></div>
                    <div className="absolute -top-3 right-8 w-3 h-4 bg-green-500 rounded-t-full rounded-b-sm"></div>
                    {/* Buildings */}
                    <div className="absolute -right-8 -top-2 w-6 h-12 bg-blue-200 rounded-sm"></div>
                    <div className="absolute -right-12 top-0 w-4 h-8 bg-blue-300 rounded-sm"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Commute Finder
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Find homes based on your daily commute time across Canadian cities
              </p>
              <Link href="/commute-finder" className="text-green-600 font-medium hover:text-green-700 transition-colors flex items-center gap-1 group">
                Try it now
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Interactive Map Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="p-8">
              <div className="h-32 mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-green-50 rounded-lg flex items-center justify-center">
                  <div className="relative">
                    {/* Map with buildings and pins */}
                    <div className="w-20 h-16 bg-green-100 rounded-lg relative overflow-hidden">
                      {/* Buildings */}
                      <div className="absolute right-2 bottom-0 w-6 h-10 bg-emerald-300 rounded-sm"></div>
                      <div className="absolute right-10 bottom-0 w-4 h-8 bg-emerald-400 rounded-sm"></div>
                      <div className="absolute left-2 bottom-0 w-5 h-12 bg-emerald-200 rounded-sm"></div>
                      {/* Location pins */}
                      <div className="absolute top-2 left-4 w-3 h-4 bg-yellow-400 rounded-t-full rounded-b-sm"></div>
                      <div className="absolute top-6 right-6 w-3 h-4 bg-blue-500 rounded-t-full rounded-b-sm"></div>
                      <div className="absolute bottom-6 right-12 w-3 h-4 bg-red-500 rounded-t-full rounded-b-sm"></div>
                      {/* Trees */}
                      <div className="absolute top-4 left-8 w-2 h-3 bg-green-500 rounded-full"></div>
                      <div className="absolute bottom-4 left-12 w-2 h-3 bg-green-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Neighborhood Explorer
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Discover properties in your preferred neighborhoods using our interactive map
              </p>
              <Link href="/neighborhood-explorer" className="text-green-600 font-medium hover:text-green-700 transition-colors flex items-center gap-1 group">
                Explore map
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}