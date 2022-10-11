/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'localhost',
      // 'e-shop-kunz-rroussev88.vercel.app',
      // 'e-shop-kunz-git-master-rroussev88.vercel.app',
      // 'e-shop-kunz.vercel.app',
      // 'https://e-shop-images.s3.eu-central-1.amazonaws.com',
      // `https://${process.env.AWS_BUCKET_NAME || 'e-shop-images'}.s3.${
      //   process.env.AWS_REGION_NAME || 'eu-central-1'
      // }.amazonaws.com`,
    ],
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
}

module.exports = nextConfig
