# MapleNest - Canadian Real Estate Platform

A modern, production-ready real estate website built for the Canadian market using Next.js 14, TypeScript, and Tailwind CSS.

## Features

### 🏠 Property Search & Discovery
- Advanced search with multiple filters (location, price, property type, bedrooms, bathrooms)
- Interactive map view with property clustering using Leaflet + OpenStreetMap
- Grid and map view toggle for listings
- Real-time filtering without page reloads
- Comprehensive property details with photo galleries

### 🗺️ Geographic Coverage
- **Major Cities**: Toronto, Vancouver, Montreal, Calgary, Ottawa
- **30+ Properties**: Diverse mix of condos, detached homes, townhouses, and commercial spaces
- **Neighborhood Guides**: Detailed area information with lifestyle insights, amenities, and market data

### 👥 Agent Directory
- **12+ Professional Agents** with detailed profiles
- Multilingual support (English, French, Mandarin, Cantonese, Korean, Spanish)
- Specialization filtering (luxury, commercial, first-time buyers, etc.)
- Direct contact integration with phone and email

### 💰 Financial Tools
- **Canadian Mortgage Calculator** with CMHC insurance calculations
- Property tax and insurance estimates
- Multiple payment frequency options (monthly, bi-weekly, weekly)
- Loan-to-value ratio calculations

### 📱 User Experience
- **Responsive Design**: Mobile-first approach with breakpoints for tablet and desktop
- **Smooth Animations**: Framer Motion for page transitions and micro-interactions
- **Accessibility**: WCAG AA compliant with proper ARIA labels and keyboard navigation
- **Performance**: Optimized images, lazy loading, and efficient re-rendering

### 💾 Data Persistence
- **Local Storage Integration**: Save favorite properties and search criteria
- **User Preferences**: Persistent settings across sessions
- **Search History**: Track and revisit previous searches

### 🎨 Design System
- **Emerald Green Theme**: Professional Canadian-inspired color palette
- **Modern Typography**: Inter font with clear hierarchy
- **Consistent Spacing**: 8px grid system throughout
- **Card-based Layouts**: Clean, organized information presentation

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Maps**: Leaflet with OpenStreetMap
- **Icons**: Lucide React
- **Data**: Static JSON files (no backend required)

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── buy/               # For sale listings
│   ├── rent/              # Rental listings
│   ├── commercial/        # Commercial properties
│   ├── listing/[slug]/    # Individual property pages
│   ├── areas/             # Neighborhood guides
│   ├── agents/            # Agent directory
│   ├── mortgage/          # Mortgage calculator
│   └── saved/             # User's saved items
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── Header.tsx        # Navigation header
│   ├── PropertyCard.tsx  # Property listing card
│   ├── MapView.tsx       # Interactive map component
│   └── ...
├── data/                 # Static JSON data files
│   ├── listings.json     # Property listings
│   ├── agents.json       # Real estate agents
│   ├── areas.json        # Neighborhood data
│   └── cities.json       # City information
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── public/               # Static assets
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd maplenest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Data Structure

### Properties (`data/listings.json`)
Each property includes:
- Basic info (price, address, coordinates)
- Property details (beds, baths, square footage, year built)
- Images and features
- Broker information
- Market data (days on market, verification status)

### Agents (`data/agents.json`)
Agent profiles contain:
- Contact information and headshot
- Service areas and specialties
- Languages spoken
- Experience and credentials
- Client reviews and ratings

### Areas (`data/areas.json`)
Neighborhood guides include:
- Demographics and market data
- Lifestyle features and amenities
- Schools and transportation
- Photo galleries
- Average pricing by property type

## Key Features Implementation

### Search & Filtering
- Multi-criteria search with real-time results
- Advanced filters with sticky positioning
- Sort options (price, date, size, bedrooms)
- Location-based search with autocomplete

### Interactive Maps
- Leaflet integration with OpenStreetMap tiles
- Property markers with clustering
- Synchronized map/list views
- Interactive property popups with details

### User Personalization
- Save favorite properties (localStorage)
- Save search criteria for future use
- Property comparison functionality
- Persistent user preferences

### Canadian Market Focus
- CAD pricing throughout
- Canadian mortgage calculations with CMHC
- Provincial and city-specific data
- Bilingual content support (English/French)

## Performance Optimizations

- **Next.js Image Component**: Automatic image optimization
- **Lazy Loading**: Deferred loading for non-critical content
- **Code Splitting**: Route-based code splitting
- **Efficient State Management**: React hooks with optimized re-renders
- **Skeleton Loading**: Smooth loading states for better UX

## SEO & Accessibility

- **Dynamic Metadata**: Page-specific titles and descriptions
- **OpenGraph Tags**: Social media sharing optimization
- **Schema.org Markup**: Structured data for search engines
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and descriptions

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Property images from Pexels
- Map data from OpenStreetMap contributors
- Icons from Lucide React
- UI components from shadcn/ui

---

**MapleNest** - Find Your Perfect Canadian Home 🍁