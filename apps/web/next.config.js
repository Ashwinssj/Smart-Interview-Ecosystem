/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ];
  },
  // Ensure env vars are available in middleware (edge runtime)
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://lqwivinhdxbrykyidbmv.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxxd2l2aW5oZHhicnlreWlkYm12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2OTgyMzksImV4cCI6MjEwNzI3NDIzOX0.xMLgz_HwaPURbXDTu6t_ffxyUrq3eurOtUduJnpQPv8',
    SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxxd2l2aW5oZHhicnlreWlkYm12Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTY5ODIzOSwiZXhwIjoyMTA3Mjc0MjM5fQ.fWCEFK6XJn4J_acMxP047Ev-jtPDHfycrm6AEpMRzi8',
  },
};

module.exports = nextConfig;