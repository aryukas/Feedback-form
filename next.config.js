/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    return config; // use Webpack instead of Turbopack
  },
  experimental: {
    turbo: false, // fully disable Turbopack
  },
};

module.exports = nextConfig;
