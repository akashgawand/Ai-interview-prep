import path from 'path';

const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  webpack(config) {
    // Ensure the alias resolves to the root directory, where utils is located
    config.resolve.alias['@'] = path.join(process.cwd()); 
    return config;
  },
};

export default nextConfig;
