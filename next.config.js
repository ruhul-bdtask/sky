/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: ["pics.avs.io"], // Add the hostname here
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
