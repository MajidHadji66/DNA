/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        const apiUrl = process.env.API_URL;
        const destination = apiUrl
            ? `${apiUrl}/:path*`
            : 'http://127.0.0.1:8000/:path*';

        return [
            {
                source: '/api/:path*',
                destination: destination,
            },
        ]
    },
}

module.exports = nextConfig
