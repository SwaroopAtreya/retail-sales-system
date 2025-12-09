/** @type {import('next').NextConfig} */
const nextConfig = {
  // We do NOT use 'swcMinify' here as it is default in Next.js 16
  // We do NOT need 'output: standalone' for Railway usually, but it helps if builds fail
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;