/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false, // Recommended for the `pages` directory, default in `app`.
  
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 5000,
      followSymlinks:true
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
