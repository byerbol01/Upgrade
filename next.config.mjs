/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/pages/configurator.html',
        destination: '/configurator',
      },
      {
        source: '/pages/buynow.html',
        destination: '/buynow',
      },
      {
        source: '/pages/igrovye-sborki.html',
        destination: '/igrovye-sborki',
      },
      {
        source: '/pages/information.html',
        destination: '/information',
      },
      {
        source: '/pages/news.html',
        destination: '/news',
      },
      {
        source: '/pages/trademarks.html',
        destination: '/trademarks',
      },
      {
        source: '/pages-for-pace/asus1.html',
        destination: '/pages-for-pace/asus1',
      },
      {
        source: '/pages-for-pace/asus2.html',
        destination: '/pages-for-pace/asus2',
      },
      {
        source: '/pages-for-pace/asus3.html',
        destination: '/pages-for-pace/asus3',
      },
      {
        source: '/pages-for-pace/monitor.html',
        destination: '/pages-for-pace/monitor',
      },
    ];
  },
};

export default nextConfig;
