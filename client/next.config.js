/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  modularizeImports: {
    "react-icons": {
      transform: "react-icons/{{member}}",
    },
  },
  images: {
    domains: ["api.nobleasia.id"],
  },
}

module.exports = nextConfig
