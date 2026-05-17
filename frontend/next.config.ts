import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: ["192.168.*.*"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        // Когда фронт шлет запрос на /api/v1/..., Next.js перенаправит его на бэк
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*', 
      },
    ];
  }
};
export default nextConfig;
