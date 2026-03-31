/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Disable the useSearchParams Suspense bailout error — all dashboard pages
  // use the useAuth hook which calls useSearchParams(). These pages are fully
  // client-rendered so the bailout is a false positive.
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { hostname: 'localhost' },
      { hostname: '*.multando.com' },
    ],
  },
  webpack: (config) => {
    // Ignore optional native modules that aren't available in Docker
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'pino-pretty': false,
    };
    return config;
  },
};

export default nextConfig;
