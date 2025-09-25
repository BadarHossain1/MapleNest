"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 gradient-hero"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white animate-float"></div>
        <div className="absolute bottom-32 right-20 w-48 h-48 rounded-full bg-white animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-white animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-[#2d1b1e]" />
              <span className="text-sm font-medium text-[#2d1b1e] uppercase tracking-wider">New Season</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light leading-[0.9] mb-6 text-[#2d1b1e]">
              Discover
              <span className="block font-serif italic">Elegance</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-[#2d1b1e]/80 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Curated pieces for effortless everyday style — discover a collection designed to empower your unique beauty.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-[#2d1b1e] text-white hover:bg-[#4a3537] px-8 py-4 text-lg font-medium tracking-wide hover-lift group"
                asChild
              >
                <Link href="/products">
                  Shop Collection
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#2d1b1e] text-[#2d1b1e] hover:bg-[#2d1b1e] hover:text-white px-8 py-4 text-lg font-medium tracking-wide hover-lift"
                asChild
              >
                <Link href="/new-arrivals">
                  New Arrivals
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-[#2d1b1e]/20">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-light text-[#2d1b1e] mb-1">1000+</div>
                <div className="text-sm text-[#2d1b1e]/60 uppercase tracking-wider">Happy Customers</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-light text-[#2d1b1e] mb-1">500+</div>
                <div className="text-sm text-[#2d1b1e]/60 uppercase tracking-wider">Products</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-light text-[#2d1b1e] mb-1">50+</div>
                <div className="text-sm text-[#2d1b1e]/60 uppercase tracking-wider">Categories</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative animate-slide-in">
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative z-10 hover-lift">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm">
                  <Image
                    src="/elarose.jpg"
                    alt="ElaRose Fashion Collection"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    priority
                  />
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-white/30 rounded-full backdrop-blur-sm animate-float"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/40 rounded-full backdrop-blur-sm animate-float" style={{animationDelay: '1s'}}></div>

              {/* Decorative Card */}
              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg hover-lift">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#f2c9c7] rounded-full flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-[#2d1b1e]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#2d1b1e]">Premium Quality</div>
                    <div className="text-sm text-[#2d1b1e]/60">Handpicked Collection</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-[#2d1b1e]/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-[#2d1b1e]/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}