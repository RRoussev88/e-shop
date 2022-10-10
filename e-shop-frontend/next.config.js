/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'localhost',
      'e-shop-kunz-rroussev88.vercel.app',
      'e-shop-kunz-git-master-rroussev88.vercel.app',
      'e-shop-kunz.vercel.app',
    ],
  },
}

module.exports = nextConfig
