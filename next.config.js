let withBundleAnalyzer = (config) => config;

if (process.env.ANALYZE === "true") {
  try {
    const bundleAnalyzer = require("@next/bundle-analyzer");
    withBundleAnalyzer = bundleAnalyzer({ enabled: true });
  } catch (err) {
    console.warn("Bundle analyzer not available in production.");
  }
}

// const backendHost = process.env.NEXT_PUBLIC_API_BASE;

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "blogspaneluat.omlogistics.co.in",
        port: "5000",
        pathname: "/api/blogs/**",
      },
      {
        protocol: "https",
        hostname: "yourdomain.com",
        pathname: "/**",
      },
    ],
  },
});