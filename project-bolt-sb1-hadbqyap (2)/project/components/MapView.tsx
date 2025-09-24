'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  listings: any[];
  center?: [number, number];
  showSearch?: boolean;
  className?: string;
}

export function MapView({ 
  listings, 
  center = [45.4215, -75.6972], // Default to Ottawa
  showSearch = true,
  className = 'h-full w-full'
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    mapRef.current = L.map(mapContainerRef.current).setView(center, 10);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !listings.length) return;

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add markers for listings
    const markers: L.Marker[] = [];
    const bounds = L.latLngBounds([]);

    listings.forEach((listing) => {
      if (listing.coordinates) {
        const [lat, lng] = listing.coordinates;
        
        // Create custom marker
        const marker = L.marker([lat, lng])
          .bindPopup(`
            <div class="p-2 min-w-[200px]">
              <img src="${listing.images[0]}" alt="${listing.title}" class="w-full h-24 object-cover rounded mb-2" />
              <h3 class="font-semibold text-sm mb-1">${listing.title}</h3>
              <p class="text-xs text-gray-600 mb-2">${listing.address}</p>
              <p class="font-bold text-emerald-600">$${listing.priceCAD.toLocaleString()}</p>
              <a href="/listing/${listing.slug}" class="inline-block mt-2 px-3 py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700">
                View Details
              </a>
            </div>
          `)
          .addTo(mapRef.current!);

        markers.push(marker);
        bounds.extend([lat, lng]);
      }
    });

    // Fit map to bounds if we have markers
    if (markers.length > 0) {
      mapRef.current.fitBounds(bounds, { padding: [20, 20] });
    }

  }, [listings]);

  return <div ref={mapContainerRef} className={className} />;
}