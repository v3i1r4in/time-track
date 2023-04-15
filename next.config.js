/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

const withRPC = require('next-rpc');

module.exports = withRPC(nextConfig)();
// module.exports = nextConfig;
