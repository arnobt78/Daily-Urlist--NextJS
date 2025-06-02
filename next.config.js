/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['*'], // Allow images from all domains
  }
}

module.exports = nextConfig 