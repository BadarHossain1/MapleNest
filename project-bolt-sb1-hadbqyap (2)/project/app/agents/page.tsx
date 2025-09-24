'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import agentsData from '@/data/agents.json';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function AgentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const filteredAgents = agentsData.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCity = !selectedCity || agent.serviceAreas.includes(selectedCity);
    return matchesSearch && matchesCity;
  });

  const cities = [...new Set(agentsData.flatMap(agent => agent.serviceAreas))];

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div 
        className="bg-white shadow-sm border-b"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container mx-auto px-4 py-12">
          <motion.div className="text-center max-w-3xl mx-auto mb-8" {...fadeInUp}>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Perfect Real Estate Agent
            </h1>
            <p className="text-lg text-gray-600">
              Connect with experienced real estate professionals across Canada. 
              Our agents are ready to help you buy, sell, or rent your perfect property.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto"
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search agents by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        className="container mx-auto px-4 py-12"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAgents.map((agent) => (
            <motion.div
              key={agent.id}
              variants={fadeInUp}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="text-center mb-6">
                  <img 
                    src={agent.headshot} 
                    alt={agent.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {agent.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">{agent.brokerage}</p>
                  
                  <div className="flex items-center justify-center gap-1 mb-3">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{agent.reviews.average}</span>
                    <span className="text-sm text-gray-500">({agent.reviews.count} reviews)</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{agent.serviceAreas.slice(0, 2).join(', ')}</span>
                    {agent.serviceAreas.length > 2 && (
                      <span>+{agent.serviceAreas.length - 2} more</span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Specialties</p>
                    <div className="flex flex-wrap gap-2">
                      {agent.specialties.slice(0, 3).map((specialty, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Languages</p>
                    <p className="text-sm text-gray-600">{agent.languages.join(', ')}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Experience</p>
                    <p className="text-sm text-gray-600">{agent.experience} years</p>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex gap-2 mb-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                    </div>
                    
                    <Link href={`/agents/${agent.slug}`}>
                      <Button className="w-full">View Profile</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <motion.div 
            className="text-center py-12"
            {...fadeInUp}
          >
            <p className="text-gray-600 text-lg mb-4">No agents found matching your criteria.</p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCity('');
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}