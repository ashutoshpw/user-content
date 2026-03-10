/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@user-content/runtime-protocol',
    '@user-content/design-system',
    '@user-content/ui-runtime',
    '@user-content/video-runtime',
  ],
};

module.exports = nextConfig;
