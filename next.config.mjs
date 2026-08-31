/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), '@prisma/client', '@prisma/adapter-pg', 'pg'];
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: '/type/:type',
        destination: '/:type',
        permanent: true,
      },
      {
        source: '/type/:type/:subtype',
        destination: '/:type/:subtype',
        permanent: true,
      },
      {
        source: '/craft/:subtype',
        destination: '/handloom/:subtype',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
