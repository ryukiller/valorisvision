/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['valorisvisio.top', 'coin-images.coingecko.com', 'assets.coingecko.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'assets.coingecko.com',
                port: '',
                pathname: '/coins/**',
            },
            {
                protocol: 'https',
                hostname: 'coin-images.coingecko.com',
                port: '',
                pathname: '/coins/**',
            },
            {
                protocol: 'https',
                hostname: 'valorisvisio.top',
                port: '',
                pathname: '/**',
            },
        ],
    },
}

module.exports = nextConfig
