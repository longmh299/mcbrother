/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    

    remotePatterns: [
      { protocol:'https', hostname:'*' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'mcbrother.net',   pathname: '/upload/**' }, // nếu vẫn dùng ảnh ở đây
    ],
  },
};

export default nextConfig;
