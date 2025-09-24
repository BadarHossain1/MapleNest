import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Homes for Sale in Canada | MapleNest',
  description: 'Browse homes for sale across Canada. Find your perfect property in Toronto, Vancouver, Montreal, Calgary, Ottawa and more.',
};

export default function BuyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}