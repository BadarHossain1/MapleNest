import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Commercial Real Estate in Canada | MapleNest',
  description: 'Find commercial real estate opportunities across Canada. Office spaces, retail locations, and investment properties.',
};

export default function CommercialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}