import ListingDetailsClient from '@/components/ListingDetailsClient';
import listingsData from '@/data/listings.json';

export async function generateStaticParams() {
  return listingsData.map((listing) => ({
    slug: listing.slug,
  }));
}

export default function ListingPage({ params }: { params: { slug: string } }) {
  return <ListingDetailsClient slug={params.slug} />;
}