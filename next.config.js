/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle WASM modules
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // Handle CSV and other data files
    config.module.rules.push({
      test: /\.(csv|tsv)$/,
      use: 'raw-loader',
    });

    // Handle geospatial data
    config.module.rules.push({
      test: /\.(geojson|topojson)$/,
      use: 'json-loader',
    });

    return config;
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || '',
  },
}

module.exports = nextConfig
