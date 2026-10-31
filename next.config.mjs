/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer', 'sharp'],
    // pdfkit (used by @react-pdf) loads its font files by a computed name, which file tracing can't see,
    // so without this the PDF/send routes crash on Vercel with "Cannot find module .../standard-fonts/Helvetica.cjs".
    outputFileTracingIncludes: {
      '/api/invoices/[id]/pdf': ['./node_modules/pdfkit/js/**/*'],
      '/api/invoices/[id]/send': ['./node_modules/pdfkit/js/**/*'],
      '/api/sign/[token]': ['./node_modules/pdfkit/js/**/*'],
      '/api/sign/[token]/pdf': ['./node_modules/pdfkit/js/**/*'],
    },
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
