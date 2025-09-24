import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Neighborhood Guides | MapleNest',
  description: 'Explore Canadian neighborhoods and communities. Get insights into lifestyle, amenities, schools, and real estate trends.',
};

export default function AreasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}