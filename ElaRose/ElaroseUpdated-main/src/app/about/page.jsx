"use client"

import { useState } from 'react';
import { Heart, Star, Users, Award, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import Link from 'next/link';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('story');

  const stats = [
    { icon: Users, value: '10K+', label: 'Happy Customers' },
    { icon: Star, value: '4.9', label: 'Average Rating' },
    { icon: Award, value: '5+', label: 'Years Experience' },
    { icon: Heart, value: '50K+', label: 'Products Sold' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Quality First',
      description: 'We source only the finest materials and work with trusted suppliers to ensure every product meets our high standards.'
    },
    {
      icon: Heart,
      title: 'Customer Love',
      description: 'Your satisfaction is our priority. We go above and beyond to ensure you have an amazing shopping experience.'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping worldwide. Most orders are processed and shipped within 24 hours.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Continuous innovation and improvement in our products, services, and customer experience.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      bio: 'Fashion enthusiast with 10+ years in retail, passionate about bringing quality products to customers worldwide.'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Design',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      bio: 'Creative director with experience at top fashion brands, focusing on innovative and sustainable designs.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Customer Experience',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      bio: 'Dedicated to ensuring every customer has an exceptional experience from browsing to delivery.'
    }
  ];

  const tabs = [
    { id: 'story', label: 'Our Story' },
    { id: 'values', label: 'Values' },
    { id: 'team', label: 'Team' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f2c9c7]/20 via-white to-[#f2c9c7]/10">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#f2c9c7]/5 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#f2c9c7]/3 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-[#f2c9c7]/2 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in transform-gpu">
            <div className="card-glass rounded-3xl p-16 mb-16">
              <h1 className="text-6xl md:text-7xl font-bold text-[#c66074] mb-8">
                About ElaRose
              </h1>
              <p className="text-2xl text-[#8B5446]/70 mb-12 leading-relaxed">
                Where passion meets fashion. We're dedicated to bringing you the finest collection
                of carefully curated products that blend style, quality, and affordability.
              </p>
              <div className="flex justify-center">
                <Link href="/">
                  <Button size="lg" className="btn-sexy px-12 py-4 text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                    Shop Our Collection
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto animate-fade-in-up stagger-1">'
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-16 h-16 bg-[#f2c9c7]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-[#8B5446]" />
                </div>
                <div className="text-3xl font-bold text-[#8B5446] mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-12">
              <div className="bg-[#f2c9c7]/10 p-2 rounded-full">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${activeTab === tab.id
                        ? 'bg-[#8B5446] text-white shadow-lg'
                        : 'text-[#8B5446] hover:bg-[#f2c9c7]/20'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
              {activeTab === 'story' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <h2 className="text-3xl font-light text-[#8B5446] mb-6">Our Journey</h2>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <p>
                        ElaRose was born from a simple belief: everyone deserves access to beautiful,
                        high-quality fashion that doesn't break the bank. Founded in 2019 by a team
                        of fashion enthusiasts, we started as a small boutique with a big dream.
                      </p>
                      <p>
                        What began as a passion project quickly grew into something much larger.
                        We discovered that our customers weren't just looking for clothes – they
                        were looking for pieces that made them feel confident, beautiful, and authentically themselves.
                      </p>
                      <p>
                        Today, ElaRose serves customers across the globe, but our mission remains
                        the same: to curate and deliver exceptional fashion that celebrates
                        individuality and empowers personal expression.
                      </p>
                      <p>
                        Every item in our collection is carefully selected with our customers
                        in mind. We believe in sustainable practices, ethical sourcing, and
                        building lasting relationships with both our customers and suppliers.
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="aspect-square bg-gradient-to-br from-[#f2c9c7]/20 to-[#8B5446]/20 rounded-3xl overflow-hidden">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop"
                        alt="ElaRose Store"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#f2c9c7] rounded-full opacity-80 blur-xl"></div>
                    <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#8B5446]/30 rounded-full opacity-60 blur-xl"></div>
                  </div>
                </div>
              )}

              {activeTab === 'values' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {values.map((value, index) => (
                    <div
                      key={index}
                      className="group bg-gradient-to-br from-white to-[#f2c9c7]/5 p-8 rounded-2xl border border-[#f2c9c7]/20 hover:shadow-xl transition-all duration-300 animate-slide-up"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="w-16 h-16 bg-[#8B5446]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#8B5446] group-hover:scale-110 transition-all duration-300">
                        <value.icon className="h-8 w-8 text-[#8B5446] group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h3 className="text-xl font-semibold text-[#8B5446] mb-3">{value.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'team' && (
                <div>
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-light text-[#8B5446] mb-4">Meet Our Team</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      The passionate people behind ElaRose, working every day to bring you
                      the best shopping experience and curated fashion finds.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {team.map((member, index) => (
                      <div
                        key={index}
                        className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#f2c9c7]/20 animate-slide-up"
                        style={{ animationDelay: `${index * 200}ms` }}
                      >
                        <div className="relative mb-6">
                          <div className="aspect-square bg-gradient-to-br from-[#f2c9c7]/20 to-[#8B5446]/20 rounded-2xl overflow-hidden">
                            <ImageWithFallback
                              src={member.image}
                              alt={member.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        </div>
                        <div className="text-center">
                          <h3 className="text-xl font-semibold text-[#8B5446] mb-1">{member.name}</h3>
                          <p className="text-[#f2c9c7] font-medium mb-3">{member.role}</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-[#8B5446] to-[#f2c9c7]">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h2 className="text-4xl font-light text-white mb-6">
              Ready to Discover Your Style?
            </h2>
            <p className="text-white/90 text-lg mb-8 leading-relaxed">
              Join thousands of satisfied customers who've found their perfect pieces with ElaRose.
              Browse our curated collection and find something you'll love.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button size="lg" variant="secondary" className="bg-white text-[#8B5446] hover:bg-white/90 px-8 py-3">
                  Shop Collection
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#8B5446] px-8 py-3">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="py-16 bg-[#f2c9c7]/5">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-light text-[#8B5446] mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to know about new arrivals, exclusive offers, and style inspiration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-[#f2c9c7]/30 focus:outline-none focus:ring-2 focus:ring-[#f2c9c7] focus:border-transparent"
              />
              <Button className="bg-[#8B5446] hover:bg-[#f2c9c7] hover:text-[#8B5446] text-white px-6 py-3">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}