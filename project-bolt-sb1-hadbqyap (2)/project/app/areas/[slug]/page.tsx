import { notFound } from 'next/navigation';
import { AreaDetailsClient } from '@/components/AreaDetailsClient';
import areasData from '@/data/areas.json';
import listingsData from '@/data/listings.json';

export async function generateStaticParams() {
  return areasData.map((area) => ({
    slug: area.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const area = areasData.find(a => a.slug === params.slug);
  
  if (!area) {
    return {
      title: 'Area Not Found | MapleNest',
    };
  }

  return {
    title: `${area.title}, ${area.city} - Neighborhood Guide | MapleNest`,
    description: area.description,
  };
}

export default async function AreaPage({ params }: { params: { slug: string } }) {
  const area = areasData.find(a => a.slug === params.slug);
  
  if (!area) {
    notFound();
  }

  const areaListings = listingsData
    .filter(l => l.city.toLowerCase() === area.city.toLowerCase())
    .slice(0, 3);

  return <AreaDetailsClient area={area} areaListings={areaListings} />;
}