import AnimatedHeroCarousel from '@/components/AnimatedHeroCarousel';
import { ShopByCategories } from '@/components/ShopByCategories';
import { NewArrivals } from '@/components/NewArrivals';
import WatchAndShop from '@/components/WatchAndShop';
import { TopCollections } from '@/components/TopCollections';
import HeroSection from '@/components/HeroSection';

export default function HomePage() {
  return (
    <main className="bg-gradient-to-br from-[#f2c9c7]/20 via-white to-[#f2c9c7]/20">
      <HeroSection />
      <AnimatedHeroCarousel />
      <ShopByCategories />
      <NewArrivals />
      <WatchAndShop />
      <TopCollections />
    </main>
  );
}