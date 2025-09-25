"use client";

import { usePathname } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ConditionalLayout({ children }) {
    const pathname = usePathname();

    // Check if we're on an admin route
    const isAdminRoute = pathname?.startsWith('/admin');

    if (isAdminRoute) {
        // Admin routes - no header/footer, full screen
        return (
            <div className="min-h-screen" suppressHydrationWarning={true}>
                {children}
            </div>
        );
    }

    // Regular routes - with header and footer
    return (
        <div className="relative flex min-h-screen flex-col" suppressHydrationWarning={true}>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}