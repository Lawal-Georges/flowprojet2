/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Vos options Turbopack si nécessaire
  },
  allowedDevOrigins: ['192.168.56.1'],
  // Autres configurations...

  webpack: (config: { externals: unknown[]; }) => {
    config.externals = [...config.externals, 'quill'];
    return config;
  }

}

export default nextConfig