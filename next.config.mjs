/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost',      pathname: '/**'       },
      { protocol: 'http',  hostname: '127.0.0.1',      pathname: '/**'       },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**'   },
      { protocol: 'https', hostname: 'mcbrother.net',   pathname: '/upload/**' }, // nếu vẫn dùng ảnh ở đây
    ],
  },
};

export default nextConfig;
