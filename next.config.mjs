/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 🔥 Next 16 güvenlik kuralı: localhost / 127.0.0.1 default olarak BLOKLU
    // Bunu açmadan Strapi local image asla çalışmaz
    dangerouslyAllowLocalIP: true,

    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
        pathname: "/uploads/**",
      },

      // ✅ Supabase Storage (public)
      {
        protocol: "https",
        hostname: "qwxzrxmmhmvkjdqudtxb.storage.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
