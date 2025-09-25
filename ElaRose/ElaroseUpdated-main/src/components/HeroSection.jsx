"use client"

import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const router = useRouter();
  
  return (
    <section className="relative h-[78vh] md:h-[86vh] flex items-center overflow-hidden mb-6">
      {/* Background image - fill the container */}
      <ImageWithFallback
        src="https://images.unsplash.com/photo-1678637803638-0bcc1e13ecae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGZhc2hpb24lMjBkcmVzcyUyMGVsZWdhbnR8ZW58MXx8fHwxNzU3NTEzNjA2fDA&ixlib=rb-4.1.0&q=80&w=1600&utm_source=figma&utm_medium=referral"
        alt="Model wearing the latest collection"
        className="absolute inset-0 w-full h-full object-cover transform-gpu transition-transform duration-700 ease-out hover:scale-105"
      />

      {/* Gradient overlay to ensure text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent pointer-events-none"></div>

      {/* Decorative soft vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_transparent_40%,_rgba(0,0,0,0.55)_100%)] pointer-events-none"></div>

      {/* Content - left aligned on large screens, centered on small screens */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="flex items-center h-[78vh] md:h-[86vh]">
          <div className="max-w-2xl md:max-w-xl lg:max-w-2xl text-white backdrop-blur-sm bg-white/5 rounded-2xl p-8 md:p-12 shadow-xl animate-fade-in">
            <span className="inline-block text-sm uppercase tracking-widest text-gray-300 mb-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              New season
            </span>
            <h1 className="text-4xl md:text-6xl font-extralight leading-tight mb-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              Discover Elevated Essentials
            </h1>
            <p className="text-gray-200 text-lg md:text-xl mb-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              Curated pieces for effortless everyday style — discover a collection designed to last.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <Button
                size="lg"
                onClick={() => router.push('/new-arrivals')}
                className="bg-[#c66074] text-white p-6 shadow-lg hover:bg-[#f2c9c7] hover:text-[#8B5446] hover:-translate-y-1 transition-all duration-300 font-medium tracking-wide"
              >
                <span className="inline-block">Shop Collection</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}