/** @type {import('next').NextConfig} */

import withPlugins from 'next-compose-plugins';
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig = {
  reactStrictMode: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.icons8.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kr-a.kakaopagecdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image-comic.pstatic.net',
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 60,
  },
};

export default withPlugins([
  [
    withBundleAnalyzer({
      enabled: process.env.ANALYZE === 'true',
    }),
  ],
  nextConfig,
]);
