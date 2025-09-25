"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

// Categories with images from public folder
const categories = [
  {
    name: "Professional",
    title: "Professional Wear",
    slug: "professional",
    img: "/elarose.jpg", // Using existing image as placeholder
    description: "Elegant business attire for the modern professional"
  },
  {
    name: "Casual",
    title: "Casual Collection",
    slug: "casual",
    img: "/elarose.jpg",
    description: "Comfortable and stylish everyday wear"
  },
  {
    name: "Footwear",
    title: "Premium Footwear",
    slug: "footwear",
    img: "/elarose.jpg",
    description: "Step up your style with our curated footwear"
  },
  {
    name: "Accessories",
    title: "Fashion Accessories",
    slug: "accessories",
    img: "/elarose.jpg",
    description: "Complete your look with our premium accessories"
  },
  {
    name: "Seasonal",
    title: "Seasonal Collection",
    slug: "seasonal",
    img: "/elarose.jpg",
    description: "Stay trendy with our seasonal must-haves"
  },
  {
    name: "Premium",
    title: "Premium Line",
    slug: "premium",
    img: "/elarose.jpg",
    description: "Luxury fashion for the discerning individual"
  },
  {
    name: "Youth",
    title: "Youth Collection",
    slug: "youth",
    img: "/elarose.jpg",
    description: "Fresh styles for the young and bold"
  }
];

function AnimatedHeroCarousel() {
  const [activeItem, setActiveItem] = useState(Math.floor(categories.length / 2));
  const wrapperRef = useRef(null);
  const timeoutRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!wrapperRef.current) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    wrapperRef.current.style.setProperty("--transition", "600ms cubic-bezier(0.22, 0.61, 0.36, 1)");
    timeoutRef.current = setTimeout(() => {
      wrapperRef.current?.style.removeProperty("--transition");
    }, 900);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [activeItem]);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveItem((prev) => (prev + 1) % categories.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (category) => {
    router.push(`/category/${category.slug}`);
  };

  return (
    <div className="w-full font-sans bg-gradient-to-br from-[#f2c9c7] via-white to-[#f2c9c7] min-h-screen flex items-center">
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-4 tracking-tight">
            Discover Your Style
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explore our curated collections and find the perfect pieces that define your unique style
          </p>
        </div>

        {/* Animated Carousel */}
        <ul 
          ref={wrapperRef} 
          className="flex w-full flex-col gap-4 md:h-[640px] md:flex-row md:gap-[1.5%]"
        >
          {categories.map((category, index) => (
            <li
              onClick={() => {
                setActiveItem(index);
                setTimeout(() => handleCategoryClick(category), 300);
              }}
              aria-current={activeItem === index}
              className={classNames(
                "relative group cursor-pointer transition-all duration-500 ease-in-out hover:scale-105",
                "md:w-[8%]",
                "md:[&[aria-current='true']]:w-[48%]",
                "md:[transition:width_var(--transition,300ms_ease_in)]",
                "transform-gpu will-change-transform"
              )}
              key={category.name}
            >
              <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 ease-in-out group-hover:shadow-3xl border-4 border-white/50 backdrop-blur-sm">
                {/* Background with overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#f2c9c7] to-[#e8b4b1]" />
                
                <img
                  className={classNames(
                    "absolute left-1/2 top-1/2 h-full w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-cover transition-all duration-700 ease-in-out mix-blend-overlay opacity-60",
                    activeItem === index ? "scale-110 grayscale-0" : "scale-100 grayscale"
                  )}
                  src={category.img}
                  alt={category.name}
                  width="590"
                  height="640"
                />

                {/* Gradient Overlay */}
                <div
                  className={classNames(
                    "absolute inset-0 transition-all duration-500",
                    activeItem === index ? "opacity-100" : "opacity-80",
                    "bg-gradient-to-t from-[#f2c9c7]/90 via-[#f2c9c7]/50 to-transparent"
                  )}
                />

                {/* Content */}
                <div
                  className={classNames(
                    "absolute bottom-0 left-0 w-full p-6 text-gray-800 transition-[transform,opacity] duration-700 ease-in-out md:p-8",
                    activeItem === index ? "translate-y-0 opacity-100" : "translate-y-8 opacity-70"
                  )}
                >
                  <p className="text-sm font-semibold uppercase tracking-widest text-gray-700 md:text-base mb-2">
                    {category.name}
                  </p>
                  <p 
                    className="text-2xl font-bold tracking-tight md:text-5xl mb-3" 
                    style={{
                      textShadow: "2px 2px 8px rgba(242,201,199,0.8)"
                    }}
                  >
                    {category.title}
                  </p>
                  {activeItem === index && (
                    <p className="text-sm md:text-lg text-gray-700 leading-relaxed opacity-0 animate-fade-in-up">
                      {category.description}
                    </p>
                  )}
                </div>

                {/* Click Indicator */}
                {activeItem === index && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg animate-pulse">
                    <svg className="w-6 h-6 text-[#f2c9c7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-8 space-x-3">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveItem(index)}
              className={classNames(
                "w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125",
                activeItem === index 
                  ? "bg-[#f2c9c7] shadow-lg scale-125" 
                  : "bg-gray-400 hover:bg-gray-500"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnimatedHeroCarousel;