/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Allow requests from Django server
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'http://127.0.0.1:8000' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With, Content-Type, Accept' }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
