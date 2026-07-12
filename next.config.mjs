/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "/**": ["./node_modules/sharp/**/*", "./node_modules/@img/**/*"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "s3.firstvds.ru" },
      // Placeholder images for development — remove before production
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
};

export default nextConfig;
