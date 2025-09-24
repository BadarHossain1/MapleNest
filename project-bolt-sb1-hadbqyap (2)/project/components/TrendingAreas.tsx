'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MapPin, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import areasData from '@/data/areas.json';

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export function TrendingAreas() {
  const trendingAreas = areasData.slice(0, 4);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trending Neighborhoods
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore Canada's most sought-after neighborhoods where lifestyle meets opportunity.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {trendingAreas.map((area) => (
            <motion.div key={area.id} variants={fadeInUp}>
              <Link href={`/areas/${area.slug}`}>
                <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                  <div className="relative h-64">
                    <img 
                      src={area.heroImage} 
                      alt={area.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-1 text-sm mb-2">
                        <MapPin className="h-4 w-4" />
                        <span>{area.city}, {area.province}</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-emerald-300 transition-colors">
                        {area.title}
                      </h3>
                      <p className="text-sm text-white/90 line-clamp-2">
                        {area.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Avg. Home Price</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatPrice(area.averagePrices.detached)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Avg. Condo Price</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatPrice(area.averagePrices.condo)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                        <span>{area.demographics.population.toLocaleString()} residents</span>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Link href="/areas">
            <Button size="lg" variant="outline" className="gap-2">
              Explore All Areas
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}