import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      'daisyui',
      '@clerk/nextjs',
      'react-quill-new'
    ],
    esmExternals: 'loose' // Important pour DaisyUI
  },
  transpilePackages: [
    'daisyui',
    'react-quill-new'
  ]
}

export default nextConfig