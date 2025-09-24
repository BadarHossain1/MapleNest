import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rental Properties in Canada | MapleNest',
  description: 'Find rental properties across Canada. Apartments, condos, and houses for rent in major Canadian cities.',
};

export default function RentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}