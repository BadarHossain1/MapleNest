'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Search, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CallToAction() {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Start your journey today with Canada's most comprehensive real estate platform.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="text-center p-6 bg-gray-800 rounded-lg">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Search Properties</h3>
            <p className="text-gray-300 mb-6">
              Browse thousands of listings across Canada with advanced search filters.
            </p>
            <Link href="/buy">
              <Button variant="outline" className="w-full">
                Start Searching
              </Button>
            </Link>
          </div>

          <div className="text-center p-6 bg-gray-800 rounded-lg">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Save Favorites</h3>
            <p className="text-gray-300 mb-6">
              Create your personalized collection of properties and get updates.
            </p>
            <Link href="/saved">
              <Button variant="outline" className="w-full">
                View Saved
              </Button>
            </Link>
          </div>

          <div className="text-center p-6 bg-gray-800 rounded-lg">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Connect with Agents</h3>
            <p className="text-gray-300 mb-6">
              Get expert guidance from our network of professional real estate agents.
            </p>
            <Link href="/agents">
              <Button variant="outline" className="w-full">
                Find an Agent
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link href="/buy">
            <Button size="lg" className="gap-2">
              Get Started Today
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}