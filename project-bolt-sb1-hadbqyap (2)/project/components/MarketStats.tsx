'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Home, MapPin, Users } from 'lucide-react';

const stats = [
  {
    icon: Home,
    value: '10,000+',
    label: 'Active Listings',
    description: 'Properties across Canada'
  },
  {
    icon: MapPin,
    value: '5',
    label: 'Major Cities',
    description: 'Toronto, Vancouver, Montreal, Calgary, Ottawa'
  },
  {
    icon: Users,
    value: '500+',
    label: 'Verified Agents',
    description: 'Professional real estate experts'
  },
  {
    icon: TrendingUp,
    value: '98%',
    label: 'Success Rate',
    description: 'Client satisfaction rating'
  }
];

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

export function MarketStats() {
  return (
    <section className="py-16 bg-emerald-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Canada's Trusted Real Estate Platform
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of Canadians who have found their perfect home through MapleNest.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              variants={fadeInUp}
              className="text-center bg-white rounded-lg p-6 shadow-sm"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-gray-900 mb-2">
                {stat.label}
              </div>
              <div className="text-sm text-gray-600">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}