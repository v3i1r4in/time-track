/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

const withRPC = require('next-rpc');
const withPWA = require('next-pwa')({
  dest: 'public'
});

module.exports = withPWA(withRPC(nextConfig)());
// module.exports = nextConfig;
