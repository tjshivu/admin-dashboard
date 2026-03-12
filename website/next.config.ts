import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compression
  compress: true,

  // Powered-by header removed for security
  poweredByHeader: false,

  // Strict mode for catching bugs
  reactStrictMode: true,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: 'h8DxKfmAPhn8O0p3.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'api.brikuptech.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // API proxy rewrite for admin dashboard
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL || 'https://api.brikuptech.com/api'}/:path*`,
      },
    ];
  },

  // Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://randomuser.me https://api.qrserver.com https://h8DxKfmAPhn8O0p3.public.blob.vercel-storage.com https://api.brikuptech.com https://ik.imagekit.io",
              `connect-src 'self' https://api.brikuptech.com${process.env.NODE_ENV === 'development' ? ' http://localhost:* ws://localhost:*' : ''}`,
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
      // Cache static assets
      {
        source: '/svg/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
