/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["links.papareact.com", "cdn.sanity.io", "accountabilitylab.org"],
  },
};

module.exports = nextConfig;
