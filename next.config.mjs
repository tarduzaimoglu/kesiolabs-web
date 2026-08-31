/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: "https://kesiolabs-slave1.tail4be241.ts.net:8443/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/main",
        destination: "/",
        permanent: true,
      },
    ];
  },
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
      {
        protocol: "https",
        hostname: "kesiolabs-slave1.tail4be241.ts.net",
        port: "8443",
        pathname: "/uploads/**",
      },

      // ✅ Supabase Storage (public)
     {
  protocol: "https",
  hostname: "**.storage.supabase.co",
  pathname: "/storage/v1/object/public/**",
},
    ],
  },
};

export default nextConfig;
