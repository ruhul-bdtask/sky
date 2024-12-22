/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: [
      "pics.avs.io",
      "143.110.191.53",
      "tbbd-flight.s3.ap-southeast-1.amazonaws.com",
    ],
  },
  productionBrowserSourceMaps: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};
