/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: process.env.API_URL
                    ? `${process.env.API_URL}/:path*`
                    : 'http://127.0.0.1:8000/:path*', // Default to localhost for dev
                // In Production (Cloud Run), ensure API_URL is set to your Backend Service URL.
            },
        ]
    },
}

module.exports = nextConfig
