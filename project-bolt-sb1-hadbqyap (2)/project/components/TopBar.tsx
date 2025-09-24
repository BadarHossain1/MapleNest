'use client';

import Link from 'next/link';
import { Globe, Settings, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function TopBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="bg-gray-50 border-b border-gray-100 text-sm">
        <div className="container mx-auto px-4 flex items-center justify-between h-8">
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-1 hover:text-emerald-600 cursor-pointer">
              <Globe className="h-4 w-4" />
              <span className="font-medium">EN</span>
            </div>
            <Link href="/settings" className="hidden sm:inline-flex items-center gap-1 hover:text-emerald-600">
              <Settings className="h-4 w-4" />
              <span>Site settings</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 text-gray-600">
            <Link href="/favorites" className="flex items-center gap-2 hover:text-emerald-600">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Favourite properties</span>
            </Link>

            <Link href="/saved" className="flex items-center gap-2 hover:text-emerald-600">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Saved searches</span>
            </Link>

            <Link href="/login">
              <Button variant="ghost" className="ml-2 py-1 px-3 text-sm">
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
