/** @type {import('next').NextConfig} */
const path = require('path')
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nkkutctkebqaffekqfzx.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  sassOptions: {
    includePaths: [
      path.join(__dirname, 'styles'),
      path.join(__dirname, 'node_modules')
    ],
    silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'color-functions'],
  },
  webpack(config) {
    config.module.rules.forEach((rule) => {
      const { oneOf } = rule;
      if (oneOf) {
        oneOf.forEach((one) => {
          if (!`${one.issuer?.and}`.includes('_app')) return;
          one.issuer.and = [path.resolve(__dirname)];
        });
      }
    })
    return config;
  },

  // Security Headers - Essential for production security
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          // HTTP Strict Transport Security (HSTS)
          // Forces HTTPS for 2 years, includes subdomains, allows preload list
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          // Prevent MIME type sniffing attacks
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Legacy XSS protection for older browsers
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // Prevent clickjacking - allow same origin framing only
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          // Control referrer information in requests
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Restrict browser feature access
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()'
          },
          // DNS prefetch for performance
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          // Content Security Policy
          // Allows: self, Supabase, Cloudflare Turnstile, Google Fonts, Iconify, local API
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.supabase.co",
              // connect-src: API connections, WebSockets, Icon services
              "connect-src 'self' " + [
                // Production API (Railway)
                "https://jexr-api-production.up.railway.app",
                "https://*.railway.app",
                // Supabase
                "https://*.supabase.co",
                "wss://*.supabase.co",
                "https://*.upstash.io",
                // Iconify icon services
                "https://api.iconify.design",
                "https://api.unisvg.com",
                "https://api.simplesvg.com",
                // Local development
                "http://localhost:*",
                "ws://localhost:*",
                "http://127.0.0.1:*",
                "ws://127.0.0.1:*"
              ].join(" "),
              "frame-src https://challenges.cloudflare.com",
              "frame-ancestors 'self'",
              "form-action 'self'",
              "base-uri 'self'"
            ].join('; ')
          }
        ],
      },
    ];
  },

}



module.exports = nextConfig
