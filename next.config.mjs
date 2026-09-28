/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "/**": ["./node_modules/sharp/**/*", "./node_modules/@img/**/*"],
  },
  images: {
    // The S3 host is read at build time, so it must be passed in as a build arg
    // (see Dockerfile) — the runtime env_file is not available during the build.
    // Not a secret: this hostname is visible in every image URL the browser loads.
    remotePatterns: [
      ...(process.env.S3_ENDPOINT
        ? [{ protocol: "https", hostname: process.env.S3_ENDPOINT }]
        : []),
      // Placeholder images for development — remove before production
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
};

export default nextConfig;
