/** @type {import('next').NextConfig} */
import i18nextConfig from "./next-i18next.config.js";

const nextConfig = {
  i18n: i18nextConfig.i18n,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.kidsread.app",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

