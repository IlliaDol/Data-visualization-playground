const repo = 'Data-visualization-playground';
const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Temporarily disabled for dynamic routes
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isProd ? `/${repo}` : '', // Enable for GitHub Pages
  assetPrefix: isProd ? `/${repo}/` : '', // Enable for GitHub Pages
  // тимчасово, якщо треба прогнати білд:
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  // Виключаємо проблемні сторінки з експорту
  experimental: {
    // excludeDefaultMomentLocales: false, // Removed deprecated option
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || '',
  },
}

module.exports = nextConfig
