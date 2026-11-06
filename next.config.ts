import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const contentSecurityPolicy = [
  "default-src 'self'",
  // next/og and next/font emit inline styles, Tailwind ships a stylesheet.
  "style-src 'self' 'unsafe-inline'",
  // Vercel Analytics and Speed Insights load only when ENABLE_VERCEL_ANALYTICS=1.
  `script-src 'self' 'unsafe-inline'${isProd ? '' : " 'unsafe-eval'"} https://va.vercel-scripts.com`,
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://*.vercel-scripts.com https://vitals.vercel-insights.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  // Analytics components are rendered only when the flag is set at build time.
  env: {
    NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED:
      isProd && process.env.ENABLE_VERCEL_ANALYTICS === '1' ? '1' : '0',
  },
};

export default nextConfig;
