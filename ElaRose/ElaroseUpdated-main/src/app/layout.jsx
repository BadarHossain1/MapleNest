import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/hooks/useCart";
import { WishlistProvider } from "@/hooks/useWishlist";
import { ClerkProvider } from '@clerk/nextjs';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from "@/hooks/useToast";
import ConditionalLayout from "@/components/ConditionalLayout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ElaRose - Modern E-commerce",
  description: "Defining modern femininity through timeless elegance and contemporary style that empowers every woman.",
  keywords: "fashion, women's clothing, elegant dresses, modern style, ElaRose",
  authors: [{ name: "ElaRose Team" }],
  creator: "ElaRose",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://elarose.com",
    title: "ElaRose - Modern E-commerce",
    description: "Defining modern femininity through timeless elegance and contemporary style that empowers every woman.",
    siteName: "ElaRose",
  },
  twitter: {
    card: "summary_large_image",
    title: "ElaRose - Modern E-commerce",
    description: "Defining modern femininity through timeless elegance and contemporary style that empowers every woman.",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning={true}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          suppressHydrationWarning={true}
        >
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <ConditionalLayout>
                  {children}
                </ConditionalLayout>
                <Toaster />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
