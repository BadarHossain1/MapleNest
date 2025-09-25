"use client"

import { Play, ShoppingBag, Heart, Eye, X, Clock } from 'lucide-react'
import { Button } from './ui/button'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { useState } from 'react'

export default function WatchAndShop() {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [showVideoModal, setShowVideoModal] = useState(false)

  const videos = [
    {
      id: 1,
      title: 'Spring Collection Lookbook',
      description: 'Discover the latest trends in our spring collection with elegant pieces',
      thumbnail: 'https://img.youtube.com/vi/6oVuANVuQWM/maxresdefault.jpg',
      videoId: '6oVuANVuQWM',
      duration: '2:45',
      views: '12.5K'
    },
    {
      id: 2,
      title: 'Professional Wear Guide',
      description: 'How to style your work wardrobe with confidence and elegance',
      thumbnail: 'https://img.youtube.com/vi/6oVuANVuQWM/maxresdefault.jpg',
      videoId: '6oVuANVuQWM',
      duration: '3:12',
      views: '18.2K'
    },
    {
      id: 3,
      title: 'Evening Glam Tutorial',
      description: 'Transform your look for special occasions with stunning pieces',
      thumbnail: 'https://img.youtube.com/vi/6oVuANVuQWM/maxresdefault.jpg',
      videoId: '6oVuANVuQWM',
      duration: '4:01',
      views: '25.7K'
    }
  ]

  const handlePlayVideo = (video) => {
    setSelectedVideo(video)
    setShowVideoModal(true)
  }

  const handleShopTheLook = () => {
    setShowComingSoonModal(true)
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-[#fef8f7] to-[#f2c9c7]/20">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-light mb-4 bg-gradient-to-r from-[#8B5446] to-[#f2c9c7] bg-clip-text text-transparent tracking-tight">
            Watch & Shop
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get inspired by our styling videos and shop the looks directly
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#f2c9c7] to-[#8B5446] mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group transform hover:-translate-y-2 animate-fade-up glass border border-[#f2c9c7]/20"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden group cursor-pointer">
                <ImageWithFallback
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Enhanced gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-[#8B5446]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="rounded-full bg-[#f2c9c7]/90 backdrop-blur-sm text-[#2d1b1e] hover:bg-[#f2c9c7] hover:scale-110 shadow-2xl transition-all duration-300 w-16 h-16 hover-glow"
                    onClick={() => handlePlayVideo(video)}
                  >
                    <Play className="h-8 w-8 ml-1" fill="currentColor" />
                  </Button>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-4 right-4 bg-[#8B5446]/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                  {video.duration}
                </div>

                {/* Views badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#8B5446] px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {video.views}
                </div>

                {/* Favorite button */}
                <div className="absolute top-4 left-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300 w-10 h-10"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-[#2d1b1e] group-hover:text-[#8B5446] transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{video.description}</p>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-[#f2c9c7] to-[#8B5446] text-white hover:from-[#edb3b0] hover:to-[#8B5446]/90 transition-all duration-300 py-3 font-medium tracking-wide hover-glow"
                  variant="default"
                  onClick={handleShopTheLook}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Shop This Look
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-up">
          <Button
            variant="outline"
            className="border-2 border-[#f2c9c7] text-[#8B5446] hover:bg-[#f2c9c7] hover:text-white transition-all duration-300 px-8 py-3 font-medium tracking-wide hover-glow"
          >
            <Play className="h-4 w-4 mr-2" />
            Watch More Style Videos
          </Button>
        </div>

        {/* Video Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-[#8B5446]">50+</div>
            <div className="text-sm text-gray-600">Style Videos</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-[#8B5446]">100K+</div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-[#8B5446]">200+</div>
            <div className="text-sm text-gray-600">Featured Products</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-[#8B5446]">5K+</div>
            <div className="text-sm text-gray-600">Happy Customers</div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="rounded-t-2xl"
              ></iframe>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-[#2d1b1e] mb-2">{selectedVideo.title}</h3>
              <p className="text-gray-600">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon Modal */}
      {showComingSoonModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center relative animate-fade-up">
            <button
              onClick={() => setShowComingSoonModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-[#f2c9c7] to-[#8B5446] rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#2d1b1e] mb-2">Coming Soon!</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We're working hard to bring you an amazing shopping experience. 
                Our "Shop the Look" feature will be available soon!
              </p>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={() => setShowComingSoonModal(false)}
                className="w-full bg-gradient-to-r from-[#f2c9c7] to-[#8B5446] text-white hover:from-[#edb3b0] hover:to-[#8B5446]/90 transition-all duration-300"
              >
                Got it!
              </Button>
              <p className="text-xs text-gray-500">
                Stay tuned for updates on our latest features
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}