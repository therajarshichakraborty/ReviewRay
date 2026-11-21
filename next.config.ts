import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['*.ngrok-free.app', '*.ngrok-free.dev', '*.ngrok.io'],
  experimental: {
    // React <ViewTransition> integration: route changes animate natively.
    viewTransition: true,
    // Keep visited dashboard pages in the client router cache briefly, so
    // jumping back and forth between tabs is instant instead of a fresh render.
    // Mutations (server actions, router.refresh) still purge this cache.
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    // Tree-shake barrel imports so each route ships less JavaScript.
    optimizePackageImports: ['lucide-react', 'date-fns', '@phosphor-icons/react', 'radix-ui'],
  },
};

export default nextConfig;
