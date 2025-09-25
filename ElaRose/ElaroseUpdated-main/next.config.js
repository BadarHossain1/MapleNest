/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Configure Turbopack root to suppress workspace warning
  turbopack: {
    root: 'd:\\projects\\ElaRose\\ElaroseUpdated-main',
  },
};

export default nextConfig;
