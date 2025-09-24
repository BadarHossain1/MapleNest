'use client';

import { motion } from 'framer-motion';
import { Hero, FeatureCards } from '@/components/Hero';
import { FeaturedListings } from '@/components/FeaturedListings';
import { TrendingAreas } from '@/components/TrendingAreas';
import { MarketStats } from '@/components/MarketStats';
import { CallToAction } from '@/components/CallToAction';
import { NewProjectsSection } from '@/components/NewProjectsSection';
import { PopularSection } from '@/components/ui/PopularSection';
import { FeaturedAgencies } from '@/components/ui/featured-agencies';
import CanadaMarketInsights from '@/components/CanadaMarketInsights';



const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />

      <motion.div {...fadeInUp}>
        <FeatureCards />
      </motion.div>

      <motion.div
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <MarketStats />
      </motion.div>

      <motion.div
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <NewProjectsSection />
      </motion.div>
      <motion.div
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <PopularSection />
      </motion.div>
      <motion.div
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <FeaturedListings />
      </motion.div>



      <motion.div
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <TrendingAreas />
      </motion.div>

      <motion.div
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <CanadaMarketInsights />
      </motion.div>

      <motion.div
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <FeaturedAgencies />
      </motion.div>

      <motion.div
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <CallToAction />
      </motion.div>
    </div>
  );
}