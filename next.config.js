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

}



module.exports = nextConfig
